/*
  # Add plan_type column to profiles table

  1. Changes
    - Add `plan_type` column to `profiles` table with default value 'free'
    - Update existing records to have 'free' as default plan type
    - Add check constraint to ensure valid plan types

  2. Security
    - No changes to RLS policies needed as this is just adding a column
*/

-- Add plan_type column to profiles table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'plan_type'
  ) THEN
    ALTER TABLE profiles ADD COLUMN plan_type text DEFAULT 'free' CHECK (plan_type IN ('free', 'standard', 'pluss', 'premium'));
  END IF;
END $$;

-- Update existing records to have 'free' as default plan type
UPDATE profiles SET plan_type = 'free' WHERE plan_type IS NULL;

-- Make plan_type NOT NULL after setting defaults
ALTER TABLE profiles ALTER COLUMN plan_type SET NOT NULL;