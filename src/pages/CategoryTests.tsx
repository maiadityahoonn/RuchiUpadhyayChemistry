import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, Award, CheckCircle, XCircle, ArrowRight, 
  Trophy, Zap, RotateCcw, Home, ChevronLeft 
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useTests, Test } from '@/hooks/useAdmin';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { courseCategories } from '@/data/mockData';

const CategoryTests = () => {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const { user, addXP } = useAuth();
  const { toast } = useToast();
  
  const categoryInfo = courseCategories.find(c => c.slug === category);
  const categoryName = categoryInfo?.name || '';
  
  const { data: tests, isLoading } = useTests(categoryName);
  
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showAnswer, setShowAnswer] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

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
      await supabase.from('test_results').insert({
        user_id: user.id,
        test_id: selectedTest.id,
        score: score.percentage,
        total_questions: score.total,
        xp_earned: score.xp,
      });
      
      await addXP(score.xp);
      
      toast({
        title: 'Test Completed!',
        description: `You earned ${score.xp} XP`,
      });
    } catch (error) {
      console.error('Error saving test result:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const resetTest = () => {
    setSelectedTest(null);
    setCurrentQuestion(0);
    setAnswers([]);
    setShowAnswer(false);
    setTestCompleted(false);
  };

  if (!categoryInfo) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Category Not Found</h1>
          <Button onClick={() => navigate('/tests')}>Go Back to Tests</Button>
        </div>
      </div>
    );
  }

  // Test in progress view
  if (selectedTest && !testCompleted) {
    const question = selectedTest.questions[currentQuestion];
    const progress = ((currentQuestion + 1) / selectedTest.questions.length) * 100;

    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        
        <main className="pt-20 pb-16">
          <div className="container mx-auto px-4 max-w-3xl">
            <div className="mb-6">
              <Button variant="ghost" onClick={resetTest}>
                <ChevronLeft className="w-4 h-4 mr-2" />
                Exit Test
              </Button>
            </div>
            
            <Card className="border-border">
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="secondary">{selectedTest.title}</Badge>
                  <span className="text-sm text-muted-foreground">
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
                    <h3 className="text-xl font-semibold mb-6">{question.question}</h3>
                    
                    <div className="space-y-3">
                      {question.options.map((option, index) => {
                        const isSelected = answers[currentQuestion] === index;
                        const isCorrect = index === question.correctAnswer;
                        
                        let optionClass = 'border-border hover:border-primary';
                        if (showAnswer) {
                          if (isCorrect) optionClass = 'border-success bg-success/10';
                          else if (isSelected) optionClass = 'border-destructive bg-destructive/10';
                        } else if (isSelected) {
                          optionClass = 'border-primary bg-primary/10';
                        }
                        
                        return (
                          <motion.button
                            key={index}
                            onClick={() => handleAnswer(index)}
                            disabled={showAnswer}
                            className={`w-full p-4 rounded-xl border-2 text-left transition-all ${optionClass}`}
                            whileHover={{ scale: showAnswer ? 1 : 1.01 }}
                            whileTap={{ scale: showAnswer ? 1 : 0.99 }}
                          >
                            <div className="flex items-center gap-3">
                              <span className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center font-semibold text-sm">
                                {String.fromCharCode(65 + index)}
                              </span>
                              <span className="flex-1">{option}</span>
                              {showAnswer && isCorrect && <CheckCircle className="w-5 h-5 text-success" />}
                              {showAnswer && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-destructive" />}
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                    
                    {showAnswer && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-6 p-4 rounded-xl bg-secondary/50"
                      >
                        <p className="text-sm text-muted-foreground">
                          <strong>Explanation:</strong> {question.explanation}
                        </p>
                      </motion.div>
                    )}
                  </motion.div>
                </AnimatePresence>
                
                {showAnswer && (
                  <Button onClick={handleNext} className="w-full" variant="gradient">
                    {currentQuestion < selectedTest.questions.length - 1 ? 'Next Question' : 'See Results'}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  // Test completed view
  if (testCompleted && selectedTest) {
    const score = calculateScore();
    
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        
        <main className="pt-20 pb-16">
          <div className="container mx-auto px-4 max-w-2xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Card className="text-center">
                <CardHeader>
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <Trophy className="w-10 h-10 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-2xl">Test Completed!</CardTitle>
                  <CardDescription>{selectedTest.title}</CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-secondary/50">
                      <p className="text-3xl font-bold text-primary">{score.percentage}%</p>
                      <p className="text-sm text-muted-foreground">Score</p>
                    </div>
                    <div className="p-4 rounded-xl bg-secondary/50">
                      <p className="text-3xl font-bold text-success">{score.correct}/{score.total}</p>
                      <p className="text-sm text-muted-foreground">Correct</p>
                    </div>
                    <div className="p-4 rounded-xl bg-secondary/50">
                      <div className="flex items-center justify-center gap-1">
                        <Zap className="w-5 h-5 text-warning" />
                        <p className="text-3xl font-bold text-warning">{score.xp}</p>
                      </div>
                      <p className="text-sm text-muted-foreground">XP Earned</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button onClick={() => handleStartTest(selectedTest)} variant="outline" className="flex-1">
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Retry Test
                    </Button>
                    <Button onClick={resetTest} variant="gradient" className="flex-1">
                      <Home className="w-4 h-4 mr-2" />
                      More Tests
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </main>
        
        <Footer />
      </div>
    );
  }

  // Test selection view
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20 pb-16">
        <section className="py-12 bg-gradient-to-br from-primary/10 via-background to-accent/10">
          <div className="container mx-auto px-4">
            <Button variant="ghost" onClick={() => navigate('/tests')} className="mb-4">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to All Tests
            </Button>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">{categoryInfo.icon}</span>
                <h1 className="text-4xl font-heading font-bold text-foreground">
                  {categoryInfo.name} <span className="text-primary">Tests</span>
                </h1>
              </div>
              <p className="text-lg text-muted-foreground">{categoryInfo.description}</p>
            </motion.div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            {isLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-48 bg-secondary/50 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : tests && tests.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tests.map((test, index) => (
                  <motion.div
                    key={test.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="group hover:shadow-xl transition-all duration-300 border-border hover:border-primary/50 h-full flex flex-col">
                      <CardHeader>
                        <CardTitle className="text-lg group-hover:text-primary transition-colors">
                          {test.title}
                        </CardTitle>
                        <CardDescription>{test.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="flex-1 flex flex-col justify-end">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {test.duration_minutes} mins
                          </div>
                          <div className="flex items-center gap-1">
                            <Award className="w-4 h-4" />
                            {test.total_marks} marks
                          </div>
                        </div>
                        <Badge variant="secondary" className="mb-4 w-fit">
                          {test.questions.length} Questions
                        </Badge>
                        <Button 
                          onClick={() => handleStartTest(test)} 
                          variant="gradient" 
                          className="w-full"
                        >
                          Start Test
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Award className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">No Tests Available</h3>
                <p className="text-muted-foreground">
                  Tests for {categoryInfo.name} will appear here once added by admin
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default CategoryTests;
