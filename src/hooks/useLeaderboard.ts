import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface LeaderboardUser {
  id: string;
  user_id: string;
  username: string | null;
  xp: number;
  level: number;
  streak: number;
  rank: number;
}

export const useLeaderboard = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [userRank, setUserRank] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchLeaderboard = async () => {
    // Only select non-sensitive fields for leaderboard
    const { data, error } = await supabase
      .from('profiles')
      .select('id, user_id, username, xp, level, streak')
      .order('xp', { ascending: false })
      .limit(100);

    if (error) {
      console.error('Error fetching leaderboard:', error);
      return;
    }

    const rankedData = (data || []).map((profile, index) => ({
      ...profile,
      rank: index + 1,
    }));

    setLeaderboard(rankedData);

    // Find current user's rank
    if (user) {
      const userEntry = rankedData.find((p) => p.user_id === user.id);
      setUserRank(userEntry?.rank ?? null);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchLeaderboard();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('leaderboard-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
        },
        () => {
          // Refetch leaderboard on any profile change
          fetchLeaderboard();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return { leaderboard, userRank, loading, refetch: fetchLeaderboard };
};
