import { Sparkles, Award, BookOpen, Trophy, Users, Star } from 'lucide-react';

const announcements = [
  { icon: Sparkles, text: '🎉 New Batch Starting - Class 12 Chemistry' },
  { icon: Award, text: '🏆 100% Result in Previous Year Board Exams' },
  { icon: BookOpen, text: '📚 Free Demo Class Available' },
  { icon: Trophy, text: '🎯 IIT-JEE 2024 Results: 50+ Selections' },
  { icon: Users, text: '👨‍🎓 Join 50,000+ Successful Students' },
  { icon: Star, text: '⭐ Rated 4.9/5 by Students' },
];

const MarqueeSection = () => {
  return (
    <div className="bg-primary py-3 overflow-hidden">
      <div className="marquee-container">
        <div className="marquee-content">
          {/* Duplicate the content for seamless loop */}
          {[...announcements, ...announcements].map((item, index) => (
            <div
              key={index}
              className="inline-flex items-center gap-2 mx-8 text-primary-foreground font-medium"
            >
              <item.icon className="w-5 h-5" />
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MarqueeSection;