import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Users, BookOpen, Trophy, TrendingUp, Search,
  BarChart3, PieChart, Activity, DollarSign,
  Settings, Bell, LogOut, Menu, X, FileText, ClipboardList
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useIsAdmin, useNotes, useTests, useCoursesList } from '@/hooks/useAdmin';
import AdminNotes from '@/components/admin/AdminNotes';
import AdminTests from '@/components/admin/AdminTests';
import AdminCourses from '@/components/admin/AdminCourses';

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { data: isAdmin, isLoading: isCheckingAdmin } = useIsAdmin();
  const { data: notes } = useNotes();
  const { data: tests } = useTests();
  const { data: courses } = useCoursesList();

  useEffect(() => {
    if (!isCheckingAdmin && !isAdmin && user) {
      // User is logged in but not admin - show message
    }
  }, [isAdmin, isCheckingAdmin, user]);

  const stats = [
    { label: 'Total Courses', value: courses?.length || 0, change: '+5%', icon: BookOpen, color: 'bg-primary' },
    { label: 'Total Tests', value: tests?.length || 0, change: '+12%', icon: ClipboardList, color: 'bg-accent' },
    { label: 'Total Notes', value: notes?.length || 0, change: '+8%', icon: FileText, color: 'bg-success' },
    { label: 'Active Items', value: (courses?.filter(c => c.is_active).length || 0) + (tests?.filter(t => t.is_active).length || 0), change: '+15%', icon: Trophy, color: 'bg-warning' },
  ];

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'tests', label: 'Tests', icon: ClipboardList },
    { id: 'notes', label: 'Notes', icon: FileText },
    { id: 'analytics', label: 'Analytics', icon: PieChart },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please Sign In</h1>
          <p className="text-muted-foreground mb-4">You need to be logged in to access the admin panel.</p>
          <Button onClick={() => navigate('/login')}>Go to Login</Button>
        </div>
      </div>
    );
  }

  if (isCheckingAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Checking permissions...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-destructive" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-muted-foreground mb-4">
            You don't have admin privileges. Contact an administrator to get access.
          </p>
          <Button onClick={() => navigate('/')}>Go to Home</Button>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'courses':
        return <AdminCourses />;
      case 'tests':
        return <AdminTests />;
      case 'notes':
        return <AdminNotes />;
      case 'overview':
      default:
        return (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card rounded-2xl p-6 border border-border"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl ${stat.color}`}>
                      <stat.icon className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <Badge variant="secondary" className="text-success">
                      {stat.change}
                    </Badge>
                  </div>
                  <p className="text-3xl font-bold text-card-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-card rounded-2xl p-6 border border-border cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => setActiveTab('courses')}
              >
                <BookOpen className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">Manage Courses</h3>
                <p className="text-sm text-muted-foreground">Add, edit, or remove courses from the platform</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-card rounded-2xl p-6 border border-border cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => setActiveTab('tests')}
              >
                <ClipboardList className="w-10 h-10 text-accent mb-4" />
                <h3 className="text-lg font-semibold mb-2">Manage Tests</h3>
                <p className="text-sm text-muted-foreground">Create and manage category-wise tests</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-card rounded-2xl p-6 border border-border cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => setActiveTab('notes')}
              >
                <FileText className="w-10 h-10 text-success mb-4" />
                <h3 className="text-lg font-semibold mb-2">Manage Notes</h3>
                <p className="text-sm text-muted-foreground">Add study notes organized by category</p>
              </motion.div>
            </div>

            {/* Activity Placeholder */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-card rounded-2xl p-6 border border-border"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-heading font-semibold text-card-foreground">
                  Platform Activity
                </h2>
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm">Daily</Button>
                  <Button variant="ghost" size="sm">Weekly</Button>
                  <Button variant="ghost" size="sm">Monthly</Button>
                </div>
              </div>
              <div className="h-64 flex items-center justify-center bg-secondary/30 rounded-xl">
                <div className="text-center">
                  <Activity className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">Activity chart will be displayed here</p>
                </div>
              </div>
            </motion.div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 256 : 80 }}
        className="fixed left-0 top-0 bottom-0 bg-card border-r border-border z-50 flex flex-col"
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-border">
          {sidebarOpen && (
            <span className="text-xl font-heading font-bold text-foreground">
              Admin
            </span>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-secondary transition-colors"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === item.id
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-secondary text-muted-foreground hover:text-foreground'
              }`}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {sidebarOpen && <span className="font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-border">
          <button 
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {sidebarOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {/* Header */}
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-heading font-semibold text-foreground capitalize">
              {activeTab}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search..." className="pl-10 w-64" />
            </div>
            <Button variant="outline" size="icon">
              <Bell className="w-5 h-5" />
            </Button>
            <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-semibold">
              A
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-6">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
