import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName: string, role: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUp = async (email: string, password: string, fullName: string, role: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    // If signup was successful and we have a user, update their profile
    if (!error && data.user) {
      try {
        // Map the role to the correct user_type enum value
        let userType: 'student' | 'parent' | 'staff' | 'mentor' = 'parent';
        if (role === 'student') userType = 'student';
        else if (role === 'teacher') userType = 'mentor';
        else if (role === 'admin') userType = 'staff';

        // Split full name into first and last name
        const nameParts = fullName.trim().split(' ');
        const firstName = nameParts[0] || null;
        const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : null;

        // Update the user's profile in user_profiles table
        const { error: profileError } = await supabase
          .from('user_profiles')
          .update({
            first_name: firstName,
            last_name: lastName,
            user_type: userType,
          })
          .eq('id', data.user.id);

        if (profileError) {
          console.error('Error updating user profile:', profileError);
          return { error: profileError };
        }

        // If the user is registering as a student, create appropriate profile records
        if (role === 'student') {
          // Create student profile
          const { error: studentProfileError } = await supabase
            .from('student_profiles')
            .insert([{
              user_id: data.user.id,
              parent_id: data.user.id, // Set parent_id to their own ID for self-registered students
              learning_goals: null,
            }]);

          if (studentProfileError) {
            console.error('Error creating student profile:', studentProfileError);
            // Don't return error here as the main profile was created successfully
          }

          // Create student record in the students table
          const { error: studentError } = await supabase
            .from('students')
            .insert([{
              parent_id: data.user.id, // Set parent_id to their own ID for self-registered students
              full_name: fullName,
              grade_level: 'Ikke oppgitt', // Default value since not collected during signup
              current_level: 'ungdomsskole', // Default level
              plan_type: 'free', // Default plan
              goals: null,
              notes: 'Selvregistrert elev' // Note to indicate this is a self-registered student
            }]);

          if (studentError) {
            console.error('Error creating student record:', studentError);
            // Don't return error here as the profile was created successfully
          }
        }

        // If the user is registering as a teacher/mentor, create staff profile
        if (role === 'teacher') {
          const { error: staffError } = await supabase
            .from('staff_profiles')
            .insert([{
              user_id: data.user.id,
              role: 'mentor',
              qualifications: null,
              subjects_taught: [],
            }]);

          if (staffError) {
            console.error('Error creating staff profile:', staffError);
            // Don't return error here as the main profile was created successfully
          }
        }
      } catch (profileUpdateError) {
        console.error('Error in profile update:', profileUpdateError);
        return { error: profileUpdateError };
      }
    }

    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};