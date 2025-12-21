import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, Clock, Play, CheckCircle, Award, 
  Calendar, LogOut, ChevronRight,
  Target, TrendingUp, Loader2, BookMarked, LayoutDashboard
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import GamificationStats from '@/components/gamification/GamificationStats';
import NotificationDropdown from '@/components/dashboard/NotificationDropdown';
import SettingsModal from '@/components/dashboard/SettingsModal';
import ReferralCard from '@/components/dashboard/ReferralCard';
import PointsDiscountCard from '@/components/dashboard/PointsDiscountCard';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { mockCourses } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { useCourses } from '@/hooks/useCourses';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface TestResult {
  id: string;
  test_id: string;
  score: number;
  total_questions: number;
  xp_earned: number;
  completed_at: string;
}

const Dashboard = () => {
  const { user, profile, loading: authLoading } = useAuth();
  const { enrolledCourses, loading: coursesLoading } = useCourses();
  const navigate = useNavigate();
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [resultsLoading, setResultsLoading] = useState(true);

  // Fetch test results
  useEffect(() => {
    const fetchTestResults = async () => {
      if (!user) {
        setResultsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('test_results')
        .select('*')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false })
        .limit(5);

      if (!error && data) {
        setTestResults(data);
      }
      setResultsLoading(false);
    };

    fetchTestResults();
  }, [user]);

  // Realtime subscription for test results
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('test-results-channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'test_results',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const newResult = payload.new as TestResult;
          setTestResults(prev => [newResult, ...prev.slice(0, 4)]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [authLoading, user, navigate]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  // Get enrolled course details from mock data
  const enrolledCourseDetails = enrolledCourses.map(enrollment => {
    const courseData = mockCourses.find(c => c.id === enrollment.course_id);
    return {
      ...enrollment,
      courseData,
    };
  }).filter(c => c.courseData);

  const upcomingLessons = [
    { title: 'Introduction to React Hooks', course: 'Complete Web Development', time: '2:00 PM', duration: '30 min' },
    { title: 'State Management Basics', course: 'Complete Web Development', time: '3:30 PM', duration: '45 min' },
    { title: 'Building REST APIs', course: 'Complete Web Development', time: 'Tomorrow', duration: '1 hr' },
  ];

  // Build activity from test results
  const recentActivity = testResults.map(result => ({
    action: 'Passed quiz',
    item: result.test_id.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    xp: result.xp_earned,
    time: new Date(result.completed_at).toLocaleDateString(),
  }));

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-20 pb-16">
        {/* Hero Section */}
        <section className="py-12 bg-gradient-to-br from-primary/10 via-background to-accent/10">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center text-3xl font-bold text-primary-foreground shadow-lg">
                  {profile?.username?.charAt(0) || user.email?.charAt(0) || '?'}
                </div>
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-2">
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Dashboard</span>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground">
                    Welcome back, <span className="text-primary">{profile?.username || user.email?.split('@')[0]}</span>!
                  </h1>
                  <p className="text-lg text-muted-foreground mt-1">
                    Continue your learning journey
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <NotificationDropdown />
                <SettingsModal />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Dashboard Content */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Gamification Stats */}
                {profile && (
                  <GamificationStats user={{
                    id: user.id,
                    name: profile.username || 'User',
                    email: user.email || '',
                    avatar: profile.avatar_url || '',
                    xp: profile.xp,
                    level: profile.level,
                    streak: profile.streak,
                    badges: [],
                    coursesEnrolled: enrolledCourses.map(c => c.course_id),
                    coursesCompleted: enrolledCourses.filter(c => c.progress >= 100).map(c => c.course_id),
                    rank: 0,
                  }} />
                )}

                {/* My Courses */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-card rounded-2xl p-6 border border-border shadow-lg"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-heading font-semibold text-card-foreground">
                      My Courses
                    </h2>
                    <Button variant="ghost" size="sm" onClick={() => navigate('/courses')}>
                      View All
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>

                  {coursesLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                  ) : enrolledCourseDetails.length === 0 ? (
                    <div className="text-center py-12">
                      <BookMarked className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="font-semibold text-foreground mb-2">No courses yet</h3>
                      <p className="text-muted-foreground mb-4">Start learning by enrolling in a course</p>
                      <Button onClick={() => navigate('/courses')}>
                        Browse Courses
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {enrolledCourseDetails.map((enrollment, index) => (
                        <motion.div
                          key={enrollment.id}
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
                              {enrollment.courseData?.title}
                            </h3>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                              <span>{enrollment.courseData?.lessons} lessons</span>
                              <span>•</span>
                              <span>{enrollment.courseData?.duration}</span>
                            </div>
                            <div className="mt-2">
                              <div className="flex items-center justify-between text-xs mb-1">
                                <span className="text-muted-foreground">Progress</span>
                                <span className="font-semibold text-primary">{enrollment.progress}%</span>
                              </div>
                              <Progress value={enrollment.progress} className="h-2" />
                            </div>
                          </div>
                          <Button size="sm">
                            <Play className="w-4 h-4 mr-1" />
                            {enrollment.progress > 0 ? 'Continue' : 'Start'}
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Referral Card */}
                <ReferralCard />

                {/* Points & Discount Card */}
                <PointsDiscountCard />

                {/* Daily Goal */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-card rounded-2xl p-6 border border-border shadow-lg"
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
                  className="bg-card rounded-2xl p-6 border border-border shadow-lg"
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
                  className="bg-card rounded-2xl p-6 border border-border shadow-lg"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-xl gradient-gamification">
                      <TrendingUp className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <h3 className="font-heading font-semibold text-card-foreground">Activity</h3>
                  </div>
                  {resultsLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    </div>
                  ) : recentActivity.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No recent activity. Take a quiz to get started!
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {recentActivity.map((activity, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors"
                        >
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <CheckCircle className="w-4 h-4 text-primary" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm text-card-foreground">
                              <span className="text-muted-foreground">{activity.action}: </span>
                              {activity.item}
                            </p>
                            <div className="flex items-center justify-between mt-1">
                              <span className="text-xs text-muted-foreground">{activity.time}</span>
                              <span className="text-xs font-semibold text-primary">+{activity.xp} XP</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
