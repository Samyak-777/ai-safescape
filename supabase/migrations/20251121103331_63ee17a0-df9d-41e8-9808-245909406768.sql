-- Add threat_type column to threat_intel table
ALTER TABLE public.threat_intel 
ADD COLUMN IF NOT EXISTS threat_type TEXT;

-- Update existing records with a default value
UPDATE public.threat_intel 
SET threat_type = 'General Threat'
WHERE threat_type IS NULL;