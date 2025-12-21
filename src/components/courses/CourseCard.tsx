import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Star, Clock, Users, Zap, BookOpen, CheckCircle, Loader2, Play } from 'lucide-react';
import { Course } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useCourses } from '@/hooks/useCourses';
import { useAuth } from '@/contexts/AuthContext';

interface CourseCardProps {
  course: Course;
  index?: number;
  showProgress?: boolean;
}

const CourseCard = ({ course, index = 0, showProgress = false }: CourseCardProps) => {
  const [isEnrolling, setIsEnrolling] = useState(false);
  const { enrollInCourse, isEnrolled, getProgress } = useCourses();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const enrolled = isEnrolled(course.id);
  const progress = getProgress(course.id);

  const discount = course.originalPrice 
    ? Math.round((1 - course.price / course.originalPrice) * 100) 
    : 0;

  const handleEnroll = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      navigate('/login');
      return;
    }
    
    setIsEnrolling(true);
    await enrollInCourse(course.id);
    setIsEnrolling(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      className="group"
    >
      <Link to={`/course/${course.id}`} className="block">
        <div className="bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-border">
          {/* Image */}
          <div className="relative h-48 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20" />
            <div className="absolute inset-0 flex items-center justify-center">
              <BookOpen className="w-16 h-16 text-primary/30" />
            </div>
            
            {/* Badges */}
            <div className="absolute top-4 left-4 flex gap-2">
              {enrolled && (
                <Badge className="bg-success text-success-foreground">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Enrolled
                </Badge>
              )}
              {!enrolled && discount > 0 && (
                <Badge className="bg-accent text-accent-foreground">
                  {discount}% OFF
                </Badge>
              )}
              <Badge variant="secondary" className="bg-card/90 backdrop-blur-sm">
                {course.level}
              </Badge>
            </div>

            {/* XP Reward */}
            <div className="absolute top-4 right-4">
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-success/90 text-success-foreground text-xs font-semibold">
                <Zap className="w-3 h-3" />
                +{course.xpReward} XP
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-primary font-medium">{course.category}</p>
              <h3 className="font-heading font-semibold text-lg text-card-foreground line-clamp-2 group-hover:text-primary transition-colors">
                {course.title}
              </h3>
            </div>

            <p className="text-sm text-muted-foreground line-clamp-2">
              {course.description}
            </p>

            {/* Progress Bar for enrolled courses */}
            {enrolled && (showProgress || progress > 0) && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-semibold text-primary">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}

            {/* Stats */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {course.duration}
              </div>
              <div className="flex items-center gap-1">
                <BookOpen className="w-4 h-4" />
                {course.lessons} lessons
              </div>
            </div>

            {/* Rating & Students */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-warning fill-warning" />
                  <span className="font-semibold text-card-foreground">{course.rating}</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span className="text-sm">{course.students.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Price & CTA */}
            <div className="flex items-center justify-between pt-4 border-t border-border">
              {!enrolled ? (
                <>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-card-foreground">₹{course.price}</span>
                    {course.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        ₹{course.originalPrice}
                      </span>
                    )}
                  </div>
                  <Button 
                    variant="gradient" 
                    size="sm" 
                    onClick={handleEnroll}
                    disabled={isEnrolling}
                  >
                    {isEnrolling ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                        Enrolling...
                      </>
                    ) : (
                      'Enroll Now'
                    )}
                  </Button>
                </>
              ) : (
                <>
                  <div className="text-sm text-muted-foreground">
                    {progress === 100 ? 'Completed!' : `${course.lessons - Math.floor(course.lessons * progress / 100)} lessons left`}
                  </div>
                  <Button variant="gradient" size="sm">
                    <Play className="w-4 h-4 mr-1" />
                    {progress > 0 ? 'Continue' : 'Start'}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default CourseCard;
