/*
      # Create Geotranote Reports Table with JSONB for Infractions

      1. New Tables
        - `geotranote_reports`
          - `id` (uuid, primary key)
          - `created_at` (timestamptz)
          - `responsible_name` (text)
          - `service_name` (text)
          - `sector` (text)
          - `other_infractions` (text)
          - `car_removals` (integer)
          - `motorcycle_removals` (integer)
        - `infractions`
          - `id` (uuid, primary key)
          - `report_id` (uuid, foreign key referencing geotranote_reports.id)
          - `infraction_type` (text)
          - `quantity` (integer)

      2. Security
        - Enable RLS on `geotranote_reports` table
        - Add policies for authenticated users to read and insert data
        - Enable RLS on `infractions` table
        - Add policies for authenticated users to read and insert data
    */

    -- Drop existing tables if they exist
    DROP TABLE IF EXISTS infractions;
    DROP TABLE IF EXISTS geotranote_reports;

    -- Create the reports table
    CREATE TABLE geotranote_reports (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        created_at timestamptz DEFAULT now(),
        responsible_name text NOT NULL,
        service_name text NOT NULL,
        sector text NOT NULL,
        other_infractions text,
        car_removals integer DEFAULT 0,
        motorcycle_removals integer DEFAULT 0
    );

    -- Enable Row Level Security for geotranote_reports
    ALTER TABLE geotranote_reports ENABLE ROW LEVEL SECURITY;

    -- Create policies for geotranote_reports
    DO $$ 
    BEGIN
        -- Drop existing policies if they exist
        DROP POLICY IF EXISTS "Enable insert access for authenticated users on geotranote_reports" ON geotranote_reports;
        DROP POLICY IF EXISTS "Enable read access for authenticated users on geotranote_reports" ON geotranote_reports;
        
        -- Create new policies
        CREATE POLICY "Enable insert access for authenticated users on geotranote_reports"
            ON geotranote_reports
            FOR INSERT
            TO authenticated
            WITH CHECK (true);

        CREATE POLICY "Enable read access for authenticated users on geotranote_reports"
            ON geotranote_reports
            FOR SELECT
            TO authenticated
            USING (true);
    END $$;

    -- Create the infractions table
    CREATE TABLE infractions (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        report_id uuid NOT NULL REFERENCES geotranote_reports(id) ON DELETE CASCADE,
        infraction_type text NOT NULL,
        quantity integer NOT NULL
    );

    -- Enable Row Level Security for infractions
    ALTER TABLE infractions ENABLE ROW LEVEL SECURITY;

    -- Create policies for infractions
    DO $$ 
    BEGIN
        -- Drop existing policies if they exist
        DROP POLICY IF EXISTS "Enable insert access for authenticated users on infractions" ON infractions;
        DROP POLICY IF EXISTS "Enable read access for authenticated users on infractions" ON infractions;
        
        -- Create new policies
        CREATE POLICY "Enable insert access for authenticated users on infractions"
            ON infractions
            FOR INSERT
            TO authenticated
            WITH CHECK (true);

        CREATE POLICY "Enable read access for authenticated users on infractions"
            ON infractions
            FOR SELECT
            TO authenticated
            USING (true);
    END $$;
