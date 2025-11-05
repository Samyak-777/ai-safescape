-- Fix search path security warning for upsert_threat_intel function
CREATE OR REPLACE FUNCTION public.upsert_threat_intel(
  p_threat_type TEXT,
  p_threat_category TEXT,
  p_primary_domain TEXT,
  p_description TEXT,
  p_severity TEXT
)
RETURNS void 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;