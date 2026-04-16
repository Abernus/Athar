-- ============================================================
-- Athar V2 — Histoire orale enrichie + Corpus
-- Run AFTER 003. Uses the "athar" schema.
-- ============================================================

set search_path to athar;

-- ============================================================
-- WITNESSES (Fiches témoins)
-- ============================================================
create table witnesses (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  birth_year text default '',
  birth_place text default '',
  current_location text default '',
  relation_to_subject text default '',
  reliability_assessment text default '', -- high, medium, low, unknown
  context_notes text default '',
  consent_status text not null default 'pending', -- pending, obtained, refused, restricted
  consent_notes text default '',
  sensitivity_level text not null default 'normal', -- public, normal, sensitive, confidential
  tags text[] default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- INTERVIEW SESSIONS (Sessions d'entretien)
-- ============================================================
create table interview_sessions (
  id uuid primary key default gen_random_uuid(),
  witness_id uuid references witnesses(id) on delete set null,
  testimony_id uuid references oral_testimonies(id) on delete set null,
  project_id uuid references research_projects(id) on delete set null,
  title text not null,
  date text default '',
  location text default '',
  duration_minutes integer,
  interview_guide text default '',
  simultaneous_notes text default '',
  topics_covered text[] default '{}',
  names_mentioned text[] default '{}',
  places_mentioned text[] default '{}',
  dates_mentioned text[] default '{}',
  follow_up_questions text default '',
  assessment text default '',
  tags text[] default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- FIELD MISSIONS (Missions terrain)
-- ============================================================
create table field_missions (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references research_projects(id) on delete set null,
  title text not null,
  location text default '',
  date_start text default '',
  date_end text default '',
  objectives text default '',
  persons_to_meet text default '',
  places_to_visit text default '',
  archives_to_consult text default '',
  equipment_checklist text default '',
  debrief_notes text default '',
  status text not null default 'planned', -- planned, in_progress, completed
  tags text[] default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- CORPUS DOCUMENTS (Documents de corpus)
-- ============================================================
create table corpus_documents (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references research_projects(id) on delete set null,
  source_id uuid references sources(id) on delete set null,
  title text not null,
  document_type text not null default 'text', -- text, image, pdf, audio, video
  content_text text default '', -- full text content (for search)
  transcription text default '',
  translation text default '',
  language text default '',
  ocr_status text default 'none', -- none, pending, completed, failed
  file_ref text,
  -- Indexed entities found in document
  detected_names text[] default '{}',
  detected_places text[] default '{}',
  detected_dates text[] default '{}',
  detected_organizations text[] default '{}',
  tags text[] default '{}',
  notes text default '',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Full-text search index on corpus documents
create index if not exists corpus_documents_content_idx
  on corpus_documents using gin(to_tsvector('french', coalesce(content_text, '') || ' ' || coalesce(transcription, '') || ' ' || coalesce(title, '')));

-- ============================================================
-- TRIGGERS
-- ============================================================
create trigger witnesses_updated_at before update on witnesses for each row execute function update_updated_at();
create trigger interview_sessions_updated_at before update on interview_sessions for each row execute function update_updated_at();
create trigger field_missions_updated_at before update on field_missions for each row execute function update_updated_at();
create trigger corpus_documents_updated_at before update on corpus_documents for each row execute function update_updated_at();

-- ============================================================
-- RLS
-- ============================================================
alter table witnesses enable row level security;
alter table interview_sessions enable row level security;
alter table field_missions enable row level security;
alter table corpus_documents enable row level security;

create policy "Allow all" on witnesses for all using (true) with check (true);
create policy "Allow all" on interview_sessions for all using (true) with check (true);
create policy "Allow all" on field_missions for all using (true) with check (true);
create policy "Allow all" on corpus_documents for all using (true) with check (true);
