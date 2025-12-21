import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, BookOpen, Trophy, TrendingUp, Plus, Search,
  MoreVertical, Edit, Trash2, Eye, Download, Filter,
  BarChart3, PieChart, Activity, DollarSign, UserPlus,
  Settings, Bell, LogOut, Menu, X, ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { mockCourses, mockLeaderboard } from '@/data/mockData';

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { label: 'Total Users', value: '12,458', change: '+12%', icon: Users, color: 'bg-primary' },
    { label: 'Active Courses', value: '156', change: '+5%', icon: BookOpen, color: 'bg-accent' },
    { label: 'Total Revenue', value: '$45,890', change: '+23%', icon: DollarSign, color: 'bg-success' },
    { label: 'Completion Rate', value: '78%', change: '+8%', icon: Trophy, color: 'bg-warning' },
  ];

  const recentUsers = mockLeaderboard.slice(0, 5).map(entry => ({
    ...entry.user,
    enrolledDate: 'Dec 15, 2024',
    status: Math.random() > 0.3 ? 'Active' : 'Inactive',
  }));

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'analytics', label: 'Analytics', icon: PieChart },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

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
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-destructive hover:bg-destructive/10 transition-colors">
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
        <div className="p-6 space-y-6">
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

          {/* Tables */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Users Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-card rounded-2xl border border-border overflow-hidden"
            >
              <div className="p-6 border-b border-border flex items-center justify-between">
                <h2 className="text-lg font-heading font-semibold text-card-foreground">
                  Recent Users
                </h2>
                <Button variant="gradient" size="sm">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add User
                </Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-secondary/50">
                    <tr>
                      <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">User</th>
                      <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">Level</th>
                      <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">Status</th>
                      <th className="text-right px-6 py-3 text-sm font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {recentUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-secondary/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-semibold">
                              {user.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-medium text-card-foreground">{user.name}</p>
                              <p className="text-sm text-muted-foreground">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-semibold text-card-foreground">{user.level}</span>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant={user.status === 'Active' ? 'default' : 'secondary'}>
                            {user.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="icon">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-destructive">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Courses Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-card rounded-2xl border border-border overflow-hidden"
            >
              <div className="p-6 border-b border-border flex items-center justify-between">
                <h2 className="text-lg font-heading font-semibold text-card-foreground">
                  Top Courses
                </h2>
                <Button variant="gradient" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Course
                </Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-secondary/50">
                    <tr>
                      <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">Course</th>
                      <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">Students</th>
                      <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">Rating</th>
                      <th className="text-right px-6 py-3 text-sm font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {mockCourses.slice(0, 5).map((course) => (
                      <tr key={course.id} className="hover:bg-secondary/30 transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-card-foreground line-clamp-1">{course.title}</p>
                            <p className="text-sm text-muted-foreground">{course.category}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-card-foreground">{course.students.toLocaleString()}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1">
                            <span className="text-warning">★</span>
                            <span className="font-medium text-card-foreground">{course.rating}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="icon">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-destructive">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>

          {/* Activity Chart Placeholder */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
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
                <p className="text-sm text-muted-foreground">Connect to backend for real data</p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
