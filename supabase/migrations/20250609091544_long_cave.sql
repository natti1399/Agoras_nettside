/*
  # Add RLS policies for students table

  1. Security
    - Add policy for parents to insert students where they are the parent
    - Add policy for parents to read their own students
    - Add policy for parents to update their own students
    - Add policy for students to read their own record
    - Add policy for admins to manage all students

  This migration fixes the RLS violation error when parents try to add students.
*/

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
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );