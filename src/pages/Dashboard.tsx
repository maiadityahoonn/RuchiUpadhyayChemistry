import { motion } from 'framer-motion';
import { 
  BookOpen, Clock, Play, CheckCircle, Award, 
  Calendar, Bell, Settings, LogOut, ChevronRight,
  Target, TrendingUp
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import GamificationStats from '@/components/gamification/GamificationStats';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { mockUser, mockCourses } from '@/data/mockData';

const Dashboard = () => {
  const enrolledCourses = mockCourses.filter(c => mockUser.coursesEnrolled.includes(c.id));

  const upcomingLessons = [
    { title: 'Introduction to React Hooks', course: 'Complete Web Development', time: '2:00 PM', duration: '30 min' },
    { title: 'State Management Basics', course: 'Complete Web Development', time: '3:30 PM', duration: '45 min' },
    { title: 'Building REST APIs', course: 'Complete Web Development', time: 'Tomorrow', duration: '1 hr' },
  ];

  const recentActivity = [
    { action: 'Completed lesson', item: 'CSS Flexbox Fundamentals', xp: 25, time: '2 hours ago' },
    { action: 'Earned badge', item: 'Quick Learner', xp: 50, time: '5 hours ago' },
    { action: 'Passed quiz', item: 'JavaScript Basics Quiz', xp: 100, time: '1 day ago' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center text-2xl font-bold text-primary-foreground">
                {mockUser.name.charAt(0)}
              </div>
              <div>
                <h1 className="text-2xl font-heading font-bold text-foreground">
                  Welcome back, {mockUser.name.split(' ')[0]}!
                </h1>
                <p className="text-muted-foreground">
                  Continue your learning journey
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" size="icon">
                <Bell className="w-5 h-5" />
              </Button>
              <Button variant="outline" size="icon">
                <Settings className="w-5 h-5" />
              </Button>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Gamification Stats */}
              <GamificationStats user={mockUser} />

              {/* My Courses */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-card rounded-2xl p-6 border border-border"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-heading font-semibold text-card-foreground">
                    My Courses
                  </h2>
                  <Button variant="ghost" size="sm">
                    View All
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>

                <div className="space-y-4">
                  {enrolledCourses.map((course, index) => (
                    <motion.div
                      key={course.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
                    >
                      <div className="w-16 h-16 rounded-xl gradient-primary flex items-center justify-center shrink-0">
                        <BookOpen className="w-8 h-8 text-primary-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-card-foreground truncate">
                          {course.title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          <span>{course.lessons} lessons</span>
                          <span>•</span>
                          <span>{course.duration}</span>
                        </div>
                        <div className="mt-2">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-semibold text-primary">65%</span>
                          </div>
                          <Progress value={65} className="h-2" />
                        </div>
                      </div>
                      <Button variant="gradient" size="sm">
                        <Play className="w-4 h-4 mr-1" />
                        Continue
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Daily Goal */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-card rounded-2xl p-6 border border-border"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-xl gradient-accent">
                    <Target className="w-5 h-5 text-accent-foreground" />
                  </div>
                  <h3 className="font-heading font-semibold text-card-foreground">Daily Goal</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Learn 30 minutes</span>
                    <span className="font-semibold text-foreground">20/30 min</span>
                  </div>
                  <Progress value={67} className="h-3" />
                  <p className="text-xs text-muted-foreground">
                    10 more minutes to complete your daily goal!
                  </p>
                </div>
              </motion.div>

              {/* Upcoming Lessons */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-card rounded-2xl p-6 border border-border"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-xl bg-primary/10">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-heading font-semibold text-card-foreground">Upcoming</h3>
                </div>
                <div className="space-y-3">
                  {upcomingLessons.map((lesson, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50"
                    >
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Play className="w-5 h-5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-sm text-card-foreground truncate">
                          {lesson.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {lesson.time} • {lesson.duration}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Recent Activity */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-card rounded-2xl p-6 border border-border"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-xl gradient-gamification">
                    <TrendingUp className="w-5 h-5 text-success-foreground" />
                  </div>
                  <h3 className="font-heading font-semibold text-card-foreground">Activity</h3>
                </div>
                <div className="space-y-3">
                  {recentActivity.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center shrink-0">
                        <CheckCircle className="w-4 h-4 text-success" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-card-foreground">
                          <span className="text-muted-foreground">{activity.action}: </span>
                          {activity.item}
                        </p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs text-muted-foreground">{activity.time}</span>
                          <span className="text-xs font-semibold text-success">+{activity.xp} XP</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;
