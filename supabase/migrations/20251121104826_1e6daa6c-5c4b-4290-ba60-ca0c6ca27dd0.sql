-- Fix RLS Policies for Security Issues

-- 1. Restrict threat_intel SELECT to admins only
DROP POLICY IF EXISTS "Authenticated users can view threat intel" ON public.threat_intel;

CREATE POLICY "Only admins can view threat intel"
ON public.threat_intel FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- 2. Restrict threat_intel INSERT to admins only
DROP POLICY IF EXISTS "Authenticated users can insert threat intel" ON public.threat_intel;

CREATE POLICY "Only admins can insert threat intel"
ON public.threat_intel FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- 3. Restrict profiles SELECT to own profile or admins
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

CREATE POLICY "Users can view own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- 4. Restrict profiles UPDATE to own profile or admins
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id);

CREATE POLICY "Admins can update all profiles"
ON public.profiles FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- 5. Fix function search paths for security
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE OR REPLACE FUNCTION public.upsert_threat_intel(
  p_threat_type text,
  p_threat_category text,
  p_primary_domain text,
  p_description text,
  p_severity text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  existing_threat UUID;
BEGIN
  SELECT id INTO existing_threat
  FROM public.threat_intel
  WHERE primary_domain = p_primary_domain
    AND threat_category = p_threat_category
    AND last_seen_at > now() - INTERVAL '7 days'
  LIMIT 1;

  IF existing_threat IS NOT NULL THEN
    UPDATE public.threat_intel
    SET detection_count = detection_count + 1,
        last_seen_at = now()
    WHERE id = existing_threat;
  ELSE
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

-- 6. Fix feedback policies
DROP POLICY IF EXISTS "Anyone can insert feedback" ON public.feedback;
DROP POLICY IF EXISTS "Admins can view all feedback" ON public.feedback;
DROP POLICY IF EXISTS "Users can view own feedback" ON public.feedback;

CREATE POLICY "Authenticated users can insert feedback"
ON public.feedback FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can view own feedback"
ON public.feedback FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all feedback"
ON public.feedback FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);