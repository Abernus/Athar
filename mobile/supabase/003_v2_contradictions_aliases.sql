-- ============================================================
-- Athar V2 — Contradictions, Entity Aliases, Bibliography
-- Run AFTER 002. Uses the "athar" schema.
-- ============================================================

set search_path to athar;

-- ============================================================
-- CONTRADICTIONS
-- ============================================================
create table contradictions (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references research_projects(id) on delete set null,
  title text not null,
  description text default '',
  status text not null default 'open', -- open, resolved, acknowledged
  resolution_note text default '',
  -- The two claims/sources that contradict
  source_a_type text, -- source, excerpt, testimony, entity
  source_a_id uuid,
  source_b_type text,
  source_b_id uuid,
  tags text[] default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- ENTITY ALIASES (variantes de noms)
-- ============================================================
create table entity_aliases (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null,
  entity_id uuid not null,
  alias text not null,
  language text default '', -- ar, fr, ber, etc.
  script text default '', -- arabic, latin, tifinagh
  transcription_system text default '', -- official, colonial, popular
  notes text default '',
  created_at timestamptz default now()
);

-- ============================================================
-- BIBLIOGRAPHY
-- ============================================================
create table bibliography_entries (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references research_projects(id) on delete set null,
  entry_type text not null default 'book', -- book, article, thesis, chapter, report, website, archive_guide
  title text not null,
  authors text default '',
  year text default '',
  publisher text default '',
  journal text default '',
  volume text default '',
  pages text default '',
  url text default '',
  isbn text default '',
  abstract text default '',
  notes text default '',
  tags text[] default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- TRIGGERS
-- ============================================================
create trigger contradictions_updated_at before update on contradictions for each row execute function update_updated_at();
create trigger bibliography_entries_updated_at before update on bibliography_entries for each row execute function update_updated_at();

-- ============================================================
-- RLS
-- ============================================================
alter table contradictions enable row level security;
alter table entity_aliases enable row level security;
alter table bibliography_entries enable row level security;

create policy "Allow all" on contradictions for all using (true) with check (true);
create policy "Allow all" on entity_aliases for all using (true) with check (true);
create policy "Allow all" on bibliography_entries for all using (true) with check (true);
