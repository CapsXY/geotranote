/*
  # Create Geotranote Reports Table

  1. New Tables
    - `geotranote_reports`
      - `id` (uuid, primary key)
      - `created_at` (timestamp with timezone)
      - `responsibleName` (text)
      - `serviceName` (text)
      - `sector` (text)
      - `infractionType` (text)
      - `quantity` (integer)
      - `otherInfractions` (text)
      - `carRemovals` (integer)
      - `motorcycleRemovals` (integer)

  2. Security
    - Enable RLS on `geotranote_reports` table
    - Add policies for:
      - Insert: Allow authenticated users to insert reports
      - Select: Allow authenticated users to read all reports
*/

-- Create the reports table
CREATE TABLE IF NOT EXISTS geotranote_reports (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamptz DEFAULT now(),
    responsibleName text NOT NULL,
    serviceName text NOT NULL,
    sector text NOT NULL,
    infractionType text,
    quantity integer DEFAULT 0,
    otherInfractions text,
    carRemovals integer DEFAULT 0,
    motorcycleRemovals integer DEFAULT 0
);

-- Enable Row Level Security
ALTER TABLE geotranote_reports ENABLE ROW LEVEL SECURITY;

-- Create policies
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