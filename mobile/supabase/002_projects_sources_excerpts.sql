-- ============================================================
-- Athar V1.1 — Dossiers de recherche, Sources enrichies, Extraits
-- Run AFTER schema.sql. Uses the "athar" schema.
-- ============================================================

set search_path to athar;

-- ============================================================
-- RESEARCH PROJECTS (Dossiers de recherche)
-- ============================================================
create table research_projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  summary text default '',
  research_question text default '',
  period_start text, -- free text: "1900", "vers 1830"
  period_end text,
  geographic_scope text default '',
  status text not null default 'active', -- active, paused, completed, archived
  tags text[] default '{}',
  notes text default '',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Link entities to projects
create table project_entities (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references research_projects(id) on delete cascade,
  entity_type text not null, -- person, group, place, event
  entity_id uuid not null,
  role text default '', -- e.g. "acteur principal", "lieu central"
  created_at timestamptz default now()
);

-- Link sources to projects
create table project_sources (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references research_projects(id) on delete cascade,
  source_id uuid not null references sources(id) on delete cascade,
  relevance text default '', -- e.g. "source principale", "contexte"
  created_at timestamptz default now()
);

-- Open questions / points to verify
create table project_questions (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references research_projects(id) on delete cascade,
  question text not null,
  status text not null default 'open', -- open, answered, abandoned
  answer text default '',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- ENHANCED SOURCES (enrich the existing sources table)
-- ============================================================
alter table sources add column if not exists author_name text default '';
alter table sources add column if not exists production_date jsonb; -- HistoricalDate
alter table sources add column if not exists described_fact_date jsonb; -- HistoricalDate
alter table sources add column if not exists language text default '';
alter table sources add column if not exists archive_reference text default '';
alter table sources add column if not exists archive_fund text default '';
alter table sources add column if not exists repository_name text default '';
alter table sources add column if not exists source_location text default '';
alter table sources add column if not exists reliability_level text default 'unknown'; -- high, medium, low, unknown
alter table sources add column if not exists bias_notes text default '';
alter table sources add column if not exists rights_notes text default '';
alter table sources add column if not exists file_ref text; -- storage path for uploaded file

-- ============================================================
-- SOURCE EXCERPTS (Extraits)
-- ============================================================
create table source_excerpts (
  id uuid primary key default gen_random_uuid(),
  source_id uuid not null references sources(id) on delete cascade,
  excerpt_type text not null default 'text', -- text, image_region, audio_segment, page
  selected_text text default '',
  page_or_location text default '', -- "p. 42", "folio 3r", "00:12:30-00:15:00"
  excerpt_summary text default '',
  classification text not null default 'context', -- proof, clue, context, contradiction, doubt
  importance text not null default 'normal', -- high, normal, low
  -- Links to entities
  linked_entity_type text,
  linked_entity_id uuid,
  tags text[] default '{}',
  notes text default '',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- RESEARCH NOTES (Carnet de recherche)
-- ============================================================
create table research_notes (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references research_projects(id) on delete set null,
  note_type text not null default 'note', -- note, idea, todo, field_note, abandoned_lead
  content text not null,
  linked_object_type text, -- source, person, place, event, group, hypothesis
  linked_object_id uuid,
  tags text[] default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- TRIGGERS
-- ============================================================
create trigger research_projects_updated_at before update on research_projects for each row execute function update_updated_at();
create trigger project_questions_updated_at before update on project_questions for each row execute function update_updated_at();
create trigger source_excerpts_updated_at before update on source_excerpts for each row execute function update_updated_at();
create trigger research_notes_updated_at before update on research_notes for each row execute function update_updated_at();

-- ============================================================
-- RLS (permissive for now)
-- ============================================================
alter table research_projects enable row level security;
alter table project_entities enable row level security;
alter table project_sources enable row level security;
alter table project_questions enable row level security;
alter table source_excerpts enable row level security;
alter table research_notes enable row level security;

create policy "Allow all" on research_projects for all using (true) with check (true);
create policy "Allow all" on project_entities for all using (true) with check (true);
create policy "Allow all" on project_sources for all using (true) with check (true);
create policy "Allow all" on project_questions for all using (true) with check (true);
create policy "Allow all" on source_excerpts for all using (true) with check (true);
create policy "Allow all" on research_notes for all using (true) with check (true);
