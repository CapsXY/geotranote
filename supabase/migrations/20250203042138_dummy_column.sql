-- Add a dummy column to trigger schema refresh
    ALTER TABLE geotranote_reports ADD COLUMN dummy_column text;
