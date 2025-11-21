-- Drop admin-only policy on threat_intel
DROP POLICY IF EXISTS "Only admins can view threat intel" ON public.threat_intel;

-- Allow everyone to view threat intel data
CREATE POLICY "Everyone can view threat intel"
ON public.threat_intel
FOR SELECT
TO public
USING (true);

-- Keep admin-only INSERT policy
-- (The existing "Only admins can insert threat intel" policy remains unchanged)