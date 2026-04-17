# TradeMyPips v2 Frontend — Supabase database design

This document maps **every route and settings tab** in `trademypips-v2-frontend` to the data the UI shows or collects, then proposes **PostgreSQL (Supabase) tables** so the backend can own calculations and the frontend only **reads rendered rows** and **writes user inputs**.

**Architecture reminder (your 3 phases):** backend computes → persists to Supabase → frontend queries/displays. Aggregations (totals, win rate, group labels) should ideally be **precomputed rows or views** updated by the backend, not computed in the browser—except trivial formatting (currency, time strings).

---

## Step 1 — Routes and what they need

### `/` (Landing — `Index.tsx`)

| Area | UI data | Source |
|------|---------|--------|
| Hero, grids, steps, bento, CTA | Mostly static marketing copy | Optional CMS later; not required for authenticated app |
| `LiveStrip` | Terminals active, avg execution ms, trades copied, operational flag, active accounts, trades today | **`platform_public_stats`** (single row or key/value) updated by backend from global metrics |
| `PricingPlans` | Plan names, prices, feature bullets, limits | **`subscription_plans`** (+ optional `plan_features` list) |
| `LogTerminal` | Scrolling log lines | **`platform_activity_feed`** or reuse anonymized **`system_logs`** slice |

**User input:** none persistent on this page (CTA → auth/checkout flows).

---

### `/dashboard` (Main dashboard — `pages/dashboard/Index.tsx`)

| Component | Data displayed | Suggested tables / notes |
|-----------|----------------|---------------------------|
| `PortfolioStrip` | Net balance, equity, today PnL, total PnL, win rate %, active account count | Sum/avg across **`trading_accounts`** + **`account_analytics`**, or a single **`dashboard_summary`** row per `user_id` refreshed by backend |
| `EquityChart` | Time range 7D/30D/ALL, peak equity annotation (currently static SVG) | **`equity_series`** (user-level aggregate) or sum of **`account_equity_points`** per timestamp |
| `QuickActions` | Buttons only | No table |
| `SignalPipeline` | Pipeline status, latency ms, master/slave labels (currently static) | **`signal_pipeline_status`** per user or per master account: `status`, `latency_ms`, `master_account_id`, `slave_account_id` |
| `AccountsTableV2` | account_number, account_name, balance, equity, daily_pnl, account_type (MASTER/SLAVE), status | **`trading_accounts`** + **`account_analytics`** (daily_pnl) |
| `RecentTradesV2` | symbol, type BUY/SELL, volume, open_price, profit, time | **`trade_history`** (joined to account for RLS); `close_time` for ordering |
| `ActivityFeedV2` | timestamp, message, type, details snippet | **`system_logs`** (limit 3 on dashboard; full page uses more) |

**Frontend today:** aggregates PnL/win rate in the client—move to **`dashboard_summary`** or a SQL view when you harden the architecture.

---

### `/dashboard/accounts` (`Accounts.tsx`)

| Area | Data | Tables |
|------|------|--------|
| `AccountSummary` | total balance, equity, total PnL, active count, connected count | Derived from **`trading_accounts`** + **`account_analytics`** or **`dashboard_summary`** |
| Filters | search string, filter All/Masters/Copiers/Active/Disconnected | Query params only |
| `AccountTable` | account_name, account_number, broker, balance, equity, pnl, status, role Master/Copier, **relationship** (“3 accounts copying” / “Copying MT5-001”) | **`trading_accounts`**, **`account_analytics`**; **relationship** from backend view **`v_account_copy_relationship`** (counts/links) |
| `AccountDrawer` | balance, equity, floating PnL, 24h performance series, open trades list, toggles “Allow copying”, “Sync orders” | **`trading_accounts`**, **`account_equity_points`** (24h), **`positions`**, **`account_execution_flags`** (see below) |

**User input (collect → send to backend → DB):** disconnect/configure risk (actions); toggles should persist in **`account_execution_flags`**.

---

### `/dashboard/groups` (`CopyGroups.tsx`)

