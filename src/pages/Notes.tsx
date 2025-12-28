import { useNavigate, useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, ChevronRight, BookOpen, Clock, Lock, ArrowRight,
  Search, ShoppingCart, Download, ChevronLeft, Calendar
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useNotes, useIsAdmin, useCoursesList, useUserPurchases, useBuyNote, Note } from '@/hooks/useAdmin';
import { useCourses } from '@/hooks/useCourses';
import { useAuth } from '@/contexts/AuthContext';
import { courseCategories } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';

const Notes = () => {
  const navigate = useNavigate();
  const { category: urlCategory } = useParams<{ category?: string }>();
  const { toast } = useToast();
  const { user } = useAuth();
  const { data: isAdmin } = useIsAdmin();
  const { enrolledCourses } = useCourses();
  const { data: allCourses } = useCoursesList();
  const { data: purchases } = useUserPurchases();
  const { mutate: buyNote } = useBuyNote();

  // Notes listing state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  // Get current category info if in category view
  const categoryInfo = urlCategory ? courseCategories.find(c => c.slug === urlCategory) : null;
  const categoryName = categoryInfo?.name || '';

  // Fetch notes - if categoryInfo exists, fetch for that category, else fetch all
  const { data: notes, isLoading } = useNotes(categoryName || undefined);

  const checkAccess = (note: Note) => {
    if (!user) return false;
    if (isAdmin) return true;

    const price = note.price ?? 0;
    if (price === 0) return true;

    // Check if individual note is purchased
    const isNotePurchased = purchases?.some(p => p.note_id === note.id);
    if (isNotePurchased) return true;

    // Check if course in the same category is purchased
    const isCategoryPurchased = enrolledCourses?.some(ec => {
      const courseDetails = allCourses?.find(c => c.id === ec.course_id);
      return courseDetails?.category === note.category;
    });

    if (isCategoryPurchased) return true;

    return false;
  };

  const handleBuyNote = (note: Note) => {
    if (!user) {
      toast({
        title: 'Please sign in',
        description: 'You need to be logged in to purchase notes',
        variant: 'destructive',
      });
      navigate('/login');
      return;
    }
    buyNote(note.id);
  };

  const filteredNotes = notes?.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Grouping logic for the main grid (when no category is selected)
  const notesByCategory = courseCategories.map(category => ({
    ...category,
    notes: notes?.filter(note => note.category === category.name) || [],
  }));

  // If a category slug is provided but not found
  if (urlCategory && !categoryInfo) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Category Not Found</h1>
          <Button onClick={() => navigate('/notes')}>Go Back to Notes</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 pt-20 pb-16">
        <AnimatePresence mode="wait">
          {!urlCategory ? (
            /* Main Categories Grid View */
            <motion.div
              key="categories"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Hero Section */}
              <section className="py-12 bg-gradient-to-br from-primary/10 via-background to-accent/10">
                <div className="container mx-auto px-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center max-w-3xl mx-auto"
                  >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
                      <FileText className="w-5 h-5" />
                      <span className="font-medium">Study Material</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
                      Explore <span className="text-primary">Notes</span>
                    </h1>
                    <p className="text-lg text-muted-foreground">
                      Get access to high-quality notes category-wise to excel in your studies
                    </p>
                  </motion.div>
                </div>
              </section>

              {/* Grid */}
              <section className="py-12">
                <div className="container mx-auto px-4">
                  {isLoading ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="h-64 bg-secondary/50 rounded-2xl animate-pulse" />
                      ))}
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {notesByCategory.map((category, index) => {
                        const hasCatAccess = enrolledCourses?.some(ec => {
                          const courseDetails = allCourses?.find(c => c.id === ec.course_id);
                          return courseDetails?.category === category.name;
                        }) || isAdmin;

                        return (
                          <motion.div
                            key={category.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <Card
                              className="group hover:shadow-xl transition-all duration-300 border-border hover:border-primary/50 h-full flex flex-col cursor-pointer"
                              onClick={() => navigate(`/notes/${category.slug}`)}
                            >
                              <CardHeader>
                                <div className="flex items-start justify-between mb-4">
                                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${category.gradient} flex items-center justify-center text-2xl`}>
                                    {category.icon}
                                  </div>
                                  {!hasCatAccess && (
                                    <div className="p-2 rounded-full bg-secondary/80 text-muted-foreground backdrop-blur-sm">
                                      <Lock className="w-5 h-5" />
                                    </div>
                                  )}
                                </div>
                                <CardTitle className="text-xl group-hover:text-primary transition-colors">
                                  {category.name}
                                </CardTitle>
                                <CardDescription>{category.description}</CardDescription>
                              </CardHeader>
                              <CardContent className="flex-1 flex flex-col justify-end">
                                <div className="flex items-center justify-between mb-4">
                                  <Badge variant="secondary">
                                    {category.notes.length} {category.notes.length === 1 ? 'Note' : 'Notes'} Available
                                  </Badge>
                                </div>
                                <Button
                                  variant={hasCatAccess ? "gradient" : "outline"}
                                  className="w-full group/btn"
                                >
                                  {hasCatAccess ? 'View Notes' : 'Enroll to Unlock'}
                                  {hasCatAccess ? (
                                    <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                                  ) : (
                                    <Lock className="w-4 h-4 ml-2" />
                                  )}
                                </Button>
                              </CardContent>
                            </Card>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </section>
            </motion.div>
          ) : !selectedNote ? (
            /* Category-Specific Notes List View */
            <motion.div
              key="notes-list"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              {/* Hero for Category */}
              <section className="py-12 bg-gradient-to-br from-primary/10 via-background to-accent/10">
                <div className="container mx-auto px-4">
                  <Button variant="ghost" onClick={() => navigate('/notes')} className="mb-4">
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Back to All Notes
                  </Button>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-3xl"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-4xl">{categoryInfo?.icon}</span>
                      <h1 className="text-4xl font-heading font-bold text-foreground">
                        {categoryInfo?.name} <span className="text-primary">Notes</span>
                      </h1>
                    </div>
                    <p className="text-lg text-muted-foreground">{categoryInfo?.description}</p>
                  </motion.div>
                </div>
              </section>

              <section className="py-8 border-b border-border">
                <div className="container mx-auto px-4">
                  <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      placeholder="Search notes in this category..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </section>

              <section className="py-12">
                <div className="container mx-auto px-4">
                  {isLoading ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="h-48 bg-secondary/50 rounded-2xl animate-pulse" />
                      ))}
                    </div>
                  ) : filteredNotes && filteredNotes.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredNotes.map((note, index) => (
                        <motion.div
                          key={note.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Card className="glass-card hover-lift transition-all duration-500 border-primary/5 h-full flex flex-col group relative overflow-visible">
                            <div className="absolute -top-3 -left-2 z-10 px-3 py-1 rounded-full shadow-lg bg-gradient-to-r from-primary to-accent text-white text-[10px] font-bold tracking-wider uppercase">
                              {note.category}
                            </div>
                            <CardHeader className="pt-8">
                              <div className="flex items-center justify-between mb-2">
                                <span className="flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground bg-secondary/30 px-2 py-0.5 rounded-full">
                                  <Calendar className="w-3 h-3" />
                                  {new Date(note.created_at).toLocaleDateString()}
                                </span>
                              </div>
                              <CardTitle className="text-xl font-heading font-bold group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                                {note.title}
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="flex-1 flex flex-col px-6">
                              <p className="text-muted-foreground text-sm line-clamp-3 mb-6 flex-1 italic opacity-80 group-hover:opacity-100 transition-opacity">
                                "{note.content}"
                              </p>
                              <div className="flex items-center justify-between pt-6 border-t border-primary/5">
                                {checkAccess(note) ? (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="w-full group/btn justify-between hover:bg-primary hover:text-white transition-all duration-300 text-primary font-semibold rounded-xl"
                                    onClick={() => setSelectedNote(note)}
                                  >
                                    <span>Dive Deep Into Content</span>
                                    <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                  </Button>
                                ) : (
                                  <div className="flex flex-col gap-4 w-full">
                                    <div className="flex items-center justify-between bg-primary/5 p-3 rounded-xl border border-primary/10">
                                      <div className="flex items-center gap-2 text-primary font-bold">
                                        <Lock className="w-4 h-4" />
                                        <span className="text-lg">₹{note.price || 0}</span>
                                      </div>
                                      <Button
                                        variant="gradient"
                                        size="sm"
                                        className="px-6 rounded-lg shadow-lg"
                                        onClick={() => handleBuyNote(note)}
                                      >
                                        <ShoppingCart className="w-4 h-4 mr-2" />
                                        Own Now
                                      </Button>
                                    </div>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="w-full text-[11px] h-10 rounded-xl"
                                      onClick={() => navigate(`/courses/${urlCategory}`)}
                                    >
                                      <BookOpen className="w-3.5 h-3.5 mr-2" />
                                      Get All-Access Pass
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <BookOpen className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-xl font-semibold text-foreground mb-2">No Notes Found</h3>
                      <p className="text-muted-foreground">Try adjusting your search or check back later.</p>
                    </div>
                  )}
                </div>
              </section>
            </motion.div>
          ) : (
            /* Note Detail View */
            <motion.div
              key="note-detail"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="container mx-auto px-4 py-8 max-w-4xl"
            >
              <Button
                variant="ghost"
                onClick={() => setSelectedNote(null)}
                className="mb-8 hover:bg-primary/5 group"
              >
                <ChevronLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to {categoryName}
              </Button>

              <Card className="border-border shadow-2xl bg-card overflow-hidden">
                <div className={`h-2 w-full bg-gradient-to-r ${categoryInfo?.gradient}`} />
                <CardHeader className="p-8 pb-4">
                  <div className="flex flex-wrap items-center gap-3 mb-6">
                    <Badge variant="secondary" className={`bg-gradient-to-r ${categoryInfo?.gradient} text-white border-none`}>
                      {selectedNote.category}
                    </Badge>
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground px-3 py-1 rounded-full bg-secondary/50">
                      <Calendar className="w-4 h-4" />
                      {new Date(selectedNote.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </div>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground leading-tight">
                    {selectedNote.title}
                  </h1>
                </CardHeader>
                <CardContent className="p-8 pt-0">
                  <div className="prose prose-slate dark:prose-invert max-w-none">
                    <div className="whitespace-pre-wrap text-foreground/90 text-lg leading-relaxed py-8 border-y border-border/50 my-8">
                      {selectedNote.content}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-4">
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      {selectedNote.file_url && (
                        <Button
                          className="w-full sm:w-auto px-8 h-12 text-base font-medium"
                          variant="gradient"
                          onClick={() => window.open(selectedNote.file_url!, '_blank')}
                        >
                          <Download className="w-5 h-5 mr-2" />
                          Download Study Material (PDF)
                        </Button>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      className="w-full sm:w-auto px-8 h-12"
                      onClick={() => setSelectedNote(null)}
                    >
                      Done Reading
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
};

export default Notes;
