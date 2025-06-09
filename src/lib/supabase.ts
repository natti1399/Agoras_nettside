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
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          phone: string | null;
          role: 'parent' | 'student' | 'teacher' | 'admin';
          plan_type: 'free' | 'standard' | 'pluss' | 'premium';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          phone?: string | null;
          role?: 'parent' | 'student' | 'teacher' | 'admin';
          plan_type?: 'free' | 'standard' | 'pluss' | 'premium';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          phone?: string | null;
          role?: 'parent' | 'student' | 'teacher' | 'admin';
          plan_type?: 'free' | 'standard' | 'pluss' | 'premium';
          created_at?: string;
          updated_at?: string;
        };
      };
      students: {
        Row: {
          id: string;
          parent_id: string;
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
          parent_id: string;
          full_name: string;
          grade_level: string;
          current_level: 'ungdomsskole' | 'videregående' | 'r1-r2';
          plan_type?: 'free' | 'standard' | 'pluss' | 'premium';
          goals?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          parent_id?: string;
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
          student_id: string;
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
          student_id: string;
          teacher_id?: string | null;
          booking_type: 'consultation' | 'lesson' | 'assessment';
          scheduled_date: string;
          duration_minutes?: number;
          status?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string;
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