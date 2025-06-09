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
        // Update the user's profile
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            full_name: fullName,
            role: role,
            plan_type: 'free', // Default plan for all new users
            updated_at: new Date().toISOString()
          })
          .eq('id', data.user.id);

        if (profileError) {
          console.error('Error updating profile:', profileError);
          return { error: profileError };
        }

        // If the user is registering as a student, also create a student record
        if (role === 'student') {
          const { error: studentError } = await supabase
            .from('students')
            .insert([{
              id: data.user.id, // Use the user's ID as the student ID
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
            // The student record can be created manually later if needed
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