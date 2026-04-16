-- ============================================================
-- Athar (أثر) — Supabase schema
-- Historical research platform: entities, relationships, sources
-- Uses the "athar" schema to coexist with other projects
-- ============================================================

-- Enable UUID generation
create extension if not exists "pgcrypto";

-- Create dedicated schema
create schema if not exists athar;

-- Set search path for this script
set search_path to athar;

-- ============================================================
-- PERSONS
-- ============================================================
create table persons (
  id uuid primary key default gen_random_uuid(),
  primary_name text not null,
  alternate_names text[] default '{}',
  summary text default '',
  birth_date jsonb, -- { value, precision, display? }
  death_date jsonb,
  gender text,
  tags text[] default '{}',
  notes text default '',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- GROUPS
-- ============================================================
create table groups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  group_type text not null default 'other',
  summary text default '',
  time_range jsonb, -- { start?: HistoricalDate, end?: HistoricalDate }
  tags text[] default '{}',
  notes text default '',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- PLACES
-- ============================================================
create table places (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  place_type text not null default 'other',
  parent_place_id uuid references places(id),
  summary text default '',
  coordinates jsonb, -- { lat, lng }
  tags text[] default '{}',
  notes text default '',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- EVENTS
-- ============================================================
create table events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  event_type text not null default 'other',
  description text default '',
  date_start jsonb,
  date_end jsonb,
  place_id uuid references places(id),
  tags text[] default '{}',
  notes text default '',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- RELATIONSHIPS
-- ============================================================
create table relationships (
  id uuid primary key default gen_random_uuid(),
  source_entity_type text not null,
  source_entity_id uuid not null,
  target_entity_type text not null,
  target_entity_id uuid not null,
  relationship_type text not null default 'other',
  label text,
  confidence_level text not null default 'probable',
  notes text default '',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- SOURCES
-- ============================================================
create table sources (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  source_type text not null default 'other',
  origin text default '',
  created_or_published_at jsonb,
  reference text default '',
  summary text default '',
  critical_note text default '',
  tags text[] default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- HYPOTHESES
-- ============================================================
create table hypotheses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text default '',
  status text not null default 'draft',
  confidence_level text not null default 'uncertain',
  author_id uuid,
  notes text default '',
  tags text[] default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- ARCHIVE ITEMS
-- ============================================================
create table archive_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  archive_type text not null default 'other',
  description text default '',
  date_or_period jsonb,
  file_ref text, -- storage path or URL
  linked_entity_ids jsonb default '[]', -- [{ entityType, entityId }]
  tags text[] default '{}',
  notes text default '',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- ORAL TESTIMONIES
-- ============================================================
create table oral_testimonies (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  speaker text not null,
  interviewer text default '',
  recorded_at jsonb,
  summary text default '',
  transcript text,
  trust_note text default '',
  linked_entity_ids jsonb default '[]',
  tags text[] default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- AUTO-UPDATE updated_at
-- ============================================================
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger persons_updated_at before update on persons for each row execute function update_updated_at();
create trigger groups_updated_at before update on groups for each row execute function update_updated_at();
create trigger places_updated_at before update on places for each row execute function update_updated_at();
create trigger events_updated_at before update on events for each row execute function update_updated_at();
create trigger relationships_updated_at before update on relationships for each row execute function update_updated_at();
create trigger sources_updated_at before update on sources for each row execute function update_updated_at();
create trigger hypotheses_updated_at before update on hypotheses for each row execute function update_updated_at();
create trigger archive_items_updated_at before update on archive_items for each row execute function update_updated_at();
create trigger oral_testimonies_updated_at before update on oral_testimonies for each row execute function update_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY (permissive for now — tighten with auth later)
-- ============================================================
alter table persons enable row level security;
alter table groups enable row level security;
alter table places enable row level security;
alter table events enable row level security;
alter table relationships enable row level security;
alter table sources enable row level security;
alter table hypotheses enable row level security;
alter table archive_items enable row level security;
alter table oral_testimonies enable row level security;

-- Allow all operations with anon key (no auth yet)
create policy "Allow all" on persons for all using (true) with check (true);
create policy "Allow all" on groups for all using (true) with check (true);
create policy "Allow all" on places for all using (true) with check (true);
create policy "Allow all" on events for all using (true) with check (true);
create policy "Allow all" on relationships for all using (true) with check (true);
create policy "Allow all" on sources for all using (true) with check (true);
create policy "Allow all" on hypotheses for all using (true) with check (true);
create policy "Allow all" on archive_items for all using (true) with check (true);
create policy "Allow all" on oral_testimonies for all using (true) with check (true);

-- ============================================================
-- STORAGE BUCKETS (run in Supabase dashboard or via API)
-- ============================================================
-- insert into storage.buckets (id, name, public) values ('archives', 'archives', true);
-- insert into storage.buckets (id, name, public) values ('recordings', 'recordings', true);
