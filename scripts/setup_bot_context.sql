-- RUN THIS IN SUPABASE SQL EDITOR TO FIX BOT SESSION LOSS ON VERCEL
-- This table replaces the in-memory Map which doesn't work in serverless.

create table if not exists "AskMelaBotContext" (
  telegram_id bigint primary key,
  business_unique_link text not null,
  last_interaction_at timestamp with time zone default now()
);

-- Enable Row Level Security (optional but recommended)
alter table "AskMelaBotContext" enable row level security;

-- Policies (optional - since the bot uses service role, it bypasses RLS)
-- But we add a dummy policy to keep it clean.
create policy "Allow bot service role full access" 
on "AskMelaBotContext" 
for all 
using (true) 
with check (true);
