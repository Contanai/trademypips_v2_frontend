-- Ensure system_logs is writable/readable by authenticated users for their own rows.
-- This migration is idempotent and safe to run multiple times.

ALTER TABLE IF EXISTS public.system_logs
  ADD COLUMN IF NOT EXISTS user_id uuid;

ALTER TABLE IF EXISTS public.system_logs
  ADD COLUMN IF NOT EXISTS level text DEFAULT 'info';

ALTER TABLE IF EXISTS public.system_logs
  ADD COLUMN IF NOT EXISTS category text DEFAULT 'system';

ALTER TABLE IF EXISTS public.system_logs
  ADD COLUMN IF NOT EXISTS event_type text DEFAULT 'user_action';

ALTER TABLE IF EXISTS public.system_logs
  ADD COLUMN IF NOT EXISTS source text DEFAULT 'platform';

ALTER TABLE IF EXISTS public.system_logs
  ADD COLUMN IF NOT EXISTS metadata jsonb DEFAULT '{}'::jsonb;

ALTER TABLE IF EXISTS public.system_logs
  ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now();

ALTER TABLE IF EXISTS public.system_logs
  ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "system_logs_select_own" ON public.system_logs;
DROP POLICY IF EXISTS "system_logs_insert_own" ON public.system_logs;

CREATE POLICY "system_logs_select_own"
  ON public.system_logs
  FOR SELECT
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

CREATE POLICY "system_logs_insert_own"
  ON public.system_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));
