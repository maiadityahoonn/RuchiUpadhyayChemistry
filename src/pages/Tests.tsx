import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, ArrowRight, Trophy, Zap, RotateCcw, Clock, Target, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { mockMCQQuestions } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Tests = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(mockMCQQuestions.length).fill(null));
  const [testCompleted, setTestCompleted] = useState(false);
  const [testStarted, setTestStarted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);

  const { user, profile, addXP } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const question = mockMCQQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / mockMCQQuestions.length) * 100;

  const handleAnswer = (answerIndex: number) => {
    if (showResult) return;
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < mockMCQQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setTestCompleted(true);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    let totalPoints = 0;
    answers.forEach((answer, index) => {
      if (answer === mockMCQQuestions[index].correctAnswer) {
        correct++;
        totalPoints += mockMCQQuestions[index].points;
      }
    });
    return { correct, total: mockMCQQuestions.length, points: totalPoints };
  };

  const saveTestResult = async (score: { correct: number; total: number; points: number }) => {
    if (!user || hasSaved) return;
    
    setIsSaving(true);
    try {
      // Save test result to database
      const { error: resultError } = await supabase
        .from('test_results')
        .insert({
          user_id: user.id,
          test_id: 'web-dev-quiz-1',
          score: score.correct,
          total_questions: score.total,
          xp_earned: score.points,
        });

      if (resultError) {
        console.error('Error saving test result:', resultError);
        toast({
          title: 'Error saving result',
          description: resultError.message,
          variant: 'destructive',
        });
        return;
      }

      // Add XP to user profile
      await addXP(score.points);

      setHasSaved(true);
      toast({
        title: 'Quiz completed!',
        description: `You earned ${score.points} XP!`,
      });
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Save results when test is completed
  useEffect(() => {
    if (testCompleted && user && !hasSaved) {
      const score = calculateScore();
      saveTestResult(score);
    }
  }, [testCompleted, user, hasSaved]);

  const resetTest = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setAnswers(new Array(mockMCQQuestions.length).fill(null));
    setTestCompleted(false);
    setTestStarted(false);
    setHasSaved(false);
  };

  const score = calculateScore();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          {!testStarted ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl mx-auto text-center space-y-8"
            >
              <div className="w-24 h-24 mx-auto rounded-3xl gradient-primary flex items-center justify-center shadow-glow">
                <Target className="w-12 h-12 text-primary-foreground" />
              </div>
              <h1 className="text-4xl font-heading font-bold text-foreground">
                Web Development Quiz
              </h1>
              <p className="text-lg text-muted-foreground">
                Test your knowledge with our interactive MCQ quiz. Answer questions, earn XP, and track your progress!
              </p>

              {!user && (
                <div className="bg-warning/10 border border-warning/30 rounded-xl p-4">
                  <p className="text-warning text-sm">
                    Sign in to save your progress and earn XP!
                  </p>
                </div>
              )}

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-card rounded-xl p-4 border border-border">
                  <div className="flex items-center justify-center gap-2 text-primary mb-2">
                    <Target className="w-5 h-5" />
                    <span className="font-semibold">{mockMCQQuestions.length}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Questions</p>
                </div>
                <div className="bg-card rounded-xl p-4 border border-border">
                  <div className="flex items-center justify-center gap-2 text-accent mb-2">
                    <Clock className="w-5 h-5" />
                    <span className="font-semibold">5 min</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Duration</p>
                </div>
                <div className="bg-card rounded-xl p-4 border border-border">
                  <div className="flex items-center justify-center gap-2 text-success mb-2">
                    <Zap className="w-5 h-5" />
                    <span className="font-semibold">55 XP</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Reward</p>
                </div>
              </div>

              <Button variant="hero" size="xl" onClick={() => setTestStarted(true)}>
                Start Quiz
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          ) : testCompleted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-2xl mx-auto text-center space-y-8"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2 }}
                className="w-32 h-32 mx-auto rounded-full gradient-gamification flex items-center justify-center shadow-lg"
              >
                <Trophy className="w-16 h-16 text-success-foreground" />
              </motion.div>

              <div>
                <h1 className="text-4xl font-heading font-bold text-foreground mb-2">
                  Quiz Completed!
                </h1>
                <p className="text-lg text-muted-foreground">
                  Great job! Here's how you did:
                </p>
              </div>

              <div className="bg-card rounded-2xl p-8 border border-border space-y-6">
                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <p className="text-4xl font-bold text-primary">{score.correct}</p>
                    <p className="text-sm text-muted-foreground">Correct</p>
                  </div>
                  <div>
                    <p className="text-4xl font-bold text-foreground">{score.total}</p>
                    <p className="text-sm text-muted-foreground">Total</p>
                  </div>
                  <div>
                    <p className="text-4xl font-bold text-success">+{score.points}</p>
                    <p className="text-sm text-muted-foreground">XP Earned</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Accuracy</span>
                    <span className="font-semibold text-foreground">
                      {Math.round((score.correct / score.total) * 100)}%
                    </span>
                  </div>
                  <Progress value={(score.correct / score.total) * 100} className="h-3" />
                </div>

                {isSaving && (
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving your progress...</span>
                  </div>
                )}

                {hasSaved && user && (
                  <div className="flex items-center justify-center gap-2 text-success">
                    <CheckCircle className="w-4 h-4" />
                    <span>Progress saved! XP added to your profile.</span>
                  </div>
                )}

                {!user && (
                  <div className="bg-warning/10 border border-warning/30 rounded-xl p-4">
                    <p className="text-warning text-sm">
                      Sign in to save your progress and track your XP!
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2"
                      onClick={() => navigate('/login')}
                    >
                      Sign In
                    </Button>
                  </div>
                )}
              </div>

              <div className="flex justify-center gap-4">
                <Button variant="outline" size="lg" onClick={resetTest}>
                  <RotateCcw className="w-5 h-5 mr-2" />
                  Retake Quiz
                </Button>
                <Button variant="gradient" size="lg" onClick={() => navigate('/leaderboard')}>
                  View Leaderboard
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </motion.div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-8">
              {/* Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Question {currentQuestion + 1} of {mockMCQQuestions.length}
                  </span>
                  <span className="font-semibold text-primary">
                    +{question.points} XP
                  </span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              {/* Question Card */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQuestion}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="bg-card rounded-2xl p-8 border border-border shadow-lg"
                >
                  <h2 className="text-2xl font-heading font-semibold text-card-foreground mb-8">
                    {question.question}
                  </h2>

                  <div className="space-y-4">
                    {question.options.map((option, index) => {
                      const isCorrect = index === question.correctAnswer;
                      const isSelected = index === selectedAnswer;
                      
                      let optionClass = 'bg-secondary hover:bg-secondary/80 border-border';
                      if (showResult) {
                        if (isCorrect) {
                          optionClass = 'bg-success/10 border-success text-success';
                        } else if (isSelected && !isCorrect) {
                          optionClass = 'bg-destructive/10 border-destructive text-destructive';
                        }
                      } else if (isSelected) {
                        optionClass = 'bg-primary/10 border-primary';
                      }

                      return (
                        <motion.button
                          key={index}
                          whileHover={!showResult ? { scale: 1.01 } : {}}
                          whileTap={!showResult ? { scale: 0.99 } : {}}
                          onClick={() => handleAnswer(index)}
                          disabled={showResult}
                          className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-center gap-4 ${optionClass}`}
                        >
                          <span className="w-8 h-8 rounded-full bg-card flex items-center justify-center font-semibold text-sm">
                            {String.fromCharCode(65 + index)}
                          </span>
                          <span className="flex-1 font-medium">{option}</span>
                          {showResult && isCorrect && (
                            <CheckCircle className="w-6 h-6 text-success" />
                          )}
                          {showResult && isSelected && !isCorrect && (
                            <XCircle className="w-6 h-6 text-destructive" />
                          )}
                        </motion.button>
                      );
                    })}
                  </div>

                  {/* Explanation */}
                  <AnimatePresence>
                    {showResult && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-6 p-4 rounded-xl bg-primary/5 border border-primary/20"
                      >
                        <p className="text-sm text-muted-foreground">
                          <span className="font-semibold text-primary">Explanation: </span>
                          {question.explanation}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </AnimatePresence>

              {/* Navigation */}
              {showResult && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-end"
                >
                  <Button variant="gradient" size="lg" onClick={handleNext}>
                    {currentQuestion < mockMCQQuestions.length - 1 ? 'Next Question' : 'See Results'}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </motion.div>
              )}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Tests;
