-- Add fee column to consultations table
ALTER TABLE consultations ADD COLUMN fee DOUBLE DEFAULT 0;
