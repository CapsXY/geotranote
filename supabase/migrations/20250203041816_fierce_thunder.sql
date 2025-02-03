/*
  # Create Geotranote Reports Table with Snake Case Columns

  1. New Tables
    - `geotranote_reports`
      - `id` (uuid, primary key)
      - `created_at` (timestamptz)
      - `responsible_name` (text)
      - `service_name` (text)
      - `sector` (text)
      - `infraction_type` (text)
      - `quantity` (integer)
      - `other_infractions` (text)
      - `car_removals` (integer)
      - `motorcycle_removals` (integer)
  
  2. Security
    - Enable RLS on `geotranote_reports` table
    - Add policies for authenticated users to read and insert data
*/

-- Drop existing table if it exists
DROP TABLE IF EXISTS geotranote_reports;

-- Create the reports table with snake_case column names
CREATE TABLE geotranote_reports (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamptz DEFAULT now(),
    responsible_name text NOT NULL,
    service_name text NOT NULL,
    sector text NOT NULL,
    infraction_type text,
    quantity integer DEFAULT 0,
    other_infractions text,
    car_removals integer DEFAULT 0,
    motorcycle_removals integer DEFAULT 0
);

-- Enable Row Level Security
ALTER TABLE geotranote_reports ENABLE ROW LEVEL SECURITY;

-- Create policies
DO $$ 
BEGIN
    -- Drop existing policies if they exist
    DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON geotranote_reports;
    DROP POLICY IF EXISTS "Enable read access for authenticated users" ON geotranote_reports;
    
    -- Create new policies
    CREATE POLICY "Enable insert access for authenticated users"
        ON geotranote_reports
        FOR INSERT
        TO authenticated
        WITH CHECK (true);

    CREATE POLICY "Enable read access for authenticated users"
        ON geotranote_reports
        FOR SELECT
        TO authenticated
        USING (true);
END $$;
