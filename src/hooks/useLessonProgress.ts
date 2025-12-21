import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useCourses } from './useCourses';

interface LessonProgress {
  id: string;
  user_id: string;
  course_id: string;
  lesson_index: number;
  section_index: number;
  completed_at: string;
}

export const useLessonProgress = (courseId: string, totalLessons: number) => {
  const [lessonProgress, setLessonProgress] = useState<LessonProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { updateProgress } = useCourses();

  const fetchProgress = async () => {
    if (!user || !courseId) {
      setLessonProgress([]);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('lesson_progress')
      .select('*')
      .eq('user_id', user.id)
      .eq('course_id', courseId);

    if (error) {
      console.error('Error fetching lesson progress:', error);
    } else {
      setLessonProgress(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProgress();
  }, [user, courseId]);

  const isLessonCompleted = (sectionIndex: number, lessonIndex: number): boolean => {
    return lessonProgress.some(
      p => p.section_index === sectionIndex && p.lesson_index === lessonIndex
    );
  };

  const toggleLessonComplete = async (sectionIndex: number, lessonIndex: number) => {
    if (!user) return;

    const isCompleted = isLessonCompleted(sectionIndex, lessonIndex);

    if (isCompleted) {
      // Remove completion
      const { error } = await supabase
        .from('lesson_progress')
        .delete()
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .eq('section_index', sectionIndex)
        .eq('lesson_index', lessonIndex);

      if (error) {
        console.error('Error removing lesson progress:', error);
        return;
      }
    } else {
      // Mark as complete
      const { error } = await supabase
        .from('lesson_progress')
        .insert({
          user_id: user.id,
          course_id: courseId,
          section_index: sectionIndex,
          lesson_index: lessonIndex,
        });

      if (error) {
        console.error('Error saving lesson progress:', error);
        return;
      }
    }

    // Refresh progress
    await fetchProgress();

    // Calculate and update overall course progress
    const newCompletedCount = isCompleted 
      ? lessonProgress.length - 1 
      : lessonProgress.length + 1;
    
    const newProgressPercent = Math.round((newCompletedCount / totalLessons) * 100);
    await updateProgress(courseId, Math.min(newProgressPercent, 100));
  };

  const completedCount = lessonProgress.length;
  const progressPercent = totalLessons > 0 
    ? Math.round((completedCount / totalLessons) * 100) 
    : 0;

  return {
    lessonProgress,
    loading,
    isLessonCompleted,
    toggleLessonComplete,
    completedCount,
    progressPercent,
    refetch: fetchProgress,
  };
};
