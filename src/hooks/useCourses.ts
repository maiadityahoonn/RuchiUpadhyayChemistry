import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface EnrolledCourse {
  id: string;
  user_id: string;
  course_id: string;
  progress: number;
  enrolled_at: string;
  completed_at: string | null;
}

export const useCourses = () => {
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchEnrolledCourses = async () => {
    if (!user) {
      setEnrolledCourses([]);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('user_courses')
      .select('*')
      .eq('user_id', user.id)
      .order('enrolled_at', { ascending: false });

    if (error) {
      console.error('Error fetching enrolled courses:', error);
      return;
    }

    setEnrolledCourses(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchEnrolledCourses();
  }, [user]);

  const enrollInCourse = async (courseId: string) => {
    if (!user) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to enroll in courses.',
        variant: 'destructive',
      });
      return { success: false };
    }

    // Check if already enrolled
    const existingEnrollment = enrolledCourses.find(c => c.course_id === courseId);
    if (existingEnrollment) {
      toast({
        title: 'Already enrolled',
        description: 'You are already enrolled in this course.',
      });
      return { success: false };
    }

    const { error } = await supabase
      .from('user_courses')
      .insert({
        user_id: user.id,
        course_id: courseId,
        progress: 0,
      });

    if (error) {
      console.error('Error enrolling in course:', error);
      toast({
        title: 'Enrollment failed',
        description: error.message,
        variant: 'destructive',
      });
      return { success: false };
    }

    toast({
      title: 'Enrolled successfully!',
      description: 'You can now access this course.',
    });

    await fetchEnrolledCourses();
    return { success: true };
  };

  const updateProgress = async (courseId: string, progress: number) => {
    if (!user) return;

    const { error } = await supabase
      .from('user_courses')
      .update({ 
        progress,
        completed_at: progress >= 100 ? new Date().toISOString() : null,
      })
      .eq('user_id', user.id)
      .eq('course_id', courseId);

    if (error) {
      console.error('Error updating progress:', error);
      return;
    }

    await fetchEnrolledCourses();
  };

  const isEnrolled = (courseId: string) => {
    return enrolledCourses.some(c => c.course_id === courseId);
  };

  const getProgress = (courseId: string) => {
    const enrollment = enrolledCourses.find(c => c.course_id === courseId);
    return enrollment?.progress ?? 0;
  };

  return {
    enrolledCourses,
    loading,
    enrollInCourse,
    updateProgress,
    isEnrolled,
    getProgress,
    refetch: fetchEnrolledCourses,
  };
};
