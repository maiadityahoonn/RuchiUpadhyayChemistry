import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Search, ClipboardList, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useTests, useCreateTest, useUpdateTest, useDeleteTest, Test } from '@/hooks/useAdmin';
import { courseCategories } from '@/data/mockData';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  points: number;
}

const AdminTests = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTest, setEditingTest] = useState<Test | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    duration_minutes: 30,
    total_marks: 100,
    is_active: true,
    questions: [] as Question[],
  });

  const { data: tests, isLoading } = useTests();
  const createTest = useCreateTest();
  const updateTest = useUpdateTest();
  const deleteTest = useDeleteTest();

  const filteredTests = tests?.filter(test =>
    test.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    test.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenDialog = (test?: Test) => {
    if (test) {
      setEditingTest(test);
      setFormData({
        title: test.title,
        description: test.description || '',
        category: test.category,
        duration_minutes: test.duration_minutes,
        total_marks: test.total_marks,
        is_active: test.is_active,
        questions: test.questions,
      });
    } else {
      setEditingTest(null);
      setFormData({
        title: '',
        description: '',
        category: '',
        duration_minutes: 30,
        total_marks: 100,
        is_active: true,
        questions: [],
      });
    }
    setIsDialogOpen(true);
  };

  const handleAddQuestion = () => {
    const newQuestion: Question = {
      id: crypto.randomUUID(),
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: '',
      points: 10,
    };
    setFormData({ ...formData, questions: [...formData.questions, newQuestion] });
  };

  const handleRemoveQuestion = (index: number) => {
    const newQuestions = formData.questions.filter((_, i) => i !== index);
    setFormData({ ...formData, questions: newQuestions });
  };

  const handleQuestionChange = (index: number, field: keyof Question, value: any) => {
    const newQuestions = [...formData.questions];
    newQuestions[index] = { ...newQuestions[index], [field]: value };
    setFormData({ ...formData, questions: newQuestions });
  };

  const handleOptionChange = (qIndex: number, oIndex: number, value: string) => {
    const newQuestions = [...formData.questions];
    newQuestions[qIndex].options[oIndex] = value;
    setFormData({ ...formData, questions: newQuestions });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingTest) {
      await updateTest.mutateAsync({ id: editingTest.id, ...formData });
    } else {
      await createTest.mutateAsync(formData);
    }
    
    setIsDialogOpen(false);
    setEditingTest(null);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this test?')) {
      await deleteTest.mutateAsync(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search tests..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="gradient" onClick={() => handleOpenDialog()}>
              <Plus className="w-4 h-4 mr-2" />
              Add Test
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingTest ? 'Edit Test' : 'Create New Test'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter test title"
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
                  placeholder="Enter test description"
                  rows={2}
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={formData.duration_minutes}
                    onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) })}
                    min={1}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="marks">Total Marks</Label>
                  <Input
                    id="marks"
                    type="number"
                    value={formData.total_marks}
                    onChange={(e) => setFormData({ ...formData, total_marks: parseInt(e.target.value) })}
                    min={1}
                  />
                </div>
                <div className="flex items-center gap-3 pt-6">
                  <Switch
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  />
                  <Label>Active</Label>
                </div>
              </div>

              {/* Questions */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-lg">Questions ({formData.questions.length})</Label>
                  <Button type="button" variant="outline" size="sm" onClick={handleAddQuestion}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Question
                  </Button>
                </div>

                {formData.questions.map((question, qIndex) => (
                  <div key={question.id} className="p-4 rounded-xl border border-border bg-secondary/20 space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <Label>Question {qIndex + 1}</Label>
                        <Input
                          value={question.question}
                          onChange={(e) => handleQuestionChange(qIndex, 'question', e.target.value)}
                          placeholder="Enter question"
                          required
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-destructive shrink-0"
                        onClick={() => handleRemoveQuestion(qIndex)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-3">
                      {question.options.map((option, oIndex) => (
                        <div key={oIndex} className="flex items-center gap-2">
                          <input
                            type="radio"
                            name={`correct-${question.id}`}
                            checked={question.correctAnswer === oIndex}
                            onChange={() => handleQuestionChange(qIndex, 'correctAnswer', oIndex)}
                            className="w-4 h-4"
                          />
                          <Input
                            value={option}
                            onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                            placeholder={`Option ${String.fromCharCode(65 + oIndex)}`}
                            required
                          />
                        </div>
                      ))}
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Explanation</Label>
                        <Textarea
                          value={question.explanation}
                          onChange={(e) => handleQuestionChange(qIndex, 'explanation', e.target.value)}
                          placeholder="Explain the correct answer"
                          rows={2}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Points</Label>
                        <Input
                          type="number"
                          value={question.points}
                          onChange={(e) => handleQuestionChange(qIndex, 'points', parseInt(e.target.value))}
                          min={1}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="gradient" disabled={createTest.isPending || updateTest.isPending}>
                  {editingTest ? 'Update' : 'Create'} Test
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tests Table */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary/50">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Test</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Category</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Questions</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-right px-6 py-4 text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                    Loading tests...
                  </td>
                </tr>
              ) : filteredTests && filteredTests.length > 0 ? (
                filteredTests.map((test) => (
                  <motion.tr
                    key={test.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-secondary/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                          <ClipboardList className="w-5 h-5 text-accent" />
                        </div>
                        <div>
                          <p className="font-medium text-card-foreground line-clamp-1">{test.title}</p>
                          <p className="text-sm text-muted-foreground">{test.duration_minutes} mins • {test.total_marks} marks</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="secondary">{test.category}</Badge>
                    </td>
                    <td className="px-6 py-4 text-card-foreground">
                      {test.questions.length}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={test.is_active ? 'default' : 'secondary'}>
                        {test.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(test)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-destructive"
                          onClick={() => handleDelete(test.id)}
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
                    No tests found. Create your first test!
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

export default AdminTests;
