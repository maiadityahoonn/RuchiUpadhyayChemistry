import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Star, Clock, Users, Zap, BookOpen, CheckCircle, Loader2, Play,
  ChevronLeft, Award, Target, FileText, Video, ArrowRight,
  GraduationCap, Calendar, Globe, Shield, Coins
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import CourseFAQ from '@/components/courses/CourseFAQ';
import CheckoutModal from '@/components/checkout/CheckoutModal';
import CourseCertificate from '@/components/certificate/CourseCertificate';
import { useCourses } from '@/hooks/useCourses';
import { useLessonProgress } from '@/hooks/useLessonProgress';
import { useCoursesList } from '@/hooks/useAdmin';
import { useAuth } from '@/contexts/AuthContext';
import { useReferrals } from '@/hooks/useReferrals';
import { mockCourses } from '@/data/mockData';
import { Checkbox } from '@/components/ui/checkbox';

const POINTS_PER_RUPEE = 10;

const CourseDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const { enrollInCourse, isEnrolled, getProgress, getCompletedAt, refetch } = useCourses();
  const { user, profile } = useAuth();
  const { rewardPoints } = useReferrals();
  const { data: dbCourses } = useCoursesList();

  // Try to find course in database first, then mock data
  const dbCourse = dbCourses?.find(c => c.id === id);
  const mockCourse = mockCourses.find(c => c.id === id);
  
  // Convert db course to match the expected format
  const course = dbCourse ? {
    id: dbCourse.id,
    title: dbCourse.title,
    description: dbCourse.description || '',
    instructor: dbCourse.instructor,
    price: dbCourse.price,
    originalPrice: dbCourse.original_price || undefined,
    image: dbCourse.image_url || '/placeholder.svg',
    category: dbCourse.category,
    duration: dbCourse.duration || '0 hours',
    lessons: dbCourse.lessons,
    level: dbCourse.level as 'Beginner' | 'Intermediate' | 'Advanced',
    rating: 4.8,
    students: 0,
    xpReward: dbCourse.xp_reward,
  } : mockCourse;

  if (!course) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-16 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Course Not Found</h1>
            <p className="text-muted-foreground mb-4">The course you're looking for doesn't exist.</p>
            <Button onClick={() => navigate('/courses')}>Browse Courses</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const enrolled = isEnrolled(course.id);
  const progress = getProgress(course.id);
  const discount = course.originalPrice 
    ? Math.round((1 - course.price / course.originalPrice) * 100) 
    : 0;

  // Calculate potential points discount
  const maxPointsDiscount = Math.floor(Math.min(rewardPoints, course.price * POINTS_PER_RUPEE * 0.5) / POINTS_PER_RUPEE);

  const handleEnrollClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setShowCheckout(true);
  };

  const handleEnrollSuccess = async () => {
    setIsEnrolling(true);
    await enrollInCourse(course.id);
    refetch();
    setIsEnrolling(false);
  };

  // Generate sample curriculum based on lessons count
  const curriculum = [
    {
      title: 'Introduction',
      lessons: [
        { title: 'Welcome to the Course', duration: '5 min', type: 'video' },
        { title: 'Course Overview', duration: '10 min', type: 'video' },
        { title: 'Setting Up Your Environment', duration: '15 min', type: 'video' },
      ],
    },
    {
      title: 'Core Concepts',
      lessons: [
        { title: 'Understanding the Basics', duration: '20 min', type: 'video' },
        { title: 'Key Principles & Theory', duration: '25 min', type: 'video' },
        { title: 'Practice Problems Set 1', duration: '30 min', type: 'quiz' },
      ],
    },
    {
      title: 'Advanced Topics',
      lessons: [
        { title: 'Deep Dive into Concepts', duration: '30 min', type: 'video' },
        { title: 'Real-World Applications', duration: '25 min', type: 'video' },
        { title: 'Case Studies', duration: '20 min', type: 'reading' },
      ],
    },
    {
      title: 'Final Assessment',
      lessons: [
        { title: 'Comprehensive Review', duration: '20 min', type: 'video' },
        { title: 'Final Exam', duration: '60 min', type: 'quiz' },
        { title: 'Certificate of Completion', duration: '5 min', type: 'certificate' },
      ],
    },
  ];

  // Calculate total lessons from curriculum
  const totalLessons = curriculum.reduce((acc, section) => acc + section.lessons.length, 0);
  
  // Use lesson progress hook
  const { 
    isLessonCompleted, 
    toggleLessonComplete, 
    completedCount,
    progressPercent: lessonProgressPercent 
  } = useLessonProgress(course.id, totalLessons);

  const features = [
    { icon: Video, label: `${course.lessons} Video Lessons` },
    { icon: FileText, label: 'Downloadable Resources' },
    { icon: Target, label: 'Practice Quizzes' },
    { icon: Award, label: 'Certificate of Completion' },
    { icon: Globe, label: 'Lifetime Access' },
    { icon: Shield, label: '30-Day Money Back Guarantee' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20 pb-16">
        {/* Hero Section */}
        <section className="py-12 bg-gradient-to-br from-primary/10 via-background to-accent/10">
          <div className="container mx-auto px-4">
            <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Course Info */}
              <div className="lg:col-span-2 space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="secondary">{course.category}</Badge>
                    <Badge variant="outline">{course.level}</Badge>
                    {enrolled && (
                      <Badge className="bg-success text-success-foreground">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Enrolled
                      </Badge>
                    )}
                  </div>
                  
                  <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
                    {course.title}
                  </h1>
                  
                  <p className="text-lg text-muted-foreground mb-6">
                    {course.description}
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <GraduationCap className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-muted-foreground">Instructor</p>
                        <p className="font-semibold text-foreground">{course.instructor}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-warning fill-warning" />
                      <span className="font-semibold">{course.rating}</span>
                      <span className="text-muted-foreground">({course.students.toLocaleString()} students)</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-5 h-5" />
                      {course.duration}
                    </div>
                    
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <BookOpen className="w-5 h-5" />
                      {course.lessons} lessons
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Enrollment Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="sticky top-24 border-border shadow-xl">
                  <CardHeader className="p-0">
                    <div className="relative h-48 bg-gradient-to-br from-primary/20 to-accent/20 rounded-t-lg flex items-center justify-center">
                      <BookOpen className="w-20 h-20 text-primary/30" />
                      {discount > 0 && (
                        <Badge className="absolute top-4 right-4 bg-accent text-accent-foreground text-lg px-3 py-1">
                          {discount}% OFF
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    {enrolled ? (
                      <>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Your Progress</span>
                            <span className="font-semibold text-primary">{lessonProgressPercent}%</span>
                          </div>
                          <Progress value={lessonProgressPercent} className="h-3" />
                          <p className="text-xs text-muted-foreground text-center">
                            {completedCount} of {totalLessons} lessons completed
                          </p>
                        </div>
                        
                        <Button variant="gradient" size="lg" className="w-full">
                          <Play className="w-5 h-5 mr-2" />
                          {lessonProgressPercent > 0 ? 'Continue Learning' : 'Start Course'}
                        </Button>
                        
                        {lessonProgressPercent === 100 ? (
                          <div className="space-y-3">
                            <p className="text-sm text-center text-success font-medium">
                              🎉 Congratulations! Course completed!
                            </p>
                            <CourseCertificate
                              courseName={course.title}
                              studentName={profile?.username || user?.email?.split('@')[0] || 'Student'}
                              instructor={course.instructor}
                              completionDate={getCompletedAt(course.id) || new Date()}
                              courseId={course.id}
                            />
                          </div>
                        ) : (
                          <p className="text-sm text-center text-muted-foreground">
                            {totalLessons - completedCount} lessons remaining
                          </p>
                        )}
                      </>
                    ) : (
                      <>
                        <div className="text-center">
                          <div className="flex items-baseline justify-center gap-2 mb-2">
                            <span className="text-4xl font-bold text-foreground">₹{course.price}</span>
                            {course.originalPrice && (
                              <span className="text-lg text-muted-foreground line-through">
                                ₹{course.originalPrice}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center justify-center gap-2 text-success">
                            <Zap className="w-4 h-4" />
                            <span className="font-semibold">Earn +{course.xpReward} XP on completion</span>
                          </div>
                        </div>

                        {/* Points Discount Preview */}
                        {user && rewardPoints > 0 && maxPointsDiscount > 0 && (
                          <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-3 border border-primary/20">
                            <div className="flex items-center gap-2 text-sm">
                              <Coins className="w-4 h-4 text-primary" />
                              <span className="text-foreground">
                                Use points for up to <span className="font-semibold text-primary">₹{maxPointsDiscount}</span> off!
                              </span>
                            </div>
                          </div>
                        )}
                        
                        <Button 
                          variant="gradient" 
                          size="lg" 
                          className="w-full"
                          onClick={handleEnrollClick}
                          disabled={isEnrolling}
                        >
                          {isEnrolling ? (
                            <>
                              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                              Enrolling...
                            </>
                          ) : (
                            <>
                              Enroll Now
                              <ArrowRight className="w-5 h-5 ml-2" />
                            </>
                          )}
                        </Button>
                        
                        <p className="text-sm text-center text-muted-foreground">
                          30-day money-back guarantee
                        </p>
                      </>
                    )}
                    
                    <div className="border-t border-border pt-6 space-y-3">
                      <p className="font-semibold text-foreground">This course includes:</p>
                      {features.slice(0, 4).map((feature, i) => (
                        <div key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
                          <feature.icon className="w-4 h-4 text-primary" />
                          {feature.label}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Course Content */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="lg:max-w-3xl">
              <Tabs defaultValue="curriculum" className="w-full">
                <TabsList className="w-full justify-start mb-8 bg-secondary/50 p-1 rounded-xl">
                  <TabsTrigger value="curriculum" className="rounded-lg">Curriculum</TabsTrigger>
                  <TabsTrigger value="overview" className="rounded-lg">Overview</TabsTrigger>
                  <TabsTrigger value="instructor" className="rounded-lg">Instructor</TabsTrigger>
                </TabsList>
                
                <TabsContent value="curriculum" className="space-y-4">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-heading font-bold text-foreground">Course Content</h2>
                    <p className="text-sm text-muted-foreground">
                      {curriculum.length} sections • {course.lessons} lessons • {course.duration}
                    </p>
                  </div>
                  
                  <Accordion type="single" collapsible className="space-y-4">
                    {curriculum.map((section, sIndex) => (
                      <AccordionItem 
                        key={sIndex} 
                        value={`section-${sIndex}`}
                        className="bg-card border border-border rounded-xl px-6 overflow-hidden"
                      >
                        <AccordionTrigger className="hover:no-underline py-4">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-semibold">
                              {sIndex + 1}
                            </div>
                            <div className="text-left">
                              <h3 className="font-semibold text-foreground">{section.title}</h3>
                              <p className="text-sm text-muted-foreground">{section.lessons.length} lessons</p>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pb-4">
                          <div className="space-y-2 ml-14">
                            {section.lessons.map((lesson, lIndex) => {
                              const lessonCompleted = isLessonCompleted(sIndex, lIndex);
                              return (
                                <div 
                                  key={lIndex}
                                  className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                                    lessonCompleted 
                                      ? 'bg-success/10 border border-success/20' 
                                      : 'hover:bg-secondary/50'
                                  }`}
                                >
                                  <div className="flex items-center gap-3">
                                    {enrolled && (
                                      <Checkbox
                                        checked={lessonCompleted}
                                        onCheckedChange={() => toggleLessonComplete(sIndex, lIndex)}
                                        className="data-[state=checked]:bg-success data-[state=checked]:border-success"
                                      />
                                    )}
                                    {lesson.type === 'video' && <Video className={`w-4 h-4 ${lessonCompleted ? 'text-success' : 'text-primary'}`} />}
                                    {lesson.type === 'quiz' && <Target className={`w-4 h-4 ${lessonCompleted ? 'text-success' : 'text-accent'}`} />}
                                    {lesson.type === 'reading' && <FileText className={`w-4 h-4 ${lessonCompleted ? 'text-success' : 'text-success'}`} />}
                                    {lesson.type === 'certificate' && <Award className={`w-4 h-4 ${lessonCompleted ? 'text-success' : 'text-warning'}`} />}
                                    <span className={`text-sm ${lessonCompleted ? 'text-success line-through' : 'text-foreground'}`}>
                                      {lesson.title}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {lessonCompleted && (
                                      <CheckCircle className="w-4 h-4 text-success" />
                                    )}
                                    <span className="text-xs text-muted-foreground">{lesson.duration}</span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </TabsContent>
                
                <TabsContent value="overview" className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-heading font-bold text-foreground mb-4">What you'll learn</h2>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {[
                        'Master fundamental concepts and theories',
                        'Apply knowledge to real-world problems',
                        'Develop problem-solving skills',
                        'Prepare for competitive exams',
                        'Build a strong foundation',
                        'Gain practical experience',
                      ].map((item, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-success shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h2 className="text-2xl font-heading font-bold text-foreground mb-4">Requirements</h2>
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                        Basic understanding of the subject
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                        Willingness to learn and practice
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                        Access to a computer or mobile device
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h2 className="text-2xl font-heading font-bold text-foreground mb-4">Course Features</h2>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {features.map((feature, i) => (
                        <div key={i} className="flex items-center gap-3 p-4 bg-card rounded-xl border border-border">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <feature.icon className="w-5 h-5 text-primary" />
                          </div>
                          <span className="font-medium text-foreground">{feature.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="instructor" className="space-y-6">
                  <div className="flex items-start gap-6">
                    <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-4xl font-bold text-primary-foreground">
                      {course.instructor.charAt(0)}
                    </div>
                    <div>
                      <h2 className="text-2xl font-heading font-bold text-foreground mb-2">{course.instructor}</h2>
                      <p className="text-muted-foreground mb-4">Expert Chemistry Educator</p>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-warning fill-warning" />
                          <span className="font-semibold">4.9 Instructor Rating</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          <span>50,000+ Students</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <BookOpen className="w-4 h-4 text-muted-foreground" />
                          <span>15 Courses</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground">
                    With over 10 years of teaching experience, {course.instructor} has helped thousands of students 
                    master chemistry concepts and achieve their academic goals. Known for making complex topics 
                    simple and engaging, their teaching methodology focuses on conceptual understanding and 
                    practical application.
                  </p>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>

        {/* Course FAQ */}
        <CourseFAQ courseTitle={course.title} />
      </main>

      <Footer />

      {/* Checkout Modal */}
      <CheckoutModal
        open={showCheckout}
        onOpenChange={setShowCheckout}
        course={{
          id: course.id,
          title: course.title,
          price: course.price,
          originalPrice: course.originalPrice,
          xpReward: course.xpReward,
          instructor: course.instructor,
        }}
        onEnrollSuccess={handleEnrollSuccess}
      />
    </div>
  );
};

export default CourseDetails;
