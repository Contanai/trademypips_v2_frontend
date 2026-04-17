-- Trade copy / risk rules: platform defaults, per-user prefs, per-copy-group snapshot.
-- Apply via Supabase CLI (`supabase db push`) or SQL editor.

-- 1) Singleton platform defaults (seed once; do not overwrite on re-run)
CREATE TABLE IF NOT EXISTS public.platform_trade_settings_defaults (
  id integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  settings jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO public.platform_trade_settings_defaults (id, settings)
VALUES (
  1,
  $cfg$
  {
    "coreRiskEnabled": false,
    "riskMode": "proportional",
    "lotMultiplier": "",
    "minLot": "",
    "maxLot": "",
    "symbolFilterEnabled": false,
    "symbolFilterMode": "include",
    "symbols": "",
    "tradeType": "both",
    "maxSlippageEnabled": false,
    "maxSlippage": "",
    "maxSpreadEnabled": false,
    "maxSpread": "",
    "maxRiskPerTradeEnabled": false,
    "maxRiskPerTrade": "",
    "dailyDrawdownEnabled": false,
    "dailyDrawdown": "",
    "totalDrawdownEnabled": false,
    "totalDrawdown": "",
    "equityStopEnabled": false,
    "equityStop": "",
    "maxConcurrentTradesEnabled": false,
    "maxConcurrentTrades": "",
    "closeBehavior": "master_close",
    "reverseMasterEnabled": false
  }
  $cfg$::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- 2) User trading preferences: ensure table + copy_trade_settings column
CREATE TABLE IF NOT EXISTS public.user_trading_preferences (
  user_id uuid PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  default_lot_multiplier numeric(10, 4) DEFAULT 1,
  default_max_lot numeric(10, 4) DEFAULT 1,
  slippage_pips int DEFAULT 3,
  risk_mode text DEFAULT 'proportional' CHECK (risk_mode IN ('proportional', 'fixed')),
  copy_trade_settings jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.user_trading_preferences
  ADD COLUMN IF NOT EXISTS copy_trade_settings jsonb NOT NULL DEFAULT '{}'::jsonb;

-- 3) Backfill existing users: empty prefs → platform defaults
UPDATE public.user_trading_preferences utp
SET copy_trade_settings = d.settings,
    updated_at = now()
FROM public.platform_trade_settings_defaults d
WHERE d.id = 1
  AND (utp.copy_trade_settings IS NULL OR utp.copy_trade_settings = '{}'::jsonb);

INSERT INTO public.user_trading_preferences (user_id, copy_trade_settings, updated_at)
SELECT u.id, d.settings, now()
FROM auth.users u
CROSS JOIN public.platform_trade_settings_defaults d
WHERE d.id = 1
  AND NOT EXISTS (
    SELECT 1 FROM public.user_trading_preferences p WHERE p.user_id = u.id
  );

-- 4) Per copy-configuration snapshot (optional overrides for that master↔copier link)
ALTER TABLE public.copy_configurations
  ADD COLUMN IF NOT EXISTS trade_settings jsonb;

-- 5) RLS: platform defaults readable by any signed-in user
ALTER TABLE public.platform_trade_settings_defaults ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "platform_trade_settings_defaults_select_authenticated"
  ON public.platform_trade_settings_defaults;

CREATE POLICY "platform_trade_settings_defaults_select_authenticated"
  ON public.platform_trade_settings_defaults
  FOR SELECT
  TO authenticated
  USING (true);

-- 6) RLS: user_trading_preferences — each user their own row
ALTER TABLE public.user_trading_preferences ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "user_trading_preferences_select_own" ON public.user_trading_preferences;
DROP POLICY IF EXISTS "user_trading_preferences_insert_own" ON public.user_trading_preferences;
DROP POLICY IF EXISTS "user_trading_preferences_update_own" ON public.user_trading_preferences;

CREATE POLICY "user_trading_preferences_select_own"
  ON public.user_trading_preferences
  FOR SELECT
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

CREATE POLICY "user_trading_preferences_insert_own"
  ON public.user_trading_preferences
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "user_trading_preferences_update_own"
  ON public.user_trading_preferences
  FOR UPDATE
  TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

-- 7) RLS: copy_configurations — allow user to create rows they own
DROP POLICY IF EXISTS "copy_configurations_insert_own" ON public.copy_configurations;

CREATE POLICY "copy_configurations_insert_own"
  ON public.copy_configurations
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

-- 8) New auth users: copy platform defaults into user_trading_preferences
CREATE OR REPLACE FUNCTION public.ensure_user_trade_settings_from_defaults()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_trading_preferences (user_id, copy_trade_settings, updated_at)
  SELECT NEW.id, d.settings, now()
  FROM public.platform_trade_settings_defaults d
  WHERE d.id = 1
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created_trade_settings ON auth.users;

CREATE TRIGGER on_auth_user_created_trade_settings
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE PROCEDURE public.ensure_user_trade_settings_from_defaults();

COMMENT ON TABLE public.platform_trade_settings_defaults IS
  'Singleton (id=1): default copy-trade JSON for new users and empty merges.';
COMMENT ON COLUMN public.user_trading_preferences.copy_trade_settings IS
  'User global copy rules; Settings → Trading Preferences. New copy groups prefill from here.';
COMMENT ON COLUMN public.copy_configurations.trade_settings IS
  'Snapshot of rules when the copy link was created / last saved for this pair.';
