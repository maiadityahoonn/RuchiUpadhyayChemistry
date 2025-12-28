import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Profile {
  id: string;
  user_id: string;
  username: string | null;
  avatar_url: string | null;
  xp: number;
  level: number;
  streak: number;
  last_activity_date: string | null;
  referral_code?: string;
  reward_points: number;
  weekly_xp?: number;
  monthly_xp?: number;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (email: string, password: string, username?: string) => Promise<{ user: User | null; error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
  addXP: (amount: number) => Promise<void>;
  addRewardPoints: (amount: number) => Promise<void>;
  createProfile: () => Promise<void>;
  refetchProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }

    if (data) {
      checkDailyStreak(data as Profile);
    }

    return data as Profile | null;
  };

  const checkDailyStreak = async (userProfile: Profile) => {
    const today = new Date().toISOString().split('T')[0];
    const lastActivity = userProfile.last_activity_date ? userProfile.last_activity_date.split('T')[0] : null;

    if (lastActivity === today) return; // Already updated today

    let newStreak = userProfile.streak;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (lastActivity === yesterdayStr) {
      newStreak += 1;
    } else {
      newStreak = 1;
    }

    // Reward for login
    const LOGIN_REWARD = 10;

    const updates = {
      streak: newStreak,
      last_activity_date: new Date().toISOString(),
      reward_points: userProfile.reward_points + LOGIN_REWARD,
      xp: userProfile.xp + LOGIN_REWARD
    };

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('user_id', userProfile.user_id);

    if (!error) {
      setProfile(prev => prev ? { ...prev, ...updates } : null);
      toast({
        title: 'Daily Streak Updated!',
        description: `You've earned ${LOGIN_REWARD} XP for your ${newStreak} day streak!`,
      });
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        // Defer profile fetch with setTimeout to avoid deadlock
        if (session?.user) {
          setTimeout(() => {
            fetchProfile(session.user.id).then(setProfile);
          }, 0);
        } else {
          setProfile(null);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id).then(setProfile);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, username?: string) => {
    const redirectUrl = `${window.location.origin}/`;

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          username: username || email.split('@')[0],
        },
      },
    });

    if (error) {
      toast({
        title: 'Sign up failed',
        description: error.message,
        variant: 'destructive',
      });
      return { user: null, error };
    }

    const newUser = (await supabase.auth.getUser()).data.user;

    toast({
      title: 'Account created!',
      description: 'You have been signed in automatically.',
    });

    return { user: newUser, error: null };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast({
        title: 'Sign in failed',
        description: error.message,
        variant: 'destructive',
      });
      return { error };
    }

    toast({
      title: 'Welcome back!',
      description: 'You have signed in successfully.',
    });

    return { error: null };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: 'Sign out failed',
        description: error.message,
        variant: 'destructive',
      });
      return;
    }
    setProfile(null);
    toast({
      title: 'Signed out',
      description: 'You have been signed out.',
    });
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return;

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('user_id', user.id);

    if (error) {
      toast({
        title: 'Update failed',
        description: error.message,
        variant: 'destructive',
      });
      return;
    }

    setProfile((prev) => prev ? { ...prev, ...updates } : null);
  };

  const addXP = async (amount: number) => {
    if (!user || !profile) return;

    const newXP = profile.xp + amount;
    const newPoints = profile.reward_points + amount;
    const newLevel = Math.floor(newXP / 1000) + 1;

    await updateProfile({
      xp: newXP,
      level: newLevel,
      reward_points: newPoints,
      weekly_xp: (profile.weekly_xp || 0) + amount,
      monthly_xp: (profile.monthly_xp || 0) + amount
    });
  };

  const addRewardPoints = async (amount: number) => {
    if (!user || !profile) return;
    const newPoints = profile.reward_points + amount;
    await updateProfile({ reward_points: newPoints });
  };

  const createProfile = async () => {
    if (!user) return;

    // Generate a random referral code
    const referralCode = 'REF' + Math.random().toString(36).substring(2, 8).toUpperCase();

    const newProfile = {
      user_id: user.id,
      username: user.email?.split('@')[0] || 'User',
      xp: 0,
      reward_points: 0,
      level: 1,
      streak: 0,
      referral_code: referralCode,
    };

    const { data, error } = await supabase
      .from('profiles')
      .insert([newProfile])
      .select()
      .single();

    if (error) {
      console.error('Error creating profile:', error);
      toast({
        title: 'Failed to create profile',
        description: error.message,
        variant: 'destructive',
      });
      return;
    }

    setProfile(data as Profile);
    toast({
      title: 'Profile Created',
      description: 'Your profile has been initialized successfully.',
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        signUp,
        signIn,
        signOut,
        updateProfile,
        addXP,
        addRewardPoints,
        createProfile,
        refetchProfile: () => user ? fetchProfile(user.id).then(setProfile) : Promise.resolve(null),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