| Area | Data | Tables |
|------|------|--------|
| Header | — | — |
| `GroupSummary` | activeGroups, totalCopiers, tradesToday, avgLatency | Count **`copy_configurations`**, count **`copy_trades`** today, avg from **`copy_configurations.last_latency_ms`** or **`signal_pipeline_status`** |
| `GroupCard` | name, status active/paused/error, latency, master label, copier labels[], mode, maxLot, tradesToday, errorMessage | Derived from **`copy_configurations`** + **`trading_accounts`**; optional named **`copy_groups`** if you want titles independent of master id |
| `CreateGroupWizard` | List masters: broker, account_name, balance, account_number | **`trading_accounts`** where `account_type = 'master'` |
| Step 3 copy rules | Default form state | **`useUserTradeSettings`** → merge **`platform_trade_settings_defaults`** + **`user_trading_preferences.copy_trade_settings`** |
| Wizard Finish | Persist link + rule snapshot | **`copy_configurations`** including **`trade_settings`** jsonb (+ `copy_mode` / `lot_multiplier` / `max_lot_size` where set) |

**User input:** create group (master + copiers + rules)—frontend writes **`copy_configurations`**; global defaults live in **`user_trading_preferences`** (optional **`copy_groups`** for named pipelines).

**Note:** UI groups rows by `master_account_id`. You can keep **one row per master↔copier pair** in `copy_configurations` without a separate group table, or add **`copy_groups`** (`id`, `user_id`, `name`, `master_account_id`, …) and `copy_group_id` on configurations for named pipelines.

---

### `/dashboard/signals` & `/social-hub` (`SignalHubContent.tsx`)

| Area | Data | Tables |
|------|------|--------|
| Featured + grid cards | display name, avatar URL, verified flag, ROI %, win rate %, drawdown %, follower count, trending flag, LIVE badge | **`signal_provider_profiles`** (marketplace) + optional **`signal_provider_stats`** (period-scoped metrics for filters) |
| Filters | search, ROI buckets, risk Low/Med/High, time window 7D | Query params; backend filters **`signal_provider_stats`** |
| Pagination | “Showing 6 of 1248”, load more | `limit/offset` on **`signal_provider_profiles`** |
| Actions | Copy / View profile / Create signal | **`signal_subscriptions`** or **`copy_requests`** (user follows/copies a provider) — backend writes |

**User input:** search text, filter selections, subscribe/copy (writes via API).

---

### `/dashboard/history` (`History.tsx`)

| Area | Data | Tables |
|------|------|--------|
| Filters | account id, date range, export CSV | Query + export job |
| Metric cards | total profit, change %, win rate, trade count, max drawdown | **`history_period_summary`** (per user, account nullable, date range) produced by backend |
| Equity curve | balance/equity series, toggles, range 7D/30D/90D/All | **`account_equity_points`** or **`portfolio_equity_series`** |
| Trade log table | date/time, account label, symbol, type, lot, profit, status (win/loss/open) | **`trade_history`** + **`positions`** for open rows; consider unified **`trade_log_entries`** view |

**User input:** filters, export request.

---

### `/dashboard/logs` (`Logs.tsx`)

| Area | Data | Tables |
|------|------|--------|
| Sticky alert | critical issue text, CTA | **`user_alerts`** or latest **`system_logs`** severity=critical |
| Account filter | All / per master / per slave | `trading_account_id` nullable on logs |
| Category pills | All, Trades, Copy events, Errors, Warnings, System | **`system_logs.category`** enum |
| Each log row | severity, time, title, body, source node, execution ms, relative time, retry attempt | **`system_logs`** + optional JSON **`metadata`** |
| Footer stream | events processed, uptime, server id | **`platform_infra_stats`** or ops table |

**User input:** download, delete, pause stream (if implemented)—mostly actions.

---

### `/dashboard/settings` (`Settings.tsx`) — tabs

