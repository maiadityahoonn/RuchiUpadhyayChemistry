import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Testimonial } from '@/types';

const MOCK_TESTIMONIALS = [
  {
    id: '1',
    name: 'Priya Sharma',
    role: 'IIT-JEE Qualified 2024',
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    content: 'Ruchi ma\'am\'s teaching style is exceptional. Her organic chemistry concepts cleared all my doubts. I secured AIR 850 in JEE Advanced!',
    rating: 5,
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Rahul Verma',
    role: 'NEET 2024 - 650+ Score',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    content: 'The best chemistry classes in the city! The mock tests and practice papers helped me tremendously in NEET preparation.',
    rating: 5,
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Ananya Singh',
    role: 'Class 12 - 98% in Chemistry',
    imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    content: 'I was struggling with physical chemistry before joining here. Now it\'s my strongest subject! Thank you Ruchi ma\'am.',
    rating: 5,
    createdAt: new Date().toISOString()
  },
  {
    id: '4',
    name: 'Arjun Patel',
    role: 'Engineering Student',
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    content: 'Even for engineering chemistry, the foundation I built here helped me score consistently well in college.',
    rating: 5,
    createdAt: new Date().toISOString()
  },
];

const TestimonialsSection = () => {
  const { data: testimonials, isLoading } = useQuery({
    queryKey: ['testimonials'],
    queryFn: async () => {
      console.log('Fetching testimonials from Supabase...');
      try {
        const { data, error } = await supabase
          .from('testimonials')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(4);

        if (error) {
          console.error('Error fetching testimonials:', error);
          throw error;
        }

        console.log('Fetched testimonials:', data);

        if (!data || data.length === 0) {
          return MOCK_TESTIMONIALS;
        }

        return data.map((t: any) => ({
          id: t.id,
          name: t.name,
          role: t.role,
          imageUrl: t.image_url,
          content: t.content,
          rating: t.rating,
          createdAt: t.created_at
        })) as Testimonial[];
      } catch (error) {
        console.error('Failed to fetch testimonials, falling back to mock:', error);
        return MOCK_TESTIMONIALS;
      }
    },
  });

  const displayTestimonials = isLoading ? MOCK_TESTIMONIALS : (testimonials || MOCK_TESTIMONIALS);

  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Quote className="w-4 h-4" />
            Student Testimonials
          </span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
            What Our Students Say
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Hear from our successful students who achieved their dreams
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayTestimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-card rounded-2xl p-6 border border-border shadow-lg relative"
            >
              {/* Quote icon */}
              <div className="absolute -top-3 -right-3 w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
                <Quote className="w-5 h-5 text-primary-foreground" />
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-warning text-warning" />
                ))}
              </div>

              {/* Content */}
              <p className="text-muted-foreground text-sm mb-6 line-clamp-4">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <img
                  src={testimonial.imageUrl || '/placeholder.svg'}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-primary"
                />
                <div>
                  <h4 className="font-semibold text-card-foreground">{testimonial.name}</h4>
                  <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;