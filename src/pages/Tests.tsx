import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Award, Clock, ArrowRight, Target, Lock, ShoppingCart,
  BookOpen, ChevronRight, ChevronLeft, CheckCircle, XCircle,
  Trophy, Zap, RotateCcw, Home, Loader2
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useTests, Test, useIsAdmin, useCoursesList, useUserPurchases, useBuyTest } from '@/hooks/useAdmin';
import { useCourses } from '@/hooks/useCourses';
import { useAuth } from '@/contexts/AuthContext';
import { courseCategories } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const Tests = () => {
  const navigate = useNavigate();
  const { category: urlCategory } = useParams<{ category: string }>();
  const { user, addXP } = useAuth();
  const { toast } = useToast();
  const { data: isAdmin } = useIsAdmin();
  const { enrolledCourses } = useCourses();
  const { data: allCourses } = useCoursesList();
  const { data: purchases } = useUserPurchases();
  const { mutate: buyTest } = useBuyTest();

  // Mapping for category logic
  const categoryInfo = urlCategory ? courseCategories.find(c => c.slug === urlCategory) : null;
  const categoryName = categoryInfo?.name || '';

  // Fetch Tests
  const { data: allTests, isLoading } = useTests(categoryName || undefined);

  // Test Player State
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showAnswer, setShowAnswer] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const checkAccess = (test?: Test) => {
    if (isAdmin) return true;
    if (test && test.price === 0) return true;
    if (test && purchases?.some(p => p.test_id === test.id)) return true;

    const isCategoryPurchased = enrolledCourses?.some(ec => {
      const courseDetails = allCourses?.find(c => c.id === ec.course_id);
      return courseDetails?.category === (test?.category || categoryName);
    });

    return !!isCategoryPurchased;
  };

  const handleBuyTest = (test: Test) => {
    if (!user) {
      toast({
        title: 'Please sign in',
        description: 'You need to be logged in to purchase tests',
        variant: 'destructive',
      });
      navigate('/login');
      return;
    }
    buyTest(test.id);
  };

  const handleStartTest = (test: Test) => {
    if (!user) {
      toast({
        title: 'Please sign in',
        description: 'You need to be logged in to take tests',
        variant: 'destructive',
      });
      navigate('/login');
      return;
    }

    if (!checkAccess(test)) {
      handleBuyTest(test);
      return;
    }

    setSelectedTest(test);
    setCurrentQuestion(0);
    setAnswers([]);
    setShowAnswer(false);
    setTestCompleted(false);
  };

  const handleAnswer = (answerIndex: number) => {
    if (showAnswer) return;
    setAnswers([...answers, answerIndex]);
    setShowAnswer(true);
  };

  const calculateScore = () => {
    if (!selectedTest) return { correct: 0, total: 0, percentage: 0, xp: 0 };
    let correct = 0;
    let totalXp = 0;
    selectedTest.questions.forEach((q, i) => {
      if (answers[i] === q.correctAnswer) {
        correct++;
        totalXp += q.points;
      }
    });
    return {
      correct,
      total: selectedTest.questions.length,
      percentage: Math.round((correct / selectedTest.questions.length) * 100),
      xp: totalXp,
    };
  };

  const saveTestResult = async () => {
    if (!user || !selectedTest) return;
    setIsSaving(true);
    const score = calculateScore();

    try {
      // Check if user already took this test to prevent double XP
      const { data: existingResults } = await supabase
        .from('test_results')
        .select('id')
        .eq('user_id', user.id)
        .eq('test_id', selectedTest.id)
        .limit(1);

      const hasAttemptedBefore = existingResults && existingResults.length > 0;

      const { error: insertError } = await supabase.from('test_results').insert({
        user_id: user.id,
        test_id: selectedTest.id,
        score: score.percentage,
        total_questions: score.total,
        xp_earned: score.xp,
      });

      if (!insertError && !hasAttemptedBefore) {
        await addXP(score.xp);
        toast({
          title: 'Test Completed! 🏆',
          description: `You earned ${score.xp} XP for your first attempt!`,
        });
      } else if (!insertError) {
        toast({
          title: 'Test Attempt Saved',
          description: `Score: ${score.percentage}%. (No extra XP for retakes)`,
        });
      }
    } catch (error) {
      console.error('Error saving test result:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleNext = async () => {
    if (!selectedTest) return;
    if (currentQuestion < selectedTest.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setShowAnswer(false);
    } else {
      setTestCompleted(true);
      await saveTestResult();
    }
  };

  const resetTest = () => {
    setSelectedTest(null);
    setCurrentQuestion(0);
    setAnswers([]);
    setShowAnswer(false);
    setTestCompleted(false);
  };

  // Sub-renderings
  const renderTestPlayer = () => {
    if (!selectedTest) return null;
    const question = selectedTest.questions[currentQuestion];
    const progress = ((currentQuestion + 1) / selectedTest.questions.length) * 100;

    return (
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="mb-6">
          <Button variant="ghost" onClick={resetTest}>
            <ChevronLeft className="w-4 h-4 mr-2" />
            Exit Test
          </Button>
        </div>
        <Card className="border-border shadow-xl">
          <CardHeader>
            <div className="flex items-center justify-between mb-4">
              <Badge variant="secondary" className="px-3 py-1">{selectedTest.title}</Badge>
              <span className="text-sm font-medium text-muted-foreground">
                Question {currentQuestion + 1} of {selectedTest.questions.length}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </CardHeader>
          <CardContent className="space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h3 className="text-xl font-bold font-heading mb-8">{question.question}</h3>
                <div className="space-y-3">
                  {question.options.map((option, index) => {
                    const isSelected = answers[currentQuestion] === index;
                    const isCorrect = index === question.correctAnswer;
                    let optionClass = 'border-border hover:border-primary/50';
                    if (showAnswer) {
                      if (isCorrect) optionClass = 'border-success bg-success/5 text-success';
                      else if (isSelected) optionClass = 'border-destructive bg-destructive/5 text-destructive';
                    } else if (isSelected) {
                      optionClass = 'border-primary bg-primary/5';
                    }

                    return (
                      <motion.button
                        key={index}
                        onClick={() => handleAnswer(index)}
                        disabled={showAnswer}
                        className={`w-full p-5 rounded-2xl border-2 text-left transition-all font-medium ${optionClass}`}
                        whileHover={{ scale: showAnswer ? 1 : 1.01 }}
                        whileTap={{ scale: showAnswer ? 1 : 0.99 }}
                      >
                        <div className="flex items-center gap-4">
                          <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${isSelected ? 'bg-primary text-white' : 'bg-secondary'}`}>
                            {String.fromCharCode(65 + index)}
                          </span>
                          <span className="flex-1">{option}</span>
                          {showAnswer && isCorrect && <CheckCircle className="w-5 h-5" />}
                          {showAnswer && isSelected && !isCorrect && <XCircle className="w-5 h-5" />}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            </AnimatePresence>
            {showAnswer && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <div className="p-4 rounded-xl bg-secondary/50 border border-primary/10">
                  <p className="text-sm leading-relaxed"><strong>Explanation:</strong> {question.explanation}</p>
                </div>
                <Button onClick={handleNext} className="w-full h-12 text-lg font-bold" variant="gradient">
                  {currentQuestion < selectedTest.questions.length - 1 ? 'Continue to Next Question' : 'Complete Challenge'}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderResults = () => {
    if (!selectedTest) return null;
    const score = calculateScore();
    return (
      <div className="container mx-auto px-4 max-w-2xl text-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
          <Card className="shadow-2xl border-primary/10 overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-primary via-accent to-primary" />
            <CardHeader className="pt-10">
              <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-xl rotate-3">
                <Trophy className="w-12 h-12 text-white -rotate-3" />
              </div>
              <CardTitle className="text-3xl font-bold font-heading">Victory Guaranteed!</CardTitle>
              <CardDescription className="text-lg">You've successfully conquered {selectedTest.title}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8 p-10 pt-0">
              <div className="grid grid-cols-3 gap-6">
                <div className="p-5 rounded-2xl bg-secondary/40 border border-border/50">
                  <p className="text-4xl font-bold text-primary">{score.percentage}%</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1">Accuracy</p>
                </div>
                <div className="p-5 rounded-2xl bg-secondary/40 border border-border/50">
                  <p className="text-4xl font-bold text-success">{score.correct}/{score.total}</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1">Correct</p>
                </div>
                <div className="p-5 rounded-2xl bg-secondary/40 border border-border/50">
                  <div className="flex items-center justify-center gap-1.5 text-warning">
                    <Zap className="w-6 h-6 fill-current" />
                    <p className="text-4xl font-bold">{score.xp}</p>
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1">XP Earned</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button onClick={() => handleStartTest(selectedTest)} variant="outline" className="flex-1 h-12 rounded-xl">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Retake Test
                </Button>
                <Button onClick={resetTest} variant="gradient" className="flex-1 h-12 rounded-xl shadow-lg">
                  <Home className="w-4 h-4 mr-2" />
                  More Challenges
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  };

  if (urlCategory && !categoryInfo) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Category Not Found</h1>
          <Button onClick={() => navigate('/tests')}>Go Back to Tests</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-20 pb-16">
        <AnimatePresence mode="wait">
          {!urlCategory ? (
            /* Categories Grid */
            <motion.div key="cat-grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <section className="py-12 bg-gradient-to-br from-primary/10 via-background to-accent/10">
                <div className="container mx-auto px-4 text-center max-w-3xl">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent mb-6 font-medium">
                    <Target className="w-5 h-5" /> Practice Arena
                  </div>
                  <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
                    Test Your <span className="text-primary">Knowledge</span>
                  </h1>
                  <p className="text-lg text-muted-foreground">Master every concept through our curated category-wise challenges.</p>
                </div>
              </section>
              <section className="py-12 px-4">
                <div className="container mx-auto">
                  {isLoading ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-64 bg-secondary/50 rounded-2xl animate-pulse" />)}
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {courseCategories.map((category, index) => {
                        const hasCatAccess = enrolledCourses?.some(ec => {
                          const courseDetails = allCourses?.find(c => c.id === ec.course_id);
                          return courseDetails?.category === category.name;
                        }) || isAdmin;
                        const catTests = allTests?.filter(t => t.category === category.name) || [];

                        return (
                          <motion.div key={category.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                            <Card className="group hover:shadow-xl transition-all cursor-pointer border-border hover:border-primary/40 h-full flex flex-col" onClick={() => navigate(`/tests/${category.slug}`)}>
                              <CardHeader>
                                <div className="flex justify-between items-start mb-4">
                                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${category.gradient} flex items-center justify-center text-2xl shadow-lg`}>
                                    {category.icon}
                                  </div>
                                  {!hasCatAccess && <div className="p-2 rounded-full bg-secondary text-muted-foreground"><Lock className="w-5 h-5" /></div>}
                                </div>
                                <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">{category.name}</CardTitle>
                                <CardDescription className="line-clamp-2">{category.description}</CardDescription>
                              </CardHeader>
                              <CardContent className="flex-1 flex flex-col justify-end gap-6">
                                <div className="flex items-center justify-between">
                                  <Badge variant="secondary" className="font-semibold">{catTests.length} Total Challenges</Badge>
                                  <div className="flex items-center gap-1 text-xs text-muted-foreground font-medium">
                                    <Clock className="w-3.5 h-3.5" />
                                    {catTests.reduce((acc, t) => acc + t.duration_minutes, 0)} mins
                                  </div>
                                </div>
                                <Button variant={hasCatAccess ? "gradient" : "outline"} className="w-full h-11 rounded-xl">
                                  {hasCatAccess ? 'Enter Practice Arena' : 'Unlock Access'}
                                  {hasCatAccess ? <ArrowRight className="w-4 h-4 ml-2" /> : <Lock className="w-4 h-4 ml-2" />}
                                </Button>
                              </CardContent>
                            </Card>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </section>
            </motion.div>
          ) : selectedTest ? (
            /* Test Player or Results View */
            <motion.div key="player-view" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
              {testCompleted ? renderResults() : renderTestPlayer()}
            </motion.div>
          ) : (
            /* Category-Specific Tests List */
            <motion.div key="test-list" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <section className="py-12 bg-gradient-to-br from-primary/10 via-background to-accent/10">
                <div className="container mx-auto px-4">
                  <Button variant="ghost" onClick={() => navigate('/tests')} className="mb-4 hover:bg-primary/5">
                    <ChevronLeft className="w-4 h-4 mr-2" /> Back to All Areas
                  </Button>
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-5xl drop-shadow-md">{categoryInfo?.icon}</span>
                      <h1 className="text-4xl font-heading font-bold text-foreground">
                        {categoryInfo?.name} <span className="text-primary text-2xl ml-2">Challenges</span>
                      </h1>
                    </div>
                    <p className="text-lg text-muted-foreground font-medium">{categoryInfo?.description}</p>
                  </motion.div>
                </div>
              </section>
              <section className="py-12 px-4 text-center">
                <div className="container mx-auto">
                  {isLoading ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {[1, 2, 3].map(i => <div key={i} className="h-48 bg-secondary/50 rounded-2xl animate-pulse" />)}
                    </div>
                  ) : allTests && allTests.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {allTests.map((test, index) => (
                        <motion.div key={test.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                          <Card className="glass-card hover-lift border-primary/5 h-full flex flex-col group relative overflow-visible">
                            <div className="absolute -top-3 -right-2 z-10 px-3 py-1 rounded-lg shadow-xl bg-gradient-to-r from-warning to-orange-500 text-white text-[10px] font-black tracking-widest uppercase">
                              {test.reward_points} XP
                            </div>
                            <CardHeader className="pt-8 text-left">
                              <div className="flex flex-wrap gap-2 mb-4">
                                <Badge variant="outline" className="bg-secondary/50 border-primary/10"><Clock className="w-3 h-3 mr-1" /> {test.duration_minutes}m</Badge>
                                <Badge variant="outline" className="bg-secondary/50 border-primary/10"><Award className="w-3 h-3 mr-1" /> {test.total_marks} Marks</Badge>
                              </div>
                              <CardTitle className="text-xl font-bold font-heading line-clamp-2 leading-tight group-hover:text-primary transition-colors">{test.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="flex-1 flex flex-col justify-end gap-6 text-left">
                              <p className="text-muted-foreground text-sm line-clamp-2 italic opacity-80 group-hover:opacity-100 transition-opacity">
                                {test.description}
                              </p>
                              <div className="pt-6 border-t border-primary/5">
                                {checkAccess(test) ? (
                                  <Button variant="gradient" className="w-full h-11 rounded-xl shadow-lg font-bold" onClick={() => handleStartTest(test)}>
                                    Start Challenge <ChevronRight className="w-4 h-4 ml-2" />
                                  </Button>
                                ) : (
                                  <div className="space-y-4">
                                    <div className="flex items-center justify-between p-3 rounded-xl bg-primary/5 border border-primary/10">
                                      <span className="text-lg font-black text-primary">₹{test.price || 0}</span>
                                      <Button variant="gradient" size="sm" className="px-5 rounded-lg font-bold" onClick={() => handleBuyTest(test)}>Unlock Individual</Button>
                                    </div>
                                    <Button variant="outline" className="w-full h-10 text-[11px] rounded-xl border-primary/10 font-bold" onClick={() => navigate(`/courses/${urlCategory}`)}>Full Category Access</Button>
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-20 bg-secondary/20 rounded-3xl border-2 border-dashed border-border">
                      <Target className="w-16 h-16 mx-auto text-muted-foreground/30 mb-6" />
                      <h3 className="text-2xl font-bold text-foreground">Arena Empty</h3>
                      <p className="text-muted-foreground max-w-sm mx-auto mt-2">No active challenges available for this category. Check back soon for new content!</p>
                    </div>
                  )}
                </div>
              </section>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
};

export default Tests;
