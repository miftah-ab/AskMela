-- =====================================================================
-- AskMela Database Schema (Case-Sensitive Version)
-- Run in Supabase SQL Editor
-- =====================================================================

-- Enable vector extension
create extension if not exists vector;

-- ─── Businesses ───────────────────────────────────────────────────────────────
create table if not exists "AskMelaBusinesses" (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null,
  owner_telegram_id bigint not null unique,
  owner_username text,
  owner_phone text not null,
  unique_link text not null unique,
  is_active boolean default true,
  language text default 'both', -- 'amharic' | 'english' | 'both'
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- ─── Knowledge Base Documents (RAG) ──────────────────────────────────────────
create table if not exists "AskMelaDocuments" (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references "AskMelaBusinesses"(id) on delete cascade,
  content text not null,          -- transcribed/extracted text only
  embedding vector(1536),
  source_type text not null,      -- 'text' | 'voice' | 'photo'
  telegram_file_id text,          -- Telegram file_id reference only
  metadata jsonb default '{}',
  created_at timestamp with time zone default now()
);

-- ─── Customer Conversations ───────────────────────────────────────────────────
create table if not exists "AskMelaConversations" (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references "AskMelaBusinesses"(id) on delete cascade,
  customer_telegram_id bigint not null,
  customer_username text,
  question text not null,
  answer text,
  was_answered boolean default false,
  source_type text default 'text', -- 'text' | 'voice'
  language_detected text default 'amharic',
  created_at timestamp with time zone default now()
);

-- ─── Owner Notifications ──────────────────────────────────────────────────────
create table if not exists "AskMelaNotifications" (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references "AskMelaBusinesses"(id) on delete cascade,
  type text not null, -- 'unanswered_question' | 'new_customer' | 'system'
  message text not null,
  conversation_id uuid references "AskMelaConversations"(id),
  is_read boolean default false,
  created_at timestamp with time zone default now()
);

-- ─── Business Stats (updated per question) ───────────────────────────────────
create table if not exists "AskMelaStats" (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references "AskMelaBusinesses"(id) on delete cascade,
  date date not null default current_date,
  total_questions int default 0,
  answered_questions int default 0,
  unanswered_questions int default 0,
  unique_customers int default 0,
  constraint "AskMelaStats_business_date" unique (business_id, date)
);

-- ─── Vector Similarity Search Function ───────────────────────────────────────
create or replace function match_documents(
  query_embedding vector(1536),
  business_id_filter uuid,
  match_threshold float default 0.7,
  match_count int default 5
)
returns table (id uuid, content text, similarity float)
language sql stable as $$
  select id, content,
    1 - (embedding <=> query_embedding) as similarity
  from "AskMelaDocuments"
  where business_id = business_id_filter
    and 1 - (embedding <=> query_embedding) > match_threshold
  order by embedding <=> query_embedding
  limit match_count;
$$;

-- ─── Indexes ──────────────────────────────────────────────────────────────────
create index if not exists "AskMelaDocuments_business_id_idx" on "AskMelaDocuments" (business_id);
create index if not exists "AskMelaConversations_business_id_idx" on "AskMelaConversations" (business_id);
create index if not exists "AskMelaConversations_created_at_idx" on "AskMelaConversations" (created_at desc);
create index if not exists "AskMelaNotifications_business_read_idx" on "AskMelaNotifications" (business_id, is_read);

-- ─── Row Level Security ───────────────────────────────────────────────────────
-- Bot uses service role key (bypasses RLS)
-- Web dashboard uses anon key + these policies

alter table "AskMelaBusinesses" enable row level security;
alter table "AskMelaDocuments" enable row level security;
alter table "AskMelaConversations" enable row level security;
alter table "AskMelaNotifications" enable row level security;
alter table "AskMelaStats" enable row level security;

-- Public read for businesses (needed for customer flow)
create policy "Public business read" on "AskMelaBusinesses"
  for select using (is_active = true);

-- ─── Admin Tables ───────────────────────────────────────────────────────────
create table if not exists "AskMelaErrorLogs" (
  id uuid primary key default gen_random_uuid(),
  error_type text not null,
  error_message text not null,
  stack_trace text,
  context jsonb default '{}',
  created_at timestamp with time zone default now()
);

create table if not exists "AskMelaAnnouncements" (
  id uuid primary key default gen_random_uuid(),
  message text not null,
  sent_to_count int default 0,
  sent_by_telegram_id bigint not null,
  created_at timestamp with time zone default now()
);

create table if not exists "AskMelaSystemStats" (
  id uuid primary key default gen_random_uuid(),
  total_businesses int default 0,
  active_businesses int default 0,
  total_conversations int default 0,
  total_answered int default 0,
  total_unanswered int default 0,
  groq_api_calls_today int default 0,
  recorded_at timestamp with time zone default now()
);
