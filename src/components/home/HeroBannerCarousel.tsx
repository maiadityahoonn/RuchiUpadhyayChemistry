import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import banner1 from '@/assets/banner1.png';

const bannerSlides = [
  {
    id: 1,
    image: banner1,
    title: 'Master Chemistry with Expert Guidance',
    subtitle: 'Class 10, 12, IIT-JEE, NEET & More',
  },
  {
    id: 2,
    image: banner1,
    title: 'Excel in Your Board Exams',
    subtitle: 'Comprehensive Study Material & Practice Tests',
  },
  {
    id: 3,
    image: banner1,
    title: 'Crack Competitive Exams',
    subtitle: 'IIT-JEE & NEET Preparation by Experts',
  },
];

const HeroBannerCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + bannerSlides.length) % bannerSlides.length);
  };

  return (
    <section className="relative pt-16 md:pt-20 overflow-hidden">
      <div className="relative w-full h-[300px] md:h-[450px] lg:h-[550px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <img
              src={bannerSlides[currentSlide].image}
              alt={bannerSlides[currentSlide].title}
              className="w-full h-full object-cover"
            />
            {/* Overlay with text */}
            <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/50 to-transparent flex items-center">
              <div className="container mx-auto px-4">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="max-w-xl"
                >
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-background mb-4">
                    {bannerSlides[currentSlide].title}
                  </h1>
                  <p className="text-lg md:text-xl text-background/80 mb-6">
                    {bannerSlides[currentSlide].subtitle}
                  </p>
                  <Button variant="hero" size="lg">
                    Start Learning Today
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/20 backdrop-blur-sm hover:bg-background/40 transition-colors text-background"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/20 backdrop-blur-sm hover:bg-background/40 transition-colors text-background"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {bannerSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide
                  ? 'bg-primary w-8'
                  : 'bg-background/50 hover:bg-background/70'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroBannerCarousel;