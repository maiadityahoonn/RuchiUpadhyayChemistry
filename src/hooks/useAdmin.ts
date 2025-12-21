import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface Test {
  id: string;
  title: string;
  description: string | null;
  category: string;
  duration_minutes: number;
  total_marks: number;
  questions: {
    id: string;
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
    points: number;
  }[];
  is_active: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface Course {
  id: string;
  title: string;
  description: string | null;
  category: string;
  instructor: string;
  price: number;
  original_price: number | null;
  image_url: string | null;
  duration: string | null;
  lessons: number;
  level: string;
  xp_reward: number;
  is_active: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export const useIsAdmin = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['isAdmin', user?.id],
    queryFn: async () => {
      if (!user) return false;
      
      const { data, error } = await supabase
        .rpc('has_role', { _user_id: user.id, _role: 'admin' });
      
      if (error) {
        console.error('Error checking admin status:', error);
        return false;
      }
      
      return data ?? false;
    },
    enabled: !!user,
  });
};

export const useNotes = (category?: string) => {
  return useQuery({
    queryKey: ['notes', category],
    queryFn: async () => {
      let query = supabase.from('notes').select('*').order('created_at', { ascending: false });
      
      if (category) {
        query = query.eq('category', category);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as Note[];
    },
  });
};

export const useTests = (category?: string) => {
  return useQuery({
    queryKey: ['tests', category],
    queryFn: async () => {
      let query = supabase.from('tests').select('*').order('created_at', { ascending: false });
      
      if (category) {
        query = query.eq('category', category);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return (data as any[])?.map(test => ({
        ...test,
        questions: test.questions || []
      })) as Test[];
    },
  });
};

export const useCoursesList = (category?: string) => {
  return useQuery({
    queryKey: ['courses-db', category],
    queryFn: async () => {
      let query = supabase.from('courses').select('*').order('created_at', { ascending: false });
      
      if (category) {
        query = query.eq('category', category);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as Course[];
    },
  });
};

// Mutations for Notes
export const useCreateNote = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (note: Omit<Note, 'id' | 'created_at' | 'updated_at' | 'created_by'>) => {
      const { data, error } = await supabase
        .from('notes')
        .insert([{ ...note, created_by: user?.id }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      toast({ title: 'Note created successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Failed to create note', description: error.message, variant: 'destructive' });
    },
  });
};

export const useUpdateNote = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...note }: Partial<Note> & { id: string }) => {
      const { data, error } = await supabase
        .from('notes')
        .update(note)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      toast({ title: 'Note updated successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Failed to update note', description: error.message, variant: 'destructive' });
    },
  });
};

export const useDeleteNote = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('notes').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      toast({ title: 'Note deleted successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Failed to delete note', description: error.message, variant: 'destructive' });
    },
  });
};

// Mutations for Tests
export const useCreateTest = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (test: Omit<Test, 'id' | 'created_at' | 'updated_at' | 'created_by'>) => {
      const { data, error } = await supabase
        .from('tests')
        .insert([{ ...test, created_by: user?.id }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tests'] });
      toast({ title: 'Test created successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Failed to create test', description: error.message, variant: 'destructive' });
    },
  });
};

export const useUpdateTest = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...test }: Partial<Test> & { id: string }) => {
      const { data, error } = await supabase
        .from('tests')
        .update(test)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tests'] });
      toast({ title: 'Test updated successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Failed to update test', description: error.message, variant: 'destructive' });
    },
  });
};

export const useDeleteTest = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('tests').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tests'] });
      toast({ title: 'Test deleted successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Failed to delete test', description: error.message, variant: 'destructive' });
    },
  });
};

// Mutations for Courses
export const useCreateCourse = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (course: Omit<Course, 'id' | 'created_at' | 'updated_at' | 'created_by'>) => {
      const { data, error } = await supabase
        .from('courses')
        .insert([{ ...course, created_by: user?.id }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses-db'] });
      toast({ title: 'Course created successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Failed to create course', description: error.message, variant: 'destructive' });
    },
  });
};

export const useUpdateCourse = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...course }: Partial<Course> & { id: string }) => {
      const { data, error } = await supabase
        .from('courses')
        .update(course)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses-db'] });
      toast({ title: 'Course updated successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Failed to update course', description: error.message, variant: 'destructive' });
    },
  });
};

export const useDeleteCourse = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('courses').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses-db'] });
      toast({ title: 'Course deleted successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Failed to delete course', description: error.message, variant: 'destructive' });
    },
  });
};