| Tab | Display / collect | Tables |
|-----|-------------------|--------|
| **Profile** | avatar, full name, email, bio, username, copy-trade visibility toggle | **`profiles`** (extends `auth.users`), visibility flag |
| **Security** | password change (Supabase Auth), session list (device, location, current, last active) | Auth + **`user_sessions`** |
| **Preferences** | Full **copy trade / risk rules** (same shape as Create Copy Group Step 3): core risk toggles, symbol filters, execution limits, drawdown / equity stops, sync behavior | **`user_trading_preferences.copy_trade_settings`** (jsonb, merged with **`platform_trade_settings_defaults`**) |
| **API Keys** | label, created, last activity, rotate/delete | **`api_keys`** (store **hash** only, never raw key in DB after creation) |
| **Integrations** | Telegram status, TradingView webhook URL + secret, active/not connected | **`user_integrations`** (type enum, config jsonb, status) |
| **Notifications** | toggles: trade activity, copy events, system alerts; email, telegram | **`notification_preferences`** |

**User input:** all of the above fields—frontend posts to backend; backend validates and writes.

---

### Sidebar / header (layout)

| Element | Data |
|---------|------|
| Sidebar user card | display label, tier (“Tier 3 Operator”) | **`profiles.display_name`**, **`profiles.operator_tier`** or subscription tier from **`subscriptions`** |
| Header search | instruments | Optional **`watchlists`** later; not in current UI data layer |
| Bell / notifications | unread count, items | **`in_app_notifications`** |

---

## Step 2 — Tables reference (what each does)

| Table | Purpose |
|-------|---------|
| **`profiles`** | App-specific user profile: names, username, avatar, bio, tier, marketing flags; 1:1 with `auth.users`. |
| **`servers`** | VPS/terminal servers linked to a user (from `useServers`). |
| **`trading_accounts`** | Linked MT/other accounts: numbers, names, broker, platform, type master/slave, connection status, live balance/equity (snapshots from bridge). |
| **`account_analytics`** | Per-account metrics the UI shows: daily_pnl, total_pnl, win_rate, etc. Updated by backend jobs. |
| **`account_equity_points`** | Time-series for charts (per account or aggregated). |
| **`equity_series` / `portfolio_equity_series`** | Optional aggregate series for dashboard/history when not summing client-side. |
| **`dashboard_summary`** | Optional single row per user: pre-aggregated strip metrics. |
| **`positions`** | Open positions for “open trades” and status=open filters. |
| **`trade_history`** | Closed trades for recent activity, history table, exports. |
| **`copy_configurations`** | Master + copier + rules: active, max lot, mode, latency snapshot, error state, **`trade_settings`** jsonb (snapshot of rules when the link was created). Legacy columns `copy_mode`, `lot_multiplier`, `max_lot_size` can mirror key fields for workers. |
| **`copy_trades`** | Audit of copies executed (for “trades today” on groups). |
| **`copy_groups`** | Optional named group + metadata if you outgrow “group by master”. |
| **`signal_pipeline_status`** | Optional UI for pipeline widget: latency, healthy flag, node ids. |
| **`signal_provider_profiles`** | Marketplace strategist row: slug, avatar, verified, live account link. |
| **`signal_provider_stats`** | Filterable stats per window (roi, drawdown, risk tier, followers). |
| **`signal_subscriptions`** | Which user copies which public strategist. |
| **`subscription_plans`** | Catalog for pricing page + billing. |
| **`subscriptions`** | User’s active plan, status, period end. |
| **`system_logs`** | Structured operational log feed. |
| **`user_alerts`** | Critical banner messages (e.g. disconnected account). |
| **`platform_public_stats`** | Landing page aggregate numbers. |
| **`platform_infra_stats`** | Logs footer: uptime, event counts, server name. |
| **`history_period_summary`** | Precomputed history KPIs for date/account filters. |
| **`account_execution_flags`** | Per-account toggles: allow_copying, sync_orders, etc. |
| **`platform_trade_settings_defaults`** | Singleton (`id = 1`): platform-wide default copy-trade JSON seeded for every new user and for empty merges. |
| **`user_trading_preferences`** | One row per user; **`copy_trade_settings`** jsonb = global prefs (Settings → Trading Preferences). New copy groups prefill from this; each **`copy_configurations.trade_settings`** stores a snapshot for that master↔copier link. |
| **`api_keys`** | API key metadata + hash. |
| **`user_integrations`** | Telegram, TradingView webhook, etc. |
| **`notification_preferences`** | Email/Telegram/event toggles. |
| **`user_sessions`** | Optional session list for Security tab. |
| **`in_app_notifications`** | Header bell. |
| **`v_account_copy_relationship`** (view) | Text for “relationship” column on Accounts—backend-defined. |

