import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string;
          email: string;
          first_name: string | null;
          last_name: string | null;
          phone: string | null;
          user_type: 'student' | 'parent' | 'staff' | 'mentor';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          first_name?: string | null;
          last_name?: string | null;
          phone?: string | null;
          user_type?: 'student' | 'parent' | 'staff' | 'mentor';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          first_name?: string | null;
          last_name?: string | null;
          phone?: string | null;
          user_type?: 'student' | 'parent' | 'staff' | 'mentor';
          created_at?: string;
          updated_at?: string;
        };
      };
      student_profiles: {
        Row: {
          id: string;
          user_id: string | null;
          grade_level: string | null;
          school: string | null;
          subjects_of_interest: string[] | null;
          learning_goals: string | null;
          parent_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          grade_level?: string | null;
          school?: string | null;
          subjects_of_interest?: string[] | null;
          learning_goals?: string | null;
          parent_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          grade_level?: string | null;
          school?: string | null;
          subjects_of_interest?: string[] | null;
          learning_goals?: string | null;
          parent_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      staff_profiles: {
        Row: {
          id: string;
          user_id: string | null;
          role: string;
          qualifications: string | null;
          subjects_taught: string[] | null;
          hire_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          role?: string;
          qualifications?: string | null;
          subjects_taught?: string[] | null;
          hire_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          role?: string;
          qualifications?: string | null;
          subjects_taught?: string[] | null;
          hire_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      students: {
        Row: {
          id: string;
          parent_id: string | null;
          full_name: string;
          grade_level: string;
          current_level: 'ungdomsskole' | 'videregående' | 'r1-r2';
          plan_type: 'free' | 'standard' | 'pluss' | 'premium';
          goals: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          parent_id?: string | null;
          full_name: string;
          grade_level: string;
          current_level?: 'ungdomsskole' | 'videregående' | 'r1-r2';
          plan_type?: 'free' | 'standard' | 'pluss' | 'premium';
          goals?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          parent_id?: string | null;
          full_name?: string;
          grade_level?: string;
          current_level?: 'ungdomsskole' | 'videregående' | 'r1-r2';
          plan_type?: 'free' | 'standard' | 'pluss' | 'premium';
          goals?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      bookings: {
        Row: {
          id: string;
          student_id: string | null;
          teacher_id: string | null;
          booking_type: 'consultation' | 'lesson' | 'assessment';
          scheduled_date: string;
          duration_minutes: number;
          status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          student_id?: string | null;
          teacher_id?: string | null;
          booking_type?: 'consultation' | 'lesson' | 'assessment';
          scheduled_date: string;
          duration_minutes?: number;
          status?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string | null;
          teacher_id?: string | null;
          booking_type?: 'consultation' | 'lesson' | 'assessment';
          scheduled_date?: string;
          duration_minutes?: number;
          status?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};