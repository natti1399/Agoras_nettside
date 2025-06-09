/*
  # Create missing tables and policies

  1. New Tables
    - `students`
      - `id` (uuid, primary key)
      - `parent_id` (uuid, foreign key to user_profiles)
      - `full_name` (text)
      - `grade_level` (text)
      - `current_level` (enum)
      - `plan_type` (enum)
      - `goals` (text, nullable)
      - `notes` (text, nullable)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `bookings`
      - `id` (uuid, primary key)
      - `student_id` (uuid, foreign key to students)
      - `teacher_id` (uuid, foreign key to user_profiles, nullable)
      - `booking_type` (enum)
      - `scheduled_date` (timestamp)
      - `duration_minutes` (integer)
      - `status` (enum)
      - `notes` (text, nullable)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for students (parents, students, admins)
    - Add policies for bookings (parents, students, teachers, admins)
*/

-- Create students table if it doesn't exist
CREATE TABLE IF NOT EXISTS students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  grade_level text NOT NULL,
  current_level text DEFAULT 'ungdomsskole' CHECK (current_level IN ('ungdomsskole', 'videregående', 'r1-r2')),
  plan_type text DEFAULT 'free' CHECK (plan_type IN ('free', 'standard', 'pluss', 'premium')),
  goals text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create bookings table if it doesn't exist
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES students(id) ON DELETE CASCADE,
  teacher_id uuid REFERENCES user_profiles(id) ON DELETE SET NULL,
  booking_type text DEFAULT 'consultation' CHECK (booking_type IN ('consultation', 'lesson', 'assessment')),
  scheduled_date timestamptz NOT NULL,
  duration_minutes integer DEFAULT 30,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on students table
ALTER TABLE students ENABLE ROW LEVEL SECURITY;

-- Enable RLS on bookings table
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Add updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'handle_updated_at' 
    AND tgrelid = 'students'::regclass
  ) THEN
    CREATE TRIGGER handle_updated_at
      BEFORE UPDATE ON students
      FOR EACH ROW
      EXECUTE FUNCTION handle_updated_at();
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'handle_updated_at' 
    AND tgrelid = 'bookings'::regclass
  ) THEN
    CREATE TRIGGER handle_updated_at
      BEFORE UPDATE ON bookings
      FOR EACH ROW
      EXECUTE FUNCTION handle_updated_at();
  END IF;
END $$;

-- Students table policies

-- Policy for parents to insert students (they can only add students where they are the parent)
CREATE POLICY "Parents can insert their own students"
  ON students
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = parent_id);

-- Policy for parents to read their own students
CREATE POLICY "Parents can read their own students"
  ON students
  FOR SELECT
  TO authenticated
  USING (auth.uid() = parent_id);

-- Policy for parents to update their own students
CREATE POLICY "Parents can update their own students"
  ON students
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = parent_id)
  WITH CHECK (auth.uid() = parent_id);

-- Policy for students to read their own record (when they are the student themselves)
CREATE POLICY "Students can read their own record"
  ON students
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Policy for admins to manage all students
CREATE POLICY "Admins can manage all students"
  ON students
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.user_type = 'staff'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.user_type = 'staff'
    )
  );

-- Policy for teachers/mentors to read students they teach
CREATE POLICY "Teachers can read their students"
  ON students
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.user_type IN ('staff', 'mentor')
    )
  );

-- Bookings table policies

-- Policy for parents to manage bookings for their students
CREATE POLICY "Parents can manage their students bookings"
  ON bookings
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM students
      WHERE students.id = bookings.student_id
      AND students.parent_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM students
      WHERE students.id = bookings.student_id
      AND students.parent_id = auth.uid()
    )
  );

-- Policy for students to read their own bookings
CREATE POLICY "Students can read their own bookings"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (student_id = auth.uid());

-- Policy for teachers to manage bookings assigned to them
CREATE POLICY "Teachers can manage their assigned bookings"
  ON bookings
  FOR ALL
  TO authenticated
  USING (teacher_id = auth.uid())
  WITH CHECK (teacher_id = auth.uid());

-- Policy for admins to manage all bookings
CREATE POLICY "Admins can manage all bookings"
  ON bookings
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.user_type = 'staff'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.user_type = 'staff'
    )
  );

-- Policy for teachers/mentors to read all bookings (for scheduling purposes)
CREATE POLICY "Teachers can read all bookings"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.user_type IN ('staff', 'mentor')
    )
  );