import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Twitter, Facebook, Instagram, Linkedin, Youtube } from 'lucide-react';
import ruchiLogo from '@/assets/ruchi-logo.png';

const Footer = () => {
  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-3">
              <img src={ruchiLogo} alt="Ruchi Upadhyay Chemistry" className="h-12 w-auto" />
              <div>
                <span className="text-xl font-heading font-bold block">
                  Ruchi Upadhyay
                </span>
                <span className="text-sm text-primary">Chemistry Classes</span>
              </div>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Master Chemistry with expert guidance. Specialized coaching for Class 10, 12, IIT-JEE, NEET, Engineering & Environmental Science.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 rounded-lg bg-background/10 hover:bg-primary transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-background/10 hover:bg-primary transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-background/10 hover:bg-primary transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-background/10 hover:bg-primary transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-background/10 hover:bg-primary transition-colors">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-semibold text-lg mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { name: 'Home', path: '/' },
                { name: 'Courses', path: '/courses' },
                { name: 'Tests', path: '/tests' },
                { name: 'Leaderboard', path: '/leaderboard' },
                { name: 'Contact Us', path: '/contact' },
              ].map((item) => (
                <li key={item.name}>
                  <Link to={item.path} className="text-muted-foreground hover:text-primary transition-colors text-sm">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-heading font-semibold text-lg mb-6">Courses</h4>
            <ul className="space-y-3">
              {[
                { name: 'Class 10 Chemistry', path: '/courses/class-10' },
                { name: 'Class 12 Chemistry', path: '/courses/class-12' },
                { name: 'IIT-JEE Chemistry', path: '/courses/iit-jee' },
                { name: 'NEET Chemistry', path: '/courses/neet' },
                { name: 'Engineering Chemistry', path: '/courses/engineering' },
                { name: 'Environmental Science', path: '/courses/environmental' },
              ].map((item) => (
                <li key={item.name}>
                  <Link to={item.path} className="text-muted-foreground hover:text-primary transition-colors text-sm">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading font-semibold text-lg mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="text-muted-foreground text-sm">123 Chemistry Lane, Education City, India - 110001</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <a href="mailto:contact@ruchichemistry.com" className="text-muted-foreground hover:text-primary text-sm">
                  contact@ruchichemistry.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <a href="tel:+919876543210" className="text-muted-foreground hover:text-primary text-sm">
                  +91 98765 43210
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-background/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm">
            © 2024 Ruchi Upadhyay Chemistry Classes. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-muted-foreground hover:text-primary text-sm">Privacy Policy</a>
            <a href="#" className="text-muted-foreground hover:text-primary text-sm">Terms of Service</a>
            <a href="#" className="text-muted-foreground hover:text-primary text-sm">Refund Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;