import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Star, Clock, Users, Zap, BookOpen } from 'lucide-react';
import { Course } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface CourseCardProps {
  course: Course;
  index?: number;
}

const CourseCard = ({ course, index = 0 }: CourseCardProps) => {
  const discount = course.originalPrice 
    ? Math.round((1 - course.price / course.originalPrice) * 100) 
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      className="group"
    >
      <div className="bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-border">
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20" />
          <div className="absolute inset-0 flex items-center justify-center">
            <BookOpen className="w-16 h-16 text-primary/30" />
          </div>
          
          {/* Badges */}
          <div className="absolute top-4 left-4 flex gap-2">
            {discount > 0 && (
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
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-card-foreground">${course.price}</span>
              {course.originalPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  ${course.originalPrice}
                </span>
              )}
            </div>
            <Link to={`/courses/${course.id}`}>
              <Button variant="gradient" size="sm">
                Enroll Now
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CourseCard;