---

## Step 3 — Column-level schema (DDL sketch)

Types use PostgreSQL. Adjust precision as your bridge requires. All timestamps: `timestamptz`.

### Core identity & profile

```sql
-- 1:1 with auth.users — use the same id as user id
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  username text unique,
  avatar_url text,
  bio text,
  copy_visibility boolean not null default false,
  operator_tier text, -- e.g. "tier_3" for "Tier 3 Operator"
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

### Infrastructure

```sql
create table public.servers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  region text,
  host text,
  status text not null default 'unknown', -- connected, degraded, offline
  metadata jsonb default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.trading_accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  server_id uuid references public.servers (id) on delete set null,
  account_number text not null,
  account_name text,
  broker_server text not null, -- e.g. "ICMarkets-Demo"
  platform text not null default 'mt5',
  account_type text not null check (account_type in ('master', 'slave')),
  status text not null default 'disconnected' check (status in ('connected', 'disconnected', 'error')),
  balance numeric(20,2) default 0,
  equity numeric(20,2) default 0,
  currency text default 'USD',
  last_heartbeat_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, account_number, broker_server)
);

create table public.account_analytics (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.trading_accounts (id) on delete cascade,
  daily_pnl numeric(20,2) default 0,
  total_pnl numeric(20,2) default 0,
  win_rate numeric(5,2), -- percentage 0-100
  updated_at timestamptz not null default now(),
  unique (account_id)
);

