-- Auth audit log: append-only record of significant auth events
CREATE TABLE IF NOT EXISTS public.auth_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  email text,
  event_type text NOT NULL,
  ip_address text,
  user_agent text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_auth_audit_user ON public.auth_audit_log(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_auth_audit_email ON public.auth_audit_log(lower(email), created_at DESC);

ALTER TABLE public.auth_audit_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own audit log" ON public.auth_audit_log
  FOR SELECT TO authenticated USING (user_id = auth.uid());

-- Login attempt tracking for account lockout
CREATE TABLE IF NOT EXISTS public.auth_login_attempts (
  email text PRIMARY KEY,
  failed_count int NOT NULL DEFAULT 0,
  first_failed_at timestamptz,
  locked_until timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.auth_login_attempts ENABLE ROW LEVEL SECURITY;
-- No client policies — only server (service role) writes/reads.

-- Known devices for new-device alerts
CREATE TABLE IF NOT EXISTS public.auth_known_devices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  device_hash text NOT NULL,
  user_agent text,
  first_seen_at timestamptz NOT NULL DEFAULT now(),
  last_seen_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, device_hash)
);
ALTER TABLE public.auth_known_devices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own devices" ON public.auth_known_devices
  FOR SELECT TO authenticated USING (user_id = auth.uid());