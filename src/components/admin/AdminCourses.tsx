import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Search, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useCoursesList, useCreateCourse, useUpdateCourse, useDeleteCourse, Course } from '@/hooks/useAdmin';
import { courseCategories } from '@/data/mockData';

const AdminCourses = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    instructor: 'Ruchi Upadhyay',
    price: 0,
    original_price: null as number | null,
    image_url: '',
    duration: '',
    lessons: 0,
    level: 'Beginner',
    xp_reward: 100,
    is_active: true,
  });

  const { data: courses, isLoading } = useCoursesList();
  const createCourse = useCreateCourse();
  const updateCourse = useUpdateCourse();
  const deleteCourse = useDeleteCourse();

  const filteredCourses = courses?.filter(course =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenDialog = (course?: Course) => {
    if (course) {
      setEditingCourse(course);
      setFormData({
        title: course.title,
        description: course.description || '',
        category: course.category,
        instructor: course.instructor,
        price: course.price,
        original_price: course.original_price,
        image_url: course.image_url || '',
        duration: course.duration || '',
        lessons: course.lessons,
        level: course.level,
        xp_reward: course.xp_reward,
        is_active: course.is_active,
      });
    } else {
      setEditingCourse(null);
      setFormData({
        title: '',
        description: '',
        category: '',
        instructor: 'Ruchi Upadhyay',
        price: 0,
        original_price: null,
        image_url: '',
        duration: '',
        lessons: 0,
        level: 'Beginner',
        xp_reward: 100,
        is_active: true,
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingCourse) {
      await updateCourse.mutateAsync({ id: editingCourse.id, ...formData });
    } else {
      await createCourse.mutateAsync(formData);
    }
    
    setIsDialogOpen(false);
    setEditingCourse(null);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this course?')) {
      await deleteCourse.mutateAsync(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="gradient" onClick={() => handleOpenDialog()}>
              <Plus className="w-4 h-4 mr-2" />
              Add Course
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingCourse ? 'Edit Course' : 'Create New Course'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter course title"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {courseCategories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.name}>
                          {cat.icon} {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter course description"
                  rows={3}
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="instructor">Instructor</Label>
                  <Input
                    id="instructor"
                    value={formData.instructor}
                    onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="e.g., 40 hours"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lessons">Lessons</Label>
                  <Input
                    id="lessons"
                    type="number"
                    value={formData.lessons}
                    onChange={(e) => setFormData({ ...formData, lessons: parseInt(e.target.value) || 0 })}
                    min={0}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (₹)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                    min={0}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="originalPrice">Original Price (₹)</Label>
                  <Input
                    id="originalPrice"
                    type="number"
                    value={formData.original_price || ''}
                    onChange={(e) => setFormData({ ...formData, original_price: e.target.value ? parseInt(e.target.value) : null })}
                    min={0}
                    placeholder="Optional"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="xpReward">XP Reward</Label>
                  <Input
                    id="xpReward"
                    type="number"
                    value={formData.xp_reward}
                    onChange={(e) => setFormData({ ...formData, xp_reward: parseInt(e.target.value) || 0 })}
                    min={0}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="level">Level</Label>
                  <Select
                    value={formData.level}
                    onValueChange={(value) => setFormData({ ...formData, level: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Beginner">Beginner</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="imageUrl">Image URL</Label>
                  <Input
                    id="imageUrl"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Switch
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label>Active</Label>
              </div>
              
              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="gradient" disabled={createCourse.isPending || updateCourse.isPending}>
                  {editingCourse ? 'Update' : 'Create'} Course
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Courses Table */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary/50">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Course</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Category</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Price</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-right px-6 py-4 text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                    Loading courses...
                  </td>
                </tr>
              ) : filteredCourses && filteredCourses.length > 0 ? (
                filteredCourses.map((course) => (
                  <motion.tr
                    key={course.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-secondary/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <BookOpen className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-card-foreground line-clamp-1">{course.title}</p>
                          <p className="text-sm text-muted-foreground">{course.lessons} lessons • {course.duration}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="secondary">{course.category}</Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-card-foreground">₹{course.price}</span>
                        {course.original_price && (
                          <span className="text-sm text-muted-foreground line-through">₹{course.original_price}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={course.is_active ? 'default' : 'secondary'}>
                        {course.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(course)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-destructive"
                          onClick={() => handleDelete(course.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                    No courses found. Create your first course!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminCourses;
