
import { supabase } from '@/integrations/supabase/client';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher';
  profile_picture?: string;
  bio?: string;
  created_at: string;
  updated_at: string;
}

export interface Course {
  id: string;
  title: string;
  description?: string;
  author: string;
  author_id: string;
  file_count: number;
  file_types: string[];
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }

  // Ensure role is properly typed
  return {
    ...data,
    role: (data.role as 'student' | 'teacher') || 'student'
  };
};

export const updateUserProfile = async (userId: string, updates: Partial<UserProfile>) => {
  const { error } = await supabase
    .from('profiles')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', userId);

  if (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};

export const getPublicCourses = async (): Promise<Course[]> => {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .eq('is_public', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching courses:', error);
    return [];
  }

  return data || [];
};

export const createCourse = async (courseData: {
  title: string;
  description?: string;
  author: string;
  author_id: string;
  file_count: number;
  file_types: string[];
}) => {
  const { data, error } = await supabase
    .from('courses')
    .insert([courseData])
    .select()
    .single();

  if (error) {
    console.error('Error creating course:', error);
    throw error;
  }

  return data;
};

export const getUserCourses = async (userId: string): Promise<Course[]> => {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .eq('author_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching user courses:', error);
    return [];
  }

  return data || [];
};
