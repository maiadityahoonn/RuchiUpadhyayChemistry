import { motion } from 'framer-motion';
import { Trophy, Medal, Crown, TrendingUp, Zap, Flame, Calendar, Loader2, Users } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import LeaderboardTable from '@/components/leaderboard/LeaderboardTable';
import { Button } from '@/components/ui/button';
import { useLeaderboard } from '@/hooks/useLeaderboard';
import { useAuth } from '@/contexts/AuthContext';

const Leaderboard = () => {
  const { leaderboard, userRank, loading } = useLeaderboard();
  const { profile } = useAuth();
  const topThree = leaderboard.slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="pt-24 pb-12 gradient-hero">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6"
          >
            <div className="w-20 h-20 mx-auto rounded-2xl bg-warning/20 flex items-center justify-center">
              <Trophy className="w-10 h-10 text-warning" />
            </div>
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-background">
              Leaderboard
            </h1>
            <p className="text-lg text-background/80 max-w-2xl mx-auto">
              Compete with fellow learners and climb to the top!
            </p>

            {/* Your Rank */}
            {profile && userRank && (
              <div className="inline-flex items-center gap-4 px-6 py-3 rounded-full bg-background/10 backdrop-blur-sm border border-background/20">
                <span className="text-background/80">Your Rank:</span>
                <span className="text-2xl font-bold text-background">#{userRank}</span>
                <div className="w-px h-6 bg-background/20" />
                <div className="flex items-center gap-1 text-primary">
                  <Zap className="w-5 h-5" />
                  <span className="font-semibold text-background">{profile.xp.toLocaleString()} XP</span>
                </div>
              </div>
            )}

            {/* Live indicator */}
            <div className="flex items-center justify-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-success"></span>
              </span>
              <span className="text-sm text-background/70">Live updates</span>
            </div>
          </motion.div>
        </div>
      </section>

      {loading ? (
        <section className="py-24">
          <div className="container mx-auto px-4 flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading leaderboard...</p>
          </div>
        </section>
      ) : leaderboard.length === 0 ? (
        <section className="py-24">
          <div className="container mx-auto px-4 flex flex-col items-center justify-center gap-4">
            <Users className="w-16 h-16 text-muted-foreground" />
            <h3 className="text-xl font-semibold text-foreground">No learners yet</h3>
            <p className="text-muted-foreground">Be the first to join and start earning XP!</p>
          </div>
        </section>
      ) : (
        <>
          {/* Top 3 Podium */}
          <section className="py-12 -mt-8">
            <div className="container mx-auto px-4">
              <div className="flex items-end justify-center gap-4 md:gap-8">
                {/* 2nd Place */}
                {topThree[1] && (
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-col items-center"
                  >
                    <div className="relative mb-4">
                      <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-muted-foreground to-muted-foreground/50 flex items-center justify-center text-2xl md:text-3xl font-bold text-background">
                        {topThree[1].username?.charAt(0) || '?'}
                      </div>
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-muted-foreground flex items-center justify-center shadow-lg">
                        <Medal className="w-5 h-5 text-background" />
                      </div>
                    </div>
                    <div className="bg-card rounded-t-2xl p-4 md:p-6 text-center min-w-[120px] md:min-w-[160px] h-32 border border-border">
                      <p className="font-semibold text-card-foreground truncate">{topThree[1].username || 'Anonymous'}</p>
                      <p className="text-sm text-muted-foreground">Level {topThree[1].level}</p>
                      <div className="flex items-center justify-center gap-1 mt-2 text-primary">
                        <Zap className="w-4 h-4" />
                        <span className="font-bold">{topThree[1].xp.toLocaleString()}</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* 1st Place */}
                {topThree[0] && (
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex flex-col items-center"
                  >
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="relative mb-4"
                    >
                      <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-warning to-accent flex items-center justify-center text-3xl md:text-4xl font-bold text-background shadow-lg shadow-warning/30">
                        {topThree[0].username?.charAt(0) || '?'}
                      </div>
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                        <Crown className="w-8 h-8 text-warning fill-warning" />
                      </div>
                    </motion.div>
                    <div className="bg-gradient-to-b from-warning/10 to-card rounded-t-2xl p-4 md:p-6 text-center min-w-[140px] md:min-w-[180px] h-40 border border-warning/30">
                      <p className="font-bold text-lg text-card-foreground truncate">{topThree[0].username || 'Anonymous'}</p>
                      <p className="text-sm text-muted-foreground">Level {topThree[0].level}</p>
                      <div className="flex items-center justify-center gap-1 mt-2 text-warning">
                        <Zap className="w-5 h-5" />
                        <span className="font-bold text-lg">{topThree[0].xp.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-center gap-1 mt-1 text-accent">
                        <Flame className="w-4 h-4" />
                        <span className="text-sm">{topThree[0].streak} day streak</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* 3rd Place */}
                {topThree[2] && (
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-col items-center"
                  >
                    <div className="relative mb-4">
                      <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-accent to-accent/50 flex items-center justify-center text-2xl md:text-3xl font-bold text-background">
                        {topThree[2].username?.charAt(0) || '?'}
                      </div>
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-accent flex items-center justify-center shadow-lg">
                        <Medal className="w-5 h-5 text-background" />
                      </div>
                    </div>
                    <div className="bg-card rounded-t-2xl p-4 md:p-6 text-center min-w-[120px] md:min-w-[160px] h-28 border border-border">
                      <p className="font-semibold text-card-foreground truncate">{topThree[2].username || 'Anonymous'}</p>
                      <p className="text-sm text-muted-foreground">Level {topThree[2].level}</p>
                      <div className="flex items-center justify-center gap-1 mt-2 text-primary">
                        <Zap className="w-4 h-4" />
                        <span className="font-bold">{topThree[2].xp.toLocaleString()}</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </section>

          {/* Filter Tabs */}
          <section className="py-4 border-b border-border">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <Button variant="default" size="sm">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    All Time
                  </Button>
                  <Button variant="secondary" size="sm">
                    <Calendar className="w-4 h-4 mr-2" />
                    This Week
                  </Button>
                  <Button variant="secondary" size="sm">
                    <Calendar className="w-4 h-4 mr-2" />
                    This Month
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Full Leaderboard */}
          <section className="py-12">
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <LeaderboardTable entries={leaderboard} />
              </motion.div>
            </div>
          </section>
        </>
      )}

      <Footer />
    </div>
  );
};

export default Leaderboard;
