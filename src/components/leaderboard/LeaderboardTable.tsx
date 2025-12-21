import { motion } from 'framer-motion';
import { Trophy, Medal, TrendingUp, TrendingDown, Minus, Zap, Flame, Crown } from 'lucide-react';
import { LeaderboardEntry } from '@/types';

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
}

const LeaderboardTable = ({ entries }: LeaderboardTableProps) => {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-warning fill-warning" />;
      case 2:
        return <Medal className="w-6 h-6 text-muted-foreground" />;
      case 3:
        return <Medal className="w-6 h-6 text-accent" />;
      default:
        return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="w-4 h-4 text-success" />;
    if (change < 0) return <TrendingDown className="w-4 h-4 text-destructive" />;
    return <Minus className="w-4 h-4 text-muted-foreground" />;
  };

  return (
    <div className="space-y-3">
      {entries.map((entry, index) => (
        <motion.div
          key={entry.user.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-300 hover:shadow-md ${
            entry.rank <= 3 
              ? 'bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/20' 
              : 'bg-card border border-border'
          }`}
        >
          {/* Rank */}
          <div className="w-12 flex items-center justify-center">
            {getRankIcon(entry.rank)}
          </div>

          {/* Avatar */}
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold">
              {entry.user.name.charAt(0)}
            </div>
            {entry.rank === 1 && (
              <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-warning flex items-center justify-center">
                <Crown className="w-3 h-3 text-warning-foreground" />
              </div>
            )}
          </div>

          {/* User Info */}
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-card-foreground truncate">{entry.user.name}</h4>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Level {entry.user.level}</span>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Flame className="w-3 h-3 text-accent" />
                <span>{entry.user.streak} day streak</span>
              </div>
            </div>
          </div>

          {/* XP */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary/10">
              <Zap className="w-4 h-4 text-primary" />
              <span className="font-bold text-primary">{entry.xp.toLocaleString()}</span>
            </div>
          </div>

          {/* Change */}
          <div className="flex items-center gap-1 w-16 justify-end">
            {getChangeIcon(entry.change)}
            {entry.change !== 0 && (
              <span className={`text-sm font-medium ${
                entry.change > 0 ? 'text-success' : 'text-destructive'
              }`}>
                {Math.abs(entry.change)}
              </span>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default LeaderboardTable;
