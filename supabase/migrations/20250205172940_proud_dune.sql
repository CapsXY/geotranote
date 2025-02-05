/*
  # Update sector constraint

  1. Changes
    - Update the check constraint for the sector column to include all valid values
*/

DO $$
BEGIN
  -- Drop existing check constraint if it exists
  IF EXISTS (
    SELECT 1
    FROM information_schema.constraint_column_usage
    WHERE table_name = 'geotranote_reports'
    AND constraint_name = 'geotranote_reports_sector_check'
  ) THEN
    ALTER TABLE geotranote_reports DROP CONSTRAINT geotranote_reports_sector_check;
  END IF;

  -- Add new check constraint with updated values
  ALTER TABLE geotranote_reports
  ADD CONSTRAINT geotranote_reports_sector_check
  CHECK (sector IN (
    'GEOTRAN - 1º Distrito',
    'GEOTRAN - 2º Distrito',
    'GEOTRAN - 3º/4º Distrito',
    '1º Distrito',
    '2º Distrito',
    '3º Distrito',
    '4º Distrito',
    'GEDAM',
    'GRE',
    'GMAP',
    'ROMU',
    'RAS',
    'Operação'
  ));
END $$;