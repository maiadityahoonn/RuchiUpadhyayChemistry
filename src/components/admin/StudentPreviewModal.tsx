import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Play, CheckCircle, Lock, Clock, ChevronDown, ChevronRight, X
} from 'lucide-react';
import { Course, Lesson } from '@/hooks/useAdmin';

interface StudentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: Course;
  lessons: Lesson[];
}

const StudentPreviewModal = ({ isOpen, onClose, course, lessons }: StudentPreviewModalProps) => {
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(lessons[0] || null);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['section-0']));

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const toggleComplete = (lessonId: string) => {
    const newCompleted = new Set(completedLessons);
    if (newCompleted.has(lessonId)) {
      newCompleted.delete(lessonId);
    } else {
      newCompleted.add(lessonId);
    }
    setCompletedLessons(newCompleted);
  };

  const progress = lessons.length > 0 
    ? Math.round((completedLessons.size / lessons.length) * 100) 
    : 0;

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-6xl h-[90vh] p-0 overflow-hidden">
        <div className="flex flex-col h-full">
          {/* Header */}
          <DialogHeader className="p-4 border-b border-border flex-shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <Badge variant="secondary" className="mb-2">Student Preview Mode</Badge>
                <DialogTitle className="text-xl">{course.title}</DialogTitle>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-5 h-5" />
              </Button>
            </div>
          </DialogHeader>

          <div className="flex flex-1 overflow-hidden">
            {/* Video Player Area */}
            <div className="flex-1 flex flex-col bg-background">
              {/* Video */}
              <div className="aspect-video bg-black flex-shrink-0">
                {selectedLesson?.youtube_video_id ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${selectedLesson.youtube_video_id}`}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <Play className="w-16 h-16 mx-auto mb-3 opacity-50" />
                      <p>No video available</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Lesson Info */}
              <div className="p-6 flex-1 overflow-auto">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">
                      {selectedLesson?.title || 'Select a lesson'}
                    </h2>
                    <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                      {selectedLesson?.duration && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {selectedLesson.duration}
                        </span>
                      )}
                      {selectedLesson?.is_free && (
                        <Badge variant="secondary">Free Preview</Badge>
                      )}
                    </div>
                  </div>
                  {selectedLesson && (
                    <Button 
                      variant={completedLessons.has(selectedLesson.id) ? "secondary" : "gradient"}
                      onClick={() => toggleComplete(selectedLesson.id)}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      {completedLessons.has(selectedLesson.id) ? 'Completed' : 'Mark Complete'}
                    </Button>
                  )}
                </div>
                {selectedLesson?.description && (
                  <p className="text-muted-foreground">{selectedLesson.description}</p>
                )}
              </div>
            </div>

            {/* Sidebar - Curriculum */}
            <div className="w-80 border-l border-border flex flex-col bg-card">
              {/* Progress */}
              <div className="p-4 border-b border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Course Progress</span>
                  <span className="text-sm text-muted-foreground">{progress}%</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Lessons List */}
              <ScrollArea className="flex-1">
                <div className="p-4">
                  <div className="space-y-1">
                    <button
                      className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-secondary/50 transition-colors"
                      onClick={() => toggleSection('section-0')}
                    >
                      <span className="font-medium text-sm">Course Content</span>
                      {expandedSections.has('section-0') ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </button>

                    {expandedSections.has('section-0') && (
                      <div className="space-y-1 pt-1">
                        {lessons.map((lesson, index) => {
                          const isCompleted = completedLessons.has(lesson.id);
                          const isSelected = selectedLesson?.id === lesson.id;
                          const isLocked = !lesson.is_free && index > 0;

                          return (
                            <button
                              key={lesson.id}
                              onClick={() => setSelectedLesson(lesson)}
                              className={`w-full flex items-start gap-3 p-3 rounded-lg text-left transition-colors ${
                                isSelected
                                  ? 'bg-primary/10 border border-primary/30'
                                  : 'hover:bg-secondary/50'
                              }`}
                            >
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                                isCompleted
                                  ? 'bg-success text-success-foreground'
                                  : isLocked
                                  ? 'bg-secondary text-muted-foreground'
                                  : 'bg-primary/10 text-primary'
                              }`}>
                                {isCompleted ? (
                                  <CheckCircle className="w-4 h-4" />
                                ) : isLocked ? (
                                  <Lock className="w-3 h-3" />
                                ) : (
                                  <Play className="w-3 h-3" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className={`text-sm font-medium truncate ${
                                  isSelected ? 'text-primary' : 'text-foreground'
                                }`}>
                                  {index + 1}. {lesson.title}
                                </p>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                  {lesson.duration || 'Duration not set'}
                                </p>
                              </div>
                              {lesson.is_free && (
                                <Badge variant="secondary" className="text-xs flex-shrink-0">
                                  Free
                                </Badge>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StudentPreviewModal;
