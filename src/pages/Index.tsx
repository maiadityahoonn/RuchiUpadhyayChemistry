import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, BookOpen, Trophy, Star, Award, Play } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CategoryGrid from '@/components/home/CategoryGrid';
import CourseCard from '@/components/courses/CourseCard';
import { Button } from '@/components/ui/button';
import { mockCourses, mockBadges } from '@/data/mockData';
import banner1 from '@/assets/banner1.png';

const Index = () => {
  const featuredCourses = mockCourses.slice(0, 3);

  const stats = [
    { icon: Users, label: 'Chemistry Students', value: '50K+', color: 'text-primary' },
    { icon: BookOpen, label: 'Video Lectures', value: '1000+', color: 'text-accent' },
    { icon: Trophy, label: 'Questions Solved', value: '500K+', color: 'text-success' },
    { icon: Star, label: 'Average Rating', value: '4.9', color: 'text-warning' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Banner */}
      <section className="pt-16 md:pt-20">
        <img src={banner1} alt="Ruchi Upadhyay Chemistry Classes" className="w-full h-auto" />
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className={`w-14 h-14 mx-auto mb-4 rounded-2xl bg-card shadow-lg flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="w-7 h-7" />
                </div>
                <h3 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-1">
                  {stat.value}
                </h3>
                <p className="text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Category Grid */}
      <CategoryGrid />

      {/* Featured Courses */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Star className="w-4 h-4" />
              Featured Courses
            </span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
              Start Your Chemistry Journey
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose from our most popular courses and start earning XP today
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCourses.map((course, index) => (
              <CourseCard key={course.id} course={course} index={index} />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link to="/courses">
              <Button variant="outline" size="lg">
                View All Courses
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Badges Showcase */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 text-success text-sm font-medium mb-4">
              <Award className="w-4 h-4" />
              Achievements
            </span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
              Collect Amazing Badges
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Earn badges as you progress through courses and complete challenges
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-6">
            {mockBadges.map((badge, index) => (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, type: 'spring' }}
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all"
              >
                <div className={`w-16 h-16 rounded-full ${badge.color} flex items-center justify-center text-3xl shadow-lg`}>
                  {badge.icon}
                </div>
                <span className="font-medium text-card-foreground">{badge.name}</span>
                <span className="text-xs text-muted-foreground text-center max-w-[120px]">
                  {badge.description}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-hero">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center space-y-8"
          >
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-background">
              Ready to Master Chemistry?
            </h2>
            <p className="text-xl text-background/80 max-w-2xl mx-auto">
              Join thousands of students who are acing their exams with Ruchi Upadhyay Chemistry Classes
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/courses">
                <Button variant="hero" size="xl">
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="xl"
                className="border-background/30 text-background hover:bg-background/10 hover:text-background"
              >
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
