import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Award, Clock, ArrowRight, Target } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTests } from '@/hooks/useAdmin';
import { courseCategories } from '@/data/mockData';

const Tests = () => {
  const navigate = useNavigate();
  const { data: allTests, isLoading } = useTests();

  // Group tests by category
  const testsByCategory = courseCategories.map(category => ({
    ...category,
    tests: allTests?.filter(test => test.category === category.name) || [],
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
              className="text-center max-w-3xl mx-auto"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent mb-6">
                <Target className="w-5 h-5" />
                <span className="font-medium">Practice Tests</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
                Test Your <span className="text-primary">Knowledge</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Take category-wise tests to assess your understanding and earn XP rewards
              </p>
            </motion.div>
          </div>
        </section>

        {/* Categories Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {isLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-64 bg-secondary/50 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {testsByCategory.map((category, index) => (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card 
                      className="group hover:shadow-xl transition-all duration-300 border-border hover:border-primary/50 h-full flex flex-col cursor-pointer"
                      onClick={() => navigate(`/tests/${category.slug}`)}
                    >
                      <CardHeader>
                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${category.gradient} flex items-center justify-center text-2xl mb-4`}>
                          {category.icon}
                        </div>
                        <CardTitle className="text-xl group-hover:text-primary transition-colors">
                          {category.name}
                        </CardTitle>
                        <CardDescription>{category.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="flex-1 flex flex-col justify-end">
                        <div className="flex items-center justify-between mb-4">
                          <Badge variant="secondary">
                            {category.tests.length} {category.tests.length === 1 ? 'Test' : 'Tests'} Available
                          </Badge>
                          {category.tests.length > 0 && (
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Clock className="w-4 h-4" />
                              {category.tests.reduce((acc, t) => acc + t.duration_minutes, 0)} mins total
                            </div>
                          )}
                        </div>
                        <Button variant="gradient" className="w-full group/btn">
                          View Tests
                          <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}

            {/* No tests message */}
            {!isLoading && (!allTests || allTests.length === 0) && (
              <div className="text-center py-16">
                <Award className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">No Tests Available Yet</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Tests will appear here once they are added by the administrator. Check back soon!
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

export default Tests;
