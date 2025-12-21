import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, BookOpen, Trophy, User, LogIn, 
  Flame, Zap, ChevronDown, LayoutDashboard, LogOut,
  GraduationCap, Target, Stethoscope, Cog, Leaf
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import ruchiLogo from '@/assets/ruchi-logo.png';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'All Courses', path: '/courses' },
  { name: 'Tests', path: '/tests' },
  { name: 'Leaderboard', path: '/leaderboard' },
  { name: 'Contact', path: '/contact' },
];

const categoryLinks = [
  { name: 'Class 10', path: '/courses/class-10', icon: BookOpen },
  { name: 'Class 12', path: '/courses/class-12', icon: GraduationCap },
  { name: 'IIT-JEE', path: '/courses/iit-jee', icon: Target },
  { name: 'NEET', path: '/courses/neet', icon: Stethoscope },
  { name: 'Engineering', path: '/courses/engineering', icon: Cog },
  { name: 'Environmental', path: '/courses/environmental', icon: Leaf },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src={ruchiLogo} alt="Ruchi Upadhyay Chemistry" className="h-10 w-auto" />
            <span className="text-lg font-heading font-bold hidden sm:block">
              <span className={scrolled ? 'text-foreground' : 'text-white'}>Ruchi</span>{' '}
              <span className="text-primary">Chemistry</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === link.path
                    ? 'text-primary'
                    : scrolled ? 'text-muted-foreground' : 'text-white/80'
                }`}
              >
                {link.name}
                {location.pathname === link.path && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full"
                  />
                )}
              </Link>
            ))}

            {/* Categories Dropdown */}
            <div className="relative">
              <button
                onClick={() => setCategoriesOpen(!categoriesOpen)}
                onMouseEnter={() => setCategoriesOpen(true)}
                className={`flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname.startsWith('/courses/') && location.pathname !== '/courses'
                    ? 'text-primary'
                    : scrolled ? 'text-muted-foreground' : 'text-white/80'
                }`}
              >
                Categories
                <ChevronDown className={`w-4 h-4 transition-transform ${categoriesOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {categoriesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    onMouseLeave={() => setCategoriesOpen(false)}
                    className="absolute top-full left-0 mt-2 w-56 bg-card border border-border rounded-xl shadow-xl py-2 z-50"
                  >
                    {categoryLinks.map((cat) => (
                      <Link
                        key={cat.path}
                        to={cat.path}
                        onClick={() => setCategoriesOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-card-foreground hover:bg-secondary transition-colors"
                      >
                        <cat.icon className="w-4 h-4 text-primary" />
                        {cat.name}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                {/* Streak Badge */}
                <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-accent/10 text-accent">
                  <Flame className="w-4 h-4" />
                  <span className="text-sm font-semibold">{profile?.streak ?? 0}</span>
                </div>

                {/* XP Badge */}
                <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary/10 text-primary">
                  <Zap className="w-4 h-4" />
                  <span className="text-sm font-semibold">{profile?.xp?.toLocaleString() ?? 0}</span>
                </div>

                <Link to="/dashboard">
                  <Button variant="ghost" size="sm">
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>

                <Link to="/admin">
                  <Button variant="outline" size="sm">
                    Admin
                  </Button>
                </Link>

                <Button variant="ghost" size="sm" onClick={handleSignOut}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              <Link to="/login">
                <Button variant="gradient" size="sm">
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden bg-card"
            >
              <div className="py-4 space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`block px-4 py-3 rounded-lg font-medium transition-colors ${
                      location.pathname === link.path
                        ? 'bg-primary/10 text-primary'
                        : 'text-foreground hover:bg-secondary'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}

                {/* Mobile Categories */}
                <div className="px-4 py-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Categories
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {categoryLinks.map((cat) => (
                      <Link
                        key={cat.path}
                        to={cat.path}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-foreground hover:bg-secondary transition-colors"
                      >
                        <cat.icon className="w-4 h-4 text-primary" />
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="pt-4 space-y-2 px-4">
                  {user ? (
                    <>
                      <Link to="/dashboard" onClick={() => setIsOpen(false)}>
                        <Button variant="secondary" className="w-full justify-start">
                          <LayoutDashboard className="w-4 h-4 mr-2" />
                          Dashboard
                        </Button>
                      </Link>
                      <Link to="/admin" onClick={() => setIsOpen(false)}>
                        <Button variant="outline" className="w-full justify-start">
                          Admin Panel
                        </Button>
                      </Link>
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start" 
                        onClick={() => {
                          setIsOpen(false);
                          handleSignOut();
                        }}
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    <Link to="/login" onClick={() => setIsOpen(false)}>
                      <Button variant="gradient" className="w-full justify-start">
                        <LogIn className="w-4 h-4 mr-2" />
                        Sign In
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;
