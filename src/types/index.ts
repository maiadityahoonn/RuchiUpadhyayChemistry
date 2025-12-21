export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  duration: string;
  lessons: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  rating: number;
  students: number;
  xpReward: number;
  badge?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  xp: number;
  level: number;
  streak: number;
  badges: Badge[];
  coursesEnrolled: string[];
  coursesCompleted: string[];
  rank: number;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  earnedAt?: Date;
  color: string;
}

export interface MCQQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  points: number;
}

export interface TestResult {
  id: string;
  userId: string;
  testId: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  xpEarned: number;
  completedAt: Date;
}

export interface LeaderboardEntry {
  rank: number;
  user: User;
  xp: number;
  change: number;
}
