-- Create threat intelligence table for community threat sharing
CREATE TABLE IF NOT EXISTS public.threat_intel (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  threat_type TEXT NOT NULL,
  threat_category TEXT NOT NULL,
  primary_domain TEXT,
  description TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'high',
  detection_count INTEGER NOT NULL DEFAULT 1,
  first_detected_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_seen_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.threat_intel ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read threat intelligence (public data)
CREATE POLICY "Threat intel is viewable by everyone" 
ON public.threat_intel 
FOR SELECT 
USING (true);

-- Allow authenticated users to insert threat intel
CREATE POLICY "Authenticated users can report threats" 
ON public.threat_intel 
FOR INSERT 
WITH CHECK (true);

-- Create index for faster queries
CREATE INDEX idx_threat_intel_last_seen ON public.threat_intel(last_seen_at DESC);
CREATE INDEX idx_threat_intel_category ON public.threat_intel(threat_category);

-- Create function to update or insert threat intel
CREATE OR REPLACE FUNCTION public.upsert_threat_intel(
  p_threat_type TEXT,
  p_threat_category TEXT,
  p_primary_domain TEXT,
  p_description TEXT,
  p_severity TEXT
)
RETURNS void AS $$
DECLARE
  existing_threat UUID;
BEGIN
  -- Check if similar threat exists (same domain and category within last 7 days)
  SELECT id INTO existing_threat
  FROM public.threat_intel
  WHERE primary_domain = p_primary_domain
    AND threat_category = p_threat_category
    AND last_seen_at > now() - INTERVAL '7 days'
  LIMIT 1;

  IF existing_threat IS NOT NULL THEN
    -- Update existing threat
    UPDATE public.threat_intel
    SET detection_count = detection_count + 1,
        last_seen_at = now()
    WHERE id = existing_threat;
  ELSE
    -- Insert new threat
    INSERT INTO public.threat_intel (
      threat_type,
      threat_category,
      primary_domain,
      description,
      severity
    ) VALUES (
      p_threat_type,
      p_threat_category,
      p_primary_domain,
      p_description,
      p_severity
    );
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;