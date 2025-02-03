/*
  # Update RLS Policies for Anonymous Access

  1. Changes
    - Enable anonymous access to the geotranote_reports table
    - Allow anonymous users to insert and read data
  
  2. Security
    - Modify RLS policies to allow anon access
    - Keep existing authenticated user access
*/

-- Update policies to allow anonymous access
DO $$ 
BEGIN
    -- Drop existing policies
    DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON geotranote_reports;
    DROP POLICY IF EXISTS "Enable read access for authenticated users" ON geotranote_reports;
    
    -- Create new policies that allow both authenticated and anonymous access
    CREATE POLICY "Enable insert access for all users"
        ON geotranote_reports
        FOR INSERT
        TO anon, authenticated
        WITH CHECK (true);

    CREATE POLICY "Enable read access for all users"
        ON geotranote_reports
        FOR SELECT
        TO anon, authenticated
        USING (true);
END $$;