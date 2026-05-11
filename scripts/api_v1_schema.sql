-- Run this in Supabase SQL Editor to add v1 API support

-- API keys for REST API access
create table if not exists "AskMelaApiKeys" (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references "AskMelaBusinesses"(id) on delete cascade,
  name text not null,
  key_hash text not null unique,
  key_prefix text not null,    -- 'ask_live_' or 'ask_test_'
  last_used_at timestamp with time zone,
  expires_at timestamp with time zone,
  is_active boolean default true,
  created_at timestamp with time zone default now()
);

-- Webhooks configuration
create table if not exists "AskMelaWebhooks" (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references "AskMelaBusinesses"(id) on delete cascade,
  url text not null,
  events text[] not null,
  secret_hash text not null,
  is_active boolean default true,
  last_triggered_at timestamp with time zone,
  created_at timestamp with time zone default now()
);

-- Widget sessions
create table if not exists "AskMelaWidgetSessions" (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references "AskMelaBusinesses"(id) on delete cascade,
  session_token text not null unique,
  customer_metadata jsonb default '{}',
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table "AskMelaApiKeys" enable row level security;
alter table "AskMelaWebhooks" enable row level security;
alter table "AskMelaWidgetSessions" enable row level security;
