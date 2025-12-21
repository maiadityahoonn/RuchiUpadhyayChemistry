import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface Referral {
  id: string;
  referrer_id: string;
  referred_user_id: string | null;
  referral_code: string;
  points_earned: number;
  status: string;
  created_at: string;
  completed_at: string | null;
}

const REFERRAL_POINTS = 100; // Points earned per successful referral

export const useReferrals = () => {
  const { user, profile } = useAuth();
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [rewardPoints, setRewardPoints] = useState(0);

  const fetchReferrals = async () => {
    if (!user) {
      setReferrals([]);
      setLoading(false);
      return;
    }

    // Fetch user's referral code and reward points from profile
    const { data: profileData } = await supabase
      .from('profiles')
      .select('referral_code, reward_points')
      .eq('user_id', user.id)
      .single();

    if (profileData) {
      setReferralCode(profileData.referral_code);
      setRewardPoints(profileData.reward_points);
    }

    // Fetch referrals made by user
    const { data, error } = await supabase
      .from('referrals')
      .select('*')
      .eq('referrer_id', user.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setReferrals(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchReferrals();
  }, [user]);

  // Update reward points when profile changes
  useEffect(() => {
    if (profile) {
      setReferralCode((profile as any).referral_code || null);
      setRewardPoints((profile as any).reward_points || 0);
    }
  }, [profile]);

  const applyReferralCode = async (code: string) => {
    if (!user) {
      toast.error('Please login first');
      return false;
    }

    // Check if code exists and is not user's own code
    const { data: referrerProfile, error: fetchError } = await supabase
      .from('profiles')
      .select('user_id, referral_code')
      .eq('referral_code', code.toUpperCase())
      .maybeSingle();

    if (fetchError || !referrerProfile) {
      toast.error('Invalid referral code');
      return false;
    }

    if (referrerProfile.user_id === user.id) {
      toast.error('You cannot use your own referral code');
      return false;
    }

    // Check if user already used a referral code
    const { data: existingRef } = await supabase
      .from('profiles')
      .select('referred_by')
      .eq('user_id', user.id)
      .single();

    if (existingRef?.referred_by) {
      toast.error('You have already used a referral code');
      return false;
    }

    // Update user's profile with referred_by
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ referred_by: referrerProfile.user_id })
      .eq('user_id', user.id);

    if (updateError) {
      toast.error('Failed to apply referral code');
      return false;
    }

    // Add points to referrer - get current points first
    const { data: referrerData } = await supabase
      .from('profiles')
      .select('reward_points')
      .eq('user_id', referrerProfile.user_id)
      .single();
    
    const currentPoints = referrerData?.reward_points || 0;
    
    await supabase
      .from('profiles')
      .update({ reward_points: currentPoints + REFERRAL_POINTS })
      .eq('user_id', referrerProfile.user_id);

    // Create referral record
    await supabase.from('referrals').insert({
      referrer_id: referrerProfile.user_id,
      referred_user_id: user.id,
      referral_code: code.toUpperCase(),
      points_earned: REFERRAL_POINTS,
      status: 'completed',
      completed_at: new Date().toISOString(),
    });

    // Give bonus points to the new user too
    await supabase
      .from('profiles')
      .update({ reward_points: 50 }) // 50 points for using a referral code
      .eq('user_id', user.id);

    toast.success('Referral code applied! You earned 50 points');
    return true;
  };

  const copyReferralLink = () => {
    if (referralCode) {
      const link = `${window.location.origin}/login?ref=${referralCode}`;
      navigator.clipboard.writeText(link);
      toast.success('Referral link copied to clipboard!');
    }
  };

  const getTotalReferralPoints = () => {
    return referrals
      .filter(r => r.status === 'completed')
      .reduce((sum, r) => sum + r.points_earned, 0);
  };

  return {
    referrals,
    loading,
    referralCode,
    rewardPoints,
    applyReferralCode,
    copyReferralLink,
    getTotalReferralPoints,
    refetch: fetchReferrals,
  };
};
