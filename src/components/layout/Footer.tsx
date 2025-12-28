import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Twitter, Facebook, Instagram, Linkedin, Youtube, ArrowRight, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import ruchiLogo from '@/assets/ruchi-logo.png';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-[#0F0F0F] text-white overflow-hidden overflow-visible border-t border-white/5">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
          {/* Brand & Description */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-3"
            >
              <img src={ruchiLogo} alt="Ruchi Upadhyay" className="h-14 w-auto brightness-0 invert" />
            </motion.div>

            <p className="text-gray-400 text-base leading-relaxed max-w-xs">
              Empowering learners through expert-led chemistry education. Join our community and master the science of life.
            </p>

            <div className="flex gap-4">
              {[Twitter, Facebook, Instagram, Linkedin, Youtube].map((Icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  whileHover={{ y: -5, scale: 1.1 }}
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary transition-all duration-300 backdrop-blur-sm group"
                >
                  <Icon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-8">
            <h4 className="text-xl font-heading font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent italic">
              Quick Navigation
            </h4>
            <ul className="space-y-4">
              {[
                { name: 'Home Landing', path: '/' },
                { name: 'Premium Courses', path: '/courses' },
                { name: 'Study Notes', path: '/notes' },
                { name: 'Interactive Tests', path: '/tests' },
                { name: 'Global Leaderboard', path: '/leaderboard' },
                { name: 'Support Center', path: '/contact' },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className="text-gray-400 hover:text-primary transition-all duration-300 flex items-center group text-base"
                  >
                    <ArrowRight className="w-0 h-4 mr-0 group-hover:w-4 group-hover:mr-2 transition-all duration-300 text-primary opacity-0 group-hover:opacity-100" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Categories */}
          <div className="space-y-8">
            <h4 className="text-xl font-heading font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent italic">
              Top Categories
            </h4>
            <ul className="space-y-4">
              {[
                { name: 'Class 10th', path: '/courses/class-10' },
                { name: 'Class 12th', path: '/courses/class-12' },
                { name: 'IIT-JEE Prep', path: '/courses/iit-jee' },
                { name: 'NEET Special', path: '/courses/neet' },
                { name: 'Engineering Chem', path: '/courses/engineering' },
                { name: 'Env. Science', path: '/courses/environmental' },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className="text-gray-400 hover:text-primary transition-all duration-300 flex items-center group text-base"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/50 mr-3 group-hover:scale-150 group-hover:bg-primary transition-all duration-300" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Direct Support */}
          <div className="space-y-8">
            <h4 className="text-xl font-heading font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent italic">
              Contact Us
            </h4>
            <div className="space-y-6">
              <div className="flex gap-4 group">
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:border-primary/50 transition-colors">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-white italic">Visit Us</p>
                  <p className="text-gray-400 text-sm leading-relaxed">Education City, India - 110001</p>
                </div>
              </div>

              <div className="flex gap-4 group">
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:border-primary/50 transition-colors">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-white italic">Mail Us</p>
                  <a href="mailto:contact@ruchichemistry.com" className="text-gray-400 text-sm hover:text-primary transition-colors">
                    info@ruchichemistry.com
                  </a>
                </div>
              </div>

              <div className="flex gap-4 group">
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:border-primary/50 transition-colors">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-white italic">Call Us</p>
                  <a href="tel:+919876543210" className="text-gray-400 text-sm hover:text-primary transition-colors">
                    +91 98765 43210
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 text-sm">
          {/* Left: Copyright */}
          <p className="text-gray-500 order-3 md:order-1">
            © {currentYear} Ruchi Upadhyay Chemistry.
          </p>

          {/* Center: Made By */}
          <motion.a
            href="https://www.instagram.com/internshipcatalyst/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors order-1 md:order-2 group"
            whileHover={{ scale: 1.05 }}
          >
            <span>Made by</span>
            <motion.span
              animate={{
                scale: [1, 1.2, 1],
                opacity: [1, 0.6, 1]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Heart className="w-4 h-4 text-red-500 fill-current group-hover:drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
            </motion.span>
            <span className="font-semibold tracking-wide">Internship Catalyst</span>
          </motion.a>

          {/* Right: Policies */}
          <div className="flex flex-wrap justify-center gap-6 order-2 md:order-3">
            {['Privacy Policy', 'Terms of Service', 'Refund Policy'].map((text) => (
              <a
                key={text}
                href="#"
                className="text-gray-500 hover:text-white text-xs tracking-wider uppercase transition-colors"
              >
                {text}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
