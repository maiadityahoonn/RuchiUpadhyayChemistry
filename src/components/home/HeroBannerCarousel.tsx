import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import banner1 from "@/assets/banner1.png";
import banner2 from "@/assets/banner1.png";
import banner3 from "@/assets/banner1.png";
import banner4 from "@/assets/banner1.png";

const bannerSlides = [
  { id: 1, image: banner1 },
  { id: 2, image: banner2 },
  { id: 3, image: banner3 },
  { id: 4, image: banner4 },
];

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
    scale: 1.1,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? "100%" : "-100%",
    opacity: 0,
    scale: 0.95,
  }),
};

const HeroBannerCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev - 1 + bannerSlides.length) % bannerSlides.length);
  };

  return (
    <section className="relative pt-16 md:pt-20">
      <div className="relative w-full overflow-hidden">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentSlide}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.4 },
              scale: { duration: 0.5 },
            }}
            className="w-full"
          >
            <motion.img
              src={bannerSlides[currentSlide].image}
              alt="Ruchi Upadhyay Chemistry Classes"
              className="w-full h-auto"
              initial={{ scale: 1 }}
              animate={{ scale: 1.05 }}
              transition={{ duration: 5, ease: "linear" }}
            />
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-background/20 backdrop-blur-md hover:bg-background/40 transition-all hover:scale-110 text-foreground border border-border/20"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-background/20 backdrop-blur-md hover:bg-background/40 transition-all hover:scale-110 text-foreground border border-border/20"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Dots with progress indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {bannerSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > currentSlide ? 1 : -1);
                setCurrentSlide(index);
              }}
              className="relative h-3 rounded-full transition-all overflow-hidden"
              style={{ width: index === currentSlide ? "2rem" : "0.75rem" }}
            >
              <span
                className={`absolute inset-0 rounded-full ${
                  index === currentSlide ? "bg-primary" : "bg-foreground/50 hover:bg-foreground/70"
                }`}
              />
              {index === currentSlide && (
                <motion.span
                  className="absolute inset-0 bg-primary/50 rounded-full origin-left"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 5, ease: "linear" }}
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroBannerCarousel;
