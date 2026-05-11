-- =====================================================================
-- AskMela Integrations Migration
-- =====================================================================

-- ─── Bot Context (Session Replacement) ─────────────────────────────────────────
create table if not exists "AskMelaBotContext" (
  telegram_id bigint primary key,
  business_unique_link text not null,
  last_interaction_at timestamp with time zone default now()
);

-- ─── API Keys ─────────────────────────────────────────────────────────────────
create table if not exists "AskMelaApiKeys" (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references "AskMelaBusinesses"(id) on delete cascade,
  name text not null,               -- Label for the key
  key_prefix text not null,         -- 'ask_live_'
  key_hash text not null unique,    -- SHA-256 hash of the full key
  last_used_at timestamp with time zone,
  created_at timestamp with time zone default now()
);

-- ─── Widget Customization (Add to Businesses table) ──────────────────────────
alter table "AskMelaBusinesses" 
add column if not exists widget_color text default '#00FF88',
add column if not exists widget_position text default 'bottom-right';

-- ─── RLS for API Keys ─────────────────────────────────────────────────────────
alter table "AskMelaApiKeys" enable row level security;

create policy "Owners can manage their API keys" on "AskMelaApiKeys"
  for all using (
    business_id in (
      select id from "AskMelaBusinesses" 
      where owner_telegram_id = (select auth.uid()::text::bigint) -- Assuming Supabase Auth links to Telegram ID if possible, 
      -- but for now we often use the service role or manual owner check in API.
    )
  );

-- Note: Since we are using Telegram-based login, the auth.uid() might not directly match.
-- We will handle validation in the API routes using service role if needed.
