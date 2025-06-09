/*
  # Fix user signup trigger and ensure proper user profile creation

  1. Database Functions
    - Update handle_new_user function to properly create user profiles
    - Ensure trigger is properly configured

  2. Security
    - Maintain existing RLS policies
    - Ensure proper user profile creation workflow
*/

-- Create or replace the function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, user_type)
  VALUES (NEW.id, NEW.email, 'parent'::user_type_enum);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure the trigger exists and is properly configured
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();