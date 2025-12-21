import { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Search, Filter, FileText, ChevronRight } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNotes } from '@/hooks/useAdmin';
import { courseCategories } from '@/data/mockData';

const Notes = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const { data: notes, isLoading } = useNotes(selectedCategory || undefined);

  const filteredNotes = notes?.filter(note => 
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCategoryColor = (category: string) => {
    const cat = courseCategories.find(c => c.name === category);
    return cat?.gradient || 'from-primary to-primary/80';
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20 pb-16">
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
                <span className="font-medium">Study Notes</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
                Chemistry <span className="text-primary">Notes</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Access comprehensive notes organized by category to boost your learning
              </p>
            </motion.div>
          </div>
        </section>

        {/* Filters */}
        <section className="py-8 border-b border-border">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedCategory === '' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory('')}
                >
                  All
                </Button>
                {courseCategories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.name ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(category.name)}
                  >
                    {category.icon} {category.name}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Notes Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {isLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
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
                    <Card className="group hover:shadow-xl transition-all duration-300 border-border hover:border-primary/50 h-full">
                      <CardHeader>
                        <div className="flex items-start justify-between gap-2">
                          <Badge 
                            variant="secondary" 
                            className={`bg-gradient-to-r ${getCategoryColor(note.category)} text-white`}
                          >
                            {note.category}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(note.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-2">
                          {note.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                          {note.content}
                        </p>
                        <Button variant="ghost" size="sm" className="group/btn">
                          Read More
                          <ChevronRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <BookOpen className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">No Notes Found</h3>
                <p className="text-muted-foreground">
                  {searchQuery ? 'Try adjusting your search' : 'Notes will appear here once added by admin'}
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Notes;
