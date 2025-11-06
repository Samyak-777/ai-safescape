-- Fix PUBLIC_THREAT_INTEL_DATA: Restrict threat_intel table access to authenticated users only

-- Drop the public SELECT policy
DROP POLICY IF EXISTS "Threat intel is viewable by everyone" ON public.threat_intel;

-- Create authenticated-only SELECT policy
CREATE POLICY "Authenticated users can view threat intel"
ON public.threat_intel
FOR SELECT
TO authenticated
USING (true);

-- Update INSERT policy to be more restrictive
DROP POLICY IF EXISTS "Authenticated users can report threats" ON public.threat_intel;

CREATE POLICY "Authenticated users can insert threats"
ON public.threat_intel
FOR INSERT
TO authenticated
WITH CHECK (true);