-- Remove created_at column from threat_intel table
ALTER TABLE public.threat_intel DROP COLUMN IF EXISTS created_at;