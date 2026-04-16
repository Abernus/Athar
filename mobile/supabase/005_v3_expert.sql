-- ============================================================
-- Athar V3 — Expert features: evidence chains, prosopography,
-- entity suggestions, public publications
-- Run AFTER 004. Uses the "athar" schema.
-- ============================================================

set search_path to athar;

-- ============================================================
-- EVIDENCE CHAINS (Chaînes de preuve)
-- Links claims to their supporting/contesting evidence
-- ============================================================
create table evidence_chains (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references research_projects(id) on delete set null,
  title text not null,
  claim_text text not null,
  claim_status text not null default 'unverified', -- unverified, supported, weakly_supported, contested, refuted
  conclusion text default '',
  tags text[] default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Individual links in the chain
create table evidence_chain_links (
  id uuid primary key default gen_random_uuid(),
  chain_id uuid not null references evidence_chains(id) on delete cascade,
  position integer not null default 0,
  link_type text not null default 'source', -- source, excerpt, testimony, hypothesis, interpretation
  object_type text, -- source, source_excerpt, oral_testimony, hypothesis, archive_item
  object_id uuid,
  description text default '',
  is_supporting boolean not null default true, -- true = supports, false = contests
  strength text not null default 'moderate', -- strong, moderate, weak, speculative
  notes text default '',
  created_at timestamptz default now()
);

-- ============================================================
-- PROSOPOGRAPHY (Fiches prosopographiques)
-- Structured cohort analysis
-- ============================================================
create table prosopography_cohorts (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references research_projects(id) on delete set null,
  title text not null,
  description text default '',
  criteria text default '',
  tags text[] default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Members of a cohort with structured comparable fields
create table prosopography_entries (
  id uuid primary key default gen_random_uuid(),
  cohort_id uuid not null references prosopography_cohorts(id) on delete cascade,
  person_id uuid references persons(id) on delete set null,
  -- Structured fields for comparison
  birth_region text default '',
  social_origin text default '',
  education_level text default '',
  occupation text default '',
  political_affiliation text default '',
  military_service text default '',
  migration_date text default '',
  migration_destination text default '',
  family_status text default '',
  notable_events text default '',
  custom_fields jsonb default '{}',
  notes text default '',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- ENTITY MERGE SUGGESTIONS
-- ============================================================
create table entity_suggestions (
  id uuid primary key default gen_random_uuid(),
  entity_a_type text not null,
  entity_a_id uuid not null,
  entity_b_type text not null,
  entity_b_id uuid not null,
  suggestion_type text not null default 'possible_duplicate', -- possible_duplicate, related, same_identity
  confidence text not null default 'low', -- high, medium, low
  reason text default '',
  status text not null default 'pending', -- pending, accepted, rejected, merged
  resolution_note text default '',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- PUBLIC PUBLICATIONS
-- ============================================================
create table publications (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references research_projects(id) on delete set null,
  title text not null,
  description text default '',
  publication_type text not null default 'dossier', -- dossier, timeline, map, narrative, mini_site
  content_html text default '',
  is_published boolean not null default false,
  published_at timestamptz,
  share_token text unique,
  settings jsonb default '{}',
  tags text[] default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- TRIGGERS
-- ============================================================
create trigger evidence_chains_updated_at before update on evidence_chains for each row execute function update_updated_at();
create trigger prosopography_cohorts_updated_at before update on prosopography_cohorts for each row execute function update_updated_at();
create trigger prosopography_entries_updated_at before update on prosopography_entries for each row execute function update_updated_at();
create trigger entity_suggestions_updated_at before update on entity_suggestions for each row execute function update_updated_at();
create trigger publications_updated_at before update on publications for each row execute function update_updated_at();

-- ============================================================
-- RLS
-- ============================================================
alter table evidence_chains enable row level security;
alter table evidence_chain_links enable row level security;
alter table prosopography_cohorts enable row level security;
alter table prosopography_entries enable row level security;
alter table entity_suggestions enable row level security;
alter table publications enable row level security;

create policy "Allow all" on evidence_chains for all using (true) with check (true);
create policy "Allow all" on evidence_chain_links for all using (true) with check (true);
create policy "Allow all" on prosopography_cohorts for all using (true) with check (true);
create policy "Allow all" on prosopography_entries for all using (true) with check (true);
create policy "Allow all" on entity_suggestions for all using (true) with check (true);
create policy "Allow all" on publications for all using (true) with check (true);
