-- =====================================================================
-- AskMela Data Import System Migration
-- Run in Supabase SQL Editor
-- =====================================================================

-- 1. Add columns to AskMelaBusinesses
alter table "AskMelaBusinesses" 
add column if not exists sheets_sync_url text;

-- 2. New Imports Table
create table if not exists "AskMelaImports" (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references "AskMelaBusinesses"(id) on delete cascade,
  type text not null, -- 'csv' | 'excel' | 'pdf' | 'docx' | 'txt' | 'google_sheets'
  file_name text,
  source_url text,
  row_count int default 0,
  status text not null default 'processing', -- 'processing' | 'completed' | 'failed'
  error text,
  created_at timestamp with time zone default now()
);

-- 3. New Sheets Sync Table
create table if not exists "AskMelaSheetsSync" (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references "AskMelaBusinesses"(id) on delete cascade unique,
  sheet_url text not null,
  last_synced_at timestamp with time zone,
  next_sync_at timestamp with time zone,
  rows_count int default 0,
  is_active boolean default true,
  created_at timestamp with time zone default now()
);

-- 4. Add columns to AskMelaDocuments
alter table "AskMelaDocuments" 
add column if not exists import_id uuid references "AskMelaImports"(id) on delete cascade,
add column if not exists source_url text,
add column if not exists source_row int;

-- 5. Indexes
create index if not exists "AskMelaImports_business_id_idx" on "AskMelaImports" (business_id);
create index if not exists "AskMelaDocuments_import_id_idx" on "AskMelaDocuments" (import_id);
create index if not exists "AskMelaSheetsSync_business_id_idx" on "AskMelaSheetsSync" (business_id);

-- 6. RLS
alter table "AskMelaImports" enable row level security;
alter table "AskMelaSheetsSync" enable row level security;

-- Policies for AskMelaImports
create policy "Owners can view their own imports" on "AskMelaImports"
  for select using (
    exists (
      select 1 from "AskMelaBusinesses" b 
      where b.id = "AskMelaImports".business_id
    )
  );

-- Policies for AskMelaSheetsSync
create policy "Owners can view their own syncs" on "AskMelaSheetsSync"
  for select using (
    exists (
      select 1 from "AskMelaBusinesses" b 
      where b.id = "AskMelaSheetsSync".business_id
    )
  );