create table public.account_equity_points (
  id bigint generated always as identity primary key,
  account_id uuid not null references public.trading_accounts (id) on delete cascade,
  recorded_at timestamptz not null,
  balance numeric(20,2),
  equity numeric(20,2)
);
create index on public.account_equity_points (account_id, recorded_at desc);
```

### Trades

```sql
create table public.positions (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.trading_accounts (id) on delete cascade,
  external_ticket text,
  symbol text not null,
  side text not null check (side in ('buy', 'sell')),
  volume numeric(20,4) not null,
  open_price numeric(20,8),
  profit numeric(20,2),
  sl numeric(20,8),
  tp numeric(20,8),
  status text not null default 'open' check (status in ('open', 'pending')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.trade_history (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.trading_accounts (id) on delete cascade,
  symbol text not null,
  side text not null check (side in ('buy', 'sell')),
  volume numeric(20,4) not null,
  open_price numeric(20,8),
  close_price numeric(20,8),
  profit numeric(20,2),
  open_time timestamptz,
  close_time timestamptz not null,
  status text not null default 'closed' check (status in ('closed', 'cancelled')),
  is_win boolean,
  metadata jsonb default '{}'
);
create index on public.trade_history (account_id, close_time desc);
```

### Copy trading

```sql
create table public.copy_configurations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  master_account_id uuid not null references public.trading_accounts (id) on delete cascade,
  copier_account_id uuid not null references public.trading_accounts (id) on delete cascade,
  active boolean not null default true,
  copy_mode text not null default 'proportional', -- proportional, fixed, etc.
  lot_multiplier numeric(10,4) default 1,
  max_lot_size numeric(10,4) default 1,
  trade_settings jsonb, -- snapshot of full copy rules JSON when link is created (see frontend `CopyRulesState`)
  last_latency_ms int,
  last_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (master_account_id <> copier_account_id)
);

create table public.copy_trades (
  id uuid primary key default gen_random_uuid(),
  copy_configuration_id uuid not null references public.copy_configurations (id) on delete cascade,
  master_ticket text,
  copier_ticket text,
  symbol text,
  volume numeric(20,4),
  profit numeric(20,2),
  status text,
  created_at timestamptz not null default now(),
  metadata jsonb default '{}'
);
create index on public.copy_trades (copy_configuration_id, created_at desc);
```

### Billing (pricing page + app)

```sql
create table public.subscription_plans (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  price_cents int not null,
  billing_interval text not null default 'month',
  account_limit int, -- null = unlimited
  features jsonb default '[]',
  sort_order int default 0,
  is_active boolean not null default true
);

create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  plan_id uuid references public.subscription_plans (id),
  status text not null check (status in ('active', 'past_due', 'cancelled', 'trialing')),
  current_period_end timestamptz,
  metadata jsonb default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

### Logs & alerts

```sql
create table public.system_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete cascade,
  trading_account_id uuid references public.trading_accounts (id) on delete set null,
  level text not null check (level in ('debug', 'info', 'warning', 'error', 'success')),
  category text not null check (category in ('trade', 'copy_event', 'error', 'warning', 'system')),
  message text not null,
  details jsonb,
  source text, -- e.g. Node_S03
  execution_ms int,
  created_at timestamptz not null default now()
);
create index on public.system_logs (user_id, created_at desc);

create table public.user_alerts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  severity text not null check (severity in ('info', 'warning', 'critical')),
  title text not null,
  body text,
  action_label text,
  action_url text,
  dismissed_at timestamptz,
  created_at timestamptz not null default now()
);
```

### Marketplace / Signal Hub

```sql
create table public.signal_provider_profiles (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid references auth.users (id) on delete set null,
  slug text unique,
  display_name text not null,
  avatar_url text,
  verified boolean not null default false,
  is_active boolean not null default true,
  linked_master_account_id uuid references public.trading_accounts (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.signal_provider_stats (
  id uuid primary key default gen_random_uuid(),
  provider_id uuid not null references public.signal_provider_profiles (id) on delete cascade,
  window text not null default '30d', -- 7d, 30d, etc.
  roi_percent numeric(10,4),
  win_rate_percent numeric(5,2),
  max_drawdown_percent numeric(5,2),
  follower_count int default 0,
  risk_tier text check (risk_tier in ('low', 'medium', 'high')),
  is_trending boolean default false,
  updated_at timestamptz not null default now(),
  unique (provider_id, window)
);
```

### Settings & integrations

**Copy trade settings lifecycle**

1. **`platform_trade_settings_defaults`** (singleton `id = 1`) holds the canonical default JSON for the product. Admins/service role update this when defaults change; it is **not** overwritten on every deploy (seed uses `ON CONFLICT DO NOTHING`).
2. **New `auth.users` row** → trigger inserts **`user_trading_preferences`** with `copy_trade_settings` copied from that platform row (`ON CONFLICT DO NOTHING` if another trigger already created the row).
3. **Existing users** (before this feature): migration backfills `copy_trade_settings` from platform defaults where the column was missing or `{}`.
4. **Settings → Trading Preferences** reads `merge(platform.defaults, user.copy_trade_settings)` in the app (`useUserTradeSettings`) and writes **`user_trading_preferences.copy_trade_settings`** on commit.
5. **Create Copy Group** wizard loads the same merged object as initial Step 3 state; **Finish** inserts **`copy_configurations`** including **`trade_settings`** = snapshot. Editing global Settings later does **not** mutate existing `trade_settings` rows (each link keeps its snapshot unless you add an explicit “sync from global” action later).

```sql
-- Singleton defaults for all new users + empty merges (frontend: `src/lib/copyTradeSettings.ts`)
create table public.platform_trade_settings_defaults (
  id integer primary key default 1 check (id = 1),
  settings jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table public.user_trading_preferences (
  user_id uuid primary key references auth.users (id) on delete cascade,
  default_lot_multiplier numeric(10,4) default 1, -- legacy; optional mirror of json
  default_max_lot numeric(10,4) default 1,
  slippage_pips int default 3,
  risk_mode text default 'proportional' check (risk_mode in ('proportional', 'fixed')),
  copy_trade_settings jsonb not null default '{}'::jsonb, -- global copy rules for this user
  updated_at timestamptz not null default now()
);

create table public.account_execution_flags (
  account_id uuid primary key references public.trading_accounts (id) on delete cascade,
  allow_copying boolean not null default false,
  sync_orders boolean not null default true,
  updated_at timestamptz not null default now()
);

create table public.api_keys (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  label text not null,
  key_prefix text not null, -- first 8 chars for display
  key_hash text not null,
  last_used_at timestamptz,
  created_at timestamptz not null default now(),
  revoked_at timestamptz
);

create table public.user_integrations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  provider text not null check (provider in ('telegram', 'tradingview_webhook', 'other')),
  status text not null default 'disconnected',
  config jsonb default '{}', -- webhook URL references, secrets refs — avoid plain secrets if possible
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, provider)
);

create table public.notification_preferences (
  user_id uuid primary key references auth.users (id) on delete cascade,
  trade_activity boolean default true,
  copy_events boolean default true,
  system_alerts boolean default true,
  email_enabled boolean default true,
  telegram_push boolean default false,
  updated_at timestamptz not null default now()
);
```

### Optional landing / ops

```sql
create table public.platform_public_stats (
  id int primary key default 1 check (id = 1),
  terminals_active int,
  avg_execution_ms int,
  trades_copied_total bigint,
  accounts_active int,
  trades_today int,
  updated_at timestamptz not null default now()
);

create table public.platform_infra_stats (
  id int primary key default 1 check (id = 1),
  events_processed bigint,
  uptime_percent numeric(6,3),
  server_label text,
  updated_at timestamptz not null default now()
);
```

---

## Step 4 — Row ownership & RLS (summary)

- Almost every table carries **`user_id`** or links through **`trading_accounts.user_id`**. Enable **RLS** and policies like: `user_id = auth.uid()` or `exists (select 1 from trading_accounts ta where ta.id = row.account_id and ta.user_id = auth.uid())`.
- **`signal_provider_profiles`**: public **read** for `is_active` strategists; **write** for owner or admin only.
- **`subscription_plans`**: public read for active plans.
- **`platform_public_stats` / `platform_infra_stats`**: public read or service-role only.

Prefer **service role** from your backend for bridge jobs (MT server → DB) and restrict anon/authenticated clients to safe selects/inserts.

---

## Step 5 — Alignment with current frontend hooks

`src/hooks/v2/useDashboardData.ts` already expects:

| Hook | Table assumed |
|------|----------------|
| `useServers` | `servers` |
| `useAccounts` | `trading_accounts` |
| `useAccountAnalytics` | `account_analytics` |
| `useRecentPositions` | `positions` (`status = 'open'`) |
| `useRecentTrades` | `trade_history` |
| `useSystemLogs` | `system_logs` |
| `useSubscription` | `subscriptions` + `subscription_plans` |
| `useCopyConfigurations` | `copy_configurations` + joins to `trading_accounts` |
| `useCopyTradesToday` | `copy_trades` |

Extend **`trading_accounts`** beyond the minimal `src/integrations/supabase/types.ts` stub so columns match UI (`account_name`, `broker_server`, `account_type`, `balance`, `equity`).

**Trade settings (implemented in repo):** migration `supabase/migrations/20260408120000_trade_copy_settings.sql` creates **`platform_trade_settings_defaults`**, adds **`user_trading_preferences.copy_trade_settings`**, adds **`copy_configurations.trade_settings`**, backfills existing users, enables RLS policies, and adds an **`auth.users`** insert trigger. After applying it in Supabase, run `supabase gen types typescript` (or your pipeline) and replace `src/integrations/supabase/types.ts` so `.from('user_trading_preferences')` etc. are typed; until then the app uses `supabase as any` for those tables.

---

## Step 6 — What the backend should precompute (recommended)

| UI surface | Avoid client-side math |
|------------|-------------------------|
| Dashboard strip totals | `dashboard_summary` or materialized view |
| Win rate average across accounts | Store on summary or in `account_analytics` only display |
| Copy group name / status / error | Update `copy_configurations.last_error`, `last_latency_ms`, `active` from worker |
| History KPI cards | `history_period_summary` per filter |
| Signal Hub sorting | Index `signal_provider_stats` by `roi_percent`, `risk_tier`, `window` |

---

*Generated from a full pass of `App.tsx` routes, `SidebarV2` nav, `Settings` tabs, and dashboard feature components as of this repo state.*
