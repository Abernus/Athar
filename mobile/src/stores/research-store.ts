import { create } from "zustand";
import { supabase } from "@/lib/supabase";
import type {
  Person,
  Group,
  Place,
  HistoricalEvent,
  Source,
  Hypothesis,
  Relationship,
  ArchiveItem,
  OralTestimony,
  AnyEntity,
  EntityType,
  ResearchProject,
  SourceExcerpt,
  ResearchNote,
  Contradiction,
  EntityAlias,
  BibliographyEntry,
  Witness,
  InterviewSession,
  FieldMission,
  CorpusDocument,
} from "@/types";
import { getEntityName } from "@/types";

// --- Supabase row ↔ app type mappers ---

function rowToPerson(r: any): Person {
  return {
    id: r.id,
    entityType: "person",
    primaryName: r.primary_name,
    alternateNames: r.alternate_names ?? [],
    summary: r.summary ?? "",
    birthDate: r.birth_date ?? undefined,
    deathDate: r.death_date ?? undefined,
    gender: r.gender,
    tags: r.tags ?? [],
    notes: r.notes ?? "",
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

function rowToGroup(r: any): Group {
  return {
    id: r.id,
    entityType: "group",
    name: r.name,
    groupType: r.group_type,
    summary: r.summary ?? "",
    timeRange: r.time_range ?? undefined,
    tags: r.tags ?? [],
    notes: r.notes ?? "",
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

function rowToPlace(r: any): Place {
  return {
    id: r.id,
    entityType: "place",
    name: r.name,
    placeType: r.place_type,
    parentPlaceId: r.parent_place_id,
    summary: r.summary ?? "",
    coordinates: r.coordinates ?? undefined,
    tags: r.tags ?? [],
    notes: r.notes ?? "",
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

function rowToEvent(r: any): HistoricalEvent {
  return {
    id: r.id,
    entityType: "event",
    title: r.title,
    eventType: r.event_type,
    description: r.description ?? "",
    dateStart: r.date_start ?? undefined,
    dateEnd: r.date_end ?? undefined,
    placeId: r.place_id,
    tags: r.tags ?? [],
    notes: r.notes ?? "",
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

function rowToRelationship(r: any): Relationship {
  return {
    id: r.id,
    sourceEntityType: r.source_entity_type,
    sourceEntityId: r.source_entity_id,
    targetEntityType: r.target_entity_type,
    targetEntityId: r.target_entity_id,
    relationshipType: r.relationship_type,
    label: r.label,
    confidenceLevel: r.confidence_level,
    notes: r.notes ?? "",
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

function rowToArchiveItem(r: any): ArchiveItem {
  return {
    id: r.id,
    title: r.title,
    archiveType: r.archive_type,
    description: r.description ?? "",
    dateOrPeriod: r.date_or_period ?? undefined,
    fileRef: r.file_ref,
    linkedEntityIds: r.linked_entity_ids ?? [],
    tags: r.tags ?? [],
    notes: r.notes ?? "",
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

function rowToOralTestimony(r: any): OralTestimony {
  return {
    id: r.id,
    title: r.title,
    speaker: r.speaker,
    interviewer: r.interviewer ?? "",
    recordedAt: r.recorded_at ?? undefined,
    summary: r.summary ?? "",
    transcript: r.transcript,
    trustNote: r.trust_note ?? "",
    linkedEntityIds: r.linked_entity_ids ?? [],
    tags: r.tags ?? [],
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

function rowToProject(r: any): ResearchProject {
  return {
    id: r.id,
    title: r.title,
    summary: r.summary ?? "",
    researchQuestion: r.research_question ?? "",
    periodStart: r.period_start,
    periodEnd: r.period_end,
    geographicScope: r.geographic_scope ?? "",
    status: r.status ?? "active",
    tags: r.tags ?? [],
    notes: r.notes ?? "",
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

function rowToSource(r: any): Source {
  return {
    id: r.id,
    title: r.title,
    sourceType: r.source_type,
    origin: r.origin ?? "",
    createdOrPublishedAt: r.created_or_published_at ?? undefined,
    reference: r.reference ?? "",
    summary: r.summary ?? "",
    criticalNote: r.critical_note ?? "",
    tags: r.tags ?? [],
    createdAt: r.created_at,
    updatedAt: r.updated_at,
    // Enhanced fields
    authorName: r.author_name ?? "",
    language: r.language ?? "",
    archiveReference: r.archive_reference ?? "",
    archiveFund: r.archive_fund ?? "",
    repositoryName: r.repository_name ?? "",
    reliabilityLevel: r.reliability_level ?? "unknown",
    biasNotes: r.bias_notes ?? "",
    fileRef: r.file_ref,
  };
}

function rowToExcerpt(r: any): SourceExcerpt {
  return {
    id: r.id,
    sourceId: r.source_id,
    excerptType: r.excerpt_type,
    selectedText: r.selected_text ?? "",
    pageOrLocation: r.page_or_location ?? "",
    excerptSummary: r.excerpt_summary ?? "",
    classification: r.classification ?? "context",
    importance: r.importance ?? "normal",
    linkedEntityType: r.linked_entity_type,
    linkedEntityId: r.linked_entity_id,
    tags: r.tags ?? [],
    notes: r.notes ?? "",
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

function rowToNote(r: any): ResearchNote {
  return {
    id: r.id,
    projectId: r.project_id,
    noteType: r.note_type ?? "note",
    content: r.content,
    linkedObjectType: r.linked_object_type,
    linkedObjectId: r.linked_object_id,
    tags: r.tags ?? [],
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

function rowToHypothesis(r: any): Hypothesis {
  return {
    id: r.id,
    title: r.title,
    description: r.description ?? "",
    status: r.status ?? "draft",
    confidenceLevel: r.confidence_level ?? "uncertain",
    authorId: r.author_id,
    notes: r.notes ?? "",
    tags: r.tags ?? [],
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

function rowToContradiction(r: any): Contradiction {
  return {
    id: r.id,
    projectId: r.project_id,
    title: r.title,
    description: r.description ?? "",
    status: r.status ?? "open",
    resolutionNote: r.resolution_note ?? "",
    sourceAType: r.source_a_type,
    sourceAId: r.source_a_id,
    sourceBType: r.source_b_type,
    sourceBId: r.source_b_id,
    tags: r.tags ?? [],
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

function rowToAlias(r: any): EntityAlias {
  return {
    id: r.id,
    entityType: r.entity_type,
    entityId: r.entity_id,
    alias: r.alias,
    language: r.language ?? "",
    script: r.script ?? "",
    transcriptionSystem: r.transcription_system ?? "",
    notes: r.notes ?? "",
    createdAt: r.created_at,
  };
}

function rowToWitness(r: any): Witness {
  return {
    id: r.id, fullName: r.full_name, birthYear: r.birth_year ?? "",
    birthPlace: r.birth_place ?? "", currentLocation: r.current_location ?? "",
    relationToSubject: r.relation_to_subject ?? "", reliabilityAssessment: r.reliability_assessment ?? "",
    contextNotes: r.context_notes ?? "", consentStatus: r.consent_status ?? "pending",
    consentNotes: r.consent_notes ?? "", sensitivityLevel: r.sensitivity_level ?? "normal",
    tags: r.tags ?? [], createdAt: r.created_at, updatedAt: r.updated_at,
  };
}

function rowToInterviewSession(r: any): InterviewSession {
  return {
    id: r.id, witnessId: r.witness_id, testimonyId: r.testimony_id, projectId: r.project_id,
    title: r.title, date: r.date ?? "", location: r.location ?? "",
    durationMinutes: r.duration_minutes, interviewGuide: r.interview_guide ?? "",
    simultaneousNotes: r.simultaneous_notes ?? "", topicsCovered: r.topics_covered ?? [],
    namesMentioned: r.names_mentioned ?? [], placesMentioned: r.places_mentioned ?? [],
    datesMentioned: r.dates_mentioned ?? [], followUpQuestions: r.follow_up_questions ?? "",
    assessment: r.assessment ?? "", tags: r.tags ?? [],
    createdAt: r.created_at, updatedAt: r.updated_at,
  };
}

function rowToFieldMission(r: any): FieldMission {
  return {
    id: r.id, projectId: r.project_id, title: r.title,
    location: r.location ?? "", dateStart: r.date_start ?? "", dateEnd: r.date_end ?? "",
    objectives: r.objectives ?? "", personsToMeet: r.persons_to_meet ?? "",
    placesToVisit: r.places_to_visit ?? "", archivesToConsult: r.archives_to_consult ?? "",
    equipmentChecklist: r.equipment_checklist ?? "", debriefNotes: r.debrief_notes ?? "",
    status: r.status ?? "planned", tags: r.tags ?? [],
    createdAt: r.created_at, updatedAt: r.updated_at,
  };
}

function rowToCorpusDoc(r: any): CorpusDocument {
  return {
    id: r.id, projectId: r.project_id, sourceId: r.source_id,
    title: r.title, documentType: r.document_type ?? "text",
    contentText: r.content_text ?? "", transcription: r.transcription ?? "",
    translation: r.translation ?? "", language: r.language ?? "",
    ocrStatus: r.ocr_status ?? "none", fileRef: r.file_ref,
    detectedNames: r.detected_names ?? [], detectedPlaces: r.detected_places ?? [],
    detectedDates: r.detected_dates ?? [], detectedOrganizations: r.detected_organizations ?? [],
    tags: r.tags ?? [], notes: r.notes ?? "",
    createdAt: r.created_at, updatedAt: r.updated_at,
  };
}

function rowToBibEntry(r: any): BibliographyEntry {
  return {
    id: r.id,
    projectId: r.project_id,
    entryType: r.entry_type ?? "book",
    title: r.title,
    authors: r.authors ?? "",
    year: r.year ?? "",
    publisher: r.publisher ?? "",
    journal: r.journal ?? "",
    volume: r.volume ?? "",
    pages: r.pages ?? "",
    url: r.url ?? "",
    isbn: r.isbn ?? "",
    abstract: r.abstract ?? "",
    notes: r.notes ?? "",
    tags: r.tags ?? [],
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

// --- Store ---

interface ResearchState {
  // Data
  persons: Person[];
  groups: Group[];
  places: Place[];
  events: HistoricalEvent[];
  sources: Source[];
  hypotheses: Hypothesis[];
  relationships: Relationship[];
  archiveItems: ArchiveItem[];
  oralTestimonies: OralTestimony[];
  projects: ResearchProject[];
  excerpts: SourceExcerpt[];
  researchNotes: ResearchNote[];
  contradictions: Contradiction[];
  entityAliases: EntityAlias[];
  bibliography: BibliographyEntry[];
  witnesses: Witness[];
  interviewSessions: InterviewSession[];
  fieldMissions: FieldMission[];
  corpusDocuments: CorpusDocument[];

  // Loading
  loading: boolean;
  initialized: boolean;

  // Init — fetch all data from Supabase
  fetchAll: () => Promise<void>;

  // Lookups
  getPersonById: (id: string) => Person | undefined;
  getGroupById: (id: string) => Group | undefined;
  getPlaceById: (id: string) => Place | undefined;
  getEventById: (id: string) => HistoricalEvent | undefined;
  getEntityById: (type: EntityType, id: string) => AnyEntity | undefined;
  getEntityDisplayName: (type: EntityType, id: string) => string;
  getRelationshipsFor: (type: EntityType, id: string) => Relationship[];
  getAllEntities: () => AnyEntity[];

  // Mutations — write to Supabase then update local state
  addPerson: (data: Omit<Person, "id" | "entityType" | "createdAt" | "updatedAt">) => Promise<Person | null>;
  addGroup: (data: Omit<Group, "id" | "entityType" | "createdAt" | "updatedAt">) => Promise<Group | null>;
  addPlace: (data: Omit<Place, "id" | "entityType" | "createdAt" | "updatedAt">) => Promise<Place | null>;
  addEvent: (data: Omit<HistoricalEvent, "id" | "entityType" | "createdAt" | "updatedAt">) => Promise<HistoricalEvent | null>;
  addArchiveItem: (data: Omit<ArchiveItem, "id" | "createdAt" | "updatedAt">) => Promise<ArchiveItem | null>;
  addOralTestimony: (data: Omit<OralTestimony, "id" | "createdAt" | "updatedAt">) => Promise<OralTestimony | null>;
  addRelationship: (data: Omit<Relationship, "id" | "createdAt" | "updatedAt">) => Promise<Relationship | null>;
  addProject: (data: Omit<ResearchProject, "id" | "createdAt" | "updatedAt">) => Promise<ResearchProject | null>;
  addSource: (data: Omit<Source, "id" | "createdAt" | "updatedAt">) => Promise<Source | null>;
  addExcerpt: (data: Omit<SourceExcerpt, "id" | "createdAt" | "updatedAt">) => Promise<SourceExcerpt | null>;
  addResearchNote: (data: Omit<ResearchNote, "id" | "createdAt" | "updatedAt">) => Promise<ResearchNote | null>;
  addHypothesis: (data: Omit<Hypothesis, "id" | "createdAt" | "updatedAt">) => Promise<Hypothesis | null>;
  deleteEntity: (type: EntityType, id: string) => Promise<boolean>;
  deleteProject: (id: string) => Promise<boolean>;
  deleteSource: (id: string) => Promise<boolean>;
  deleteHypothesis: (id: string) => Promise<boolean>;
  addContradiction: (data: Omit<Contradiction, "id" | "createdAt" | "updatedAt">) => Promise<Contradiction | null>;
  addEntityAlias: (data: Omit<EntityAlias, "id" | "createdAt">) => Promise<EntityAlias | null>;
  addBibEntry: (data: Omit<BibliographyEntry, "id" | "createdAt" | "updatedAt">) => Promise<BibliographyEntry | null>;
  getAliasesFor: (entityType: EntityType, entityId: string) => EntityAlias[];
  addWitness: (data: Omit<Witness, "id" | "createdAt" | "updatedAt">) => Promise<Witness | null>;
  addInterviewSession: (data: Omit<InterviewSession, "id" | "createdAt" | "updatedAt">) => Promise<InterviewSession | null>;
  addFieldMission: (data: Omit<FieldMission, "id" | "createdAt" | "updatedAt">) => Promise<FieldMission | null>;
  addCorpusDocument: (data: Omit<CorpusDocument, "id" | "createdAt" | "updatedAt">) => Promise<CorpusDocument | null>;
  searchCorpus: (query: string) => CorpusDocument[];

  // Search
  searchAll: (query: string) => AnyEntity[];
}

export const useResearchStore = create<ResearchState>((set, get) => ({
  persons: [],
  groups: [],
  places: [],
  events: [],
  sources: [],
  hypotheses: [],
  relationships: [],
  archiveItems: [],
  oralTestimonies: [],
  projects: [],
  excerpts: [],
  researchNotes: [],
  contradictions: [],
  entityAliases: [],
  bibliography: [],
  witnesses: [],
  interviewSessions: [],
  fieldMissions: [],
  corpusDocuments: [],
  loading: false,
  initialized: false,

  fetchAll: async () => {
    set({ loading: true });
    const [persons, groups, places, events, relationships, archiveItems, oralTestimonies, projects, sources, excerpts, researchNotes, hypotheses, contradictions, entityAliases, bibliography, witnesses, interviewSessions, fieldMissions, corpusDocuments] =
      await Promise.all([
        supabase.from("persons").select("*").order("created_at", { ascending: false }),
        supabase.from("groups").select("*").order("created_at", { ascending: false }),
        supabase.from("places").select("*").order("created_at", { ascending: false }),
        supabase.from("events").select("*").order("created_at", { ascending: false }),
        supabase.from("relationships").select("*").order("created_at", { ascending: false }),
        supabase.from("archive_items").select("*").order("created_at", { ascending: false }),
        supabase.from("oral_testimonies").select("*").order("created_at", { ascending: false }),
        supabase.from("research_projects").select("*").order("created_at", { ascending: false }),
        supabase.from("sources").select("*").order("created_at", { ascending: false }),
        supabase.from("source_excerpts").select("*").order("created_at", { ascending: false }),
        supabase.from("research_notes").select("*").order("created_at", { ascending: false }),
        supabase.from("hypotheses").select("*").order("created_at", { ascending: false }),
        supabase.from("contradictions").select("*").order("created_at", { ascending: false }),
        supabase.from("entity_aliases").select("*").order("created_at", { ascending: false }),
        supabase.from("bibliography_entries").select("*").order("created_at", { ascending: false }),
        supabase.from("witnesses").select("*").order("created_at", { ascending: false }),
        supabase.from("interview_sessions").select("*").order("created_at", { ascending: false }),
        supabase.from("field_missions").select("*").order("created_at", { ascending: false }),
        supabase.from("corpus_documents").select("*").order("created_at", { ascending: false }),
      ]);
    set({
      persons: (persons.data ?? []).map(rowToPerson),
      groups: (groups.data ?? []).map(rowToGroup),
      places: (places.data ?? []).map(rowToPlace),
      events: (events.data ?? []).map(rowToEvent),
      relationships: (relationships.data ?? []).map(rowToRelationship),
      archiveItems: (archiveItems.data ?? []).map(rowToArchiveItem),
      oralTestimonies: (oralTestimonies.data ?? []).map(rowToOralTestimony),
      projects: (projects.data ?? []).map(rowToProject),
      sources: (sources.data ?? []).map(rowToSource),
      excerpts: (excerpts.data ?? []).map(rowToExcerpt),
      researchNotes: (researchNotes.data ?? []).map(rowToNote),
      hypotheses: (hypotheses.data ?? []).map(rowToHypothesis),
      contradictions: (contradictions.data ?? []).map(rowToContradiction),
      entityAliases: (entityAliases.data ?? []).map(rowToAlias),
      bibliography: (bibliography.data ?? []).map(rowToBibEntry),
      witnesses: (witnesses.data ?? []).map(rowToWitness),
      interviewSessions: (interviewSessions.data ?? []).map(rowToInterviewSession),
      fieldMissions: (fieldMissions.data ?? []).map(rowToFieldMission),
      corpusDocuments: (corpusDocuments.data ?? []).map(rowToCorpusDoc),
      loading: false,
      initialized: true,
    });
  },

  getPersonById: (id) => get().persons.find((p) => p.id === id),
  getGroupById: (id) => get().groups.find((g) => g.id === id),
  getPlaceById: (id) => get().places.find((p) => p.id === id),
  getEventById: (id) => get().events.find((e) => e.id === id),

  getEntityById: (type, id) => {
    const s = get();
    switch (type) {
      case "person": return s.persons.find((p) => p.id === id);
      case "group": return s.groups.find((g) => g.id === id);
      case "place": return s.places.find((p) => p.id === id);
      case "event": return s.events.find((e) => e.id === id);
    }
  },

  getEntityDisplayName: (type, id) => {
    const entity = get().getEntityById(type, id);
    return entity ? getEntityName(entity) : "Inconnu";
  },

  getRelationshipsFor: (type, id) =>
    get().relationships.filter(
      (r) =>
        (r.sourceEntityType === type && r.sourceEntityId === id) ||
        (r.targetEntityType === type && r.targetEntityId === id)
    ),

  getAllEntities: () => {
    const s = get();
    return [...s.persons, ...s.groups, ...s.places, ...s.events];
  },

  addPerson: async (data) => {
    const { data: rows, error } = await supabase
      .from("persons")
      .insert({
        primary_name: data.primaryName,
        alternate_names: data.alternateNames,
        summary: data.summary,
        birth_date: data.birthDate ?? null,
        death_date: data.deathDate ?? null,
        gender: data.gender,
        tags: data.tags,
        notes: data.notes,
      })
      .select()
      .single();
    if (error || !rows) { console.error("addPerson:", error); return null; }
    const person = rowToPerson(rows);
    set((s) => ({ persons: [person, ...s.persons] }));
    return person;
  },

  addGroup: async (data) => {
    const { data: rows, error } = await supabase
      .from("groups")
      .insert({
        name: data.name,
        group_type: data.groupType,
        summary: data.summary,
        time_range: data.timeRange ?? null,
        tags: data.tags,
        notes: data.notes,
      })
      .select()
      .single();
    if (error || !rows) { console.error("addGroup:", error); return null; }
    const group = rowToGroup(rows);
    set((s) => ({ groups: [group, ...s.groups] }));
    return group;
  },

  addPlace: async (data) => {
    const { data: rows, error } = await supabase
      .from("places")
      .insert({
        name: data.name,
        place_type: data.placeType,
        parent_place_id: data.parentPlaceId ?? null,
        summary: data.summary,
        coordinates: data.coordinates ?? null,
        tags: data.tags,
        notes: data.notes,
      })
      .select()
      .single();
    if (error || !rows) { console.error("addPlace:", error); return null; }
    const place = rowToPlace(rows);
    set((s) => ({ places: [place, ...s.places] }));
    return place;
  },

  addEvent: async (data) => {
    const { data: rows, error } = await supabase
      .from("events")
      .insert({
        title: data.title,
        event_type: data.eventType,
        description: data.description,
        date_start: data.dateStart ?? null,
        date_end: data.dateEnd ?? null,
        place_id: data.placeId ?? null,
        tags: data.tags,
        notes: data.notes,
      })
      .select()
      .single();
    if (error || !rows) { console.error("addEvent:", error); return null; }
    const event = rowToEvent(rows);
    set((s) => ({ events: [event, ...s.events] }));
    return event;
  },

  addArchiveItem: async (data) => {
    const { data: rows, error } = await supabase
      .from("archive_items")
      .insert({
        title: data.title,
        archive_type: data.archiveType,
        description: data.description,
        date_or_period: data.dateOrPeriod ?? null,
        file_ref: data.fileRef ?? null,
        linked_entity_ids: data.linkedEntityIds,
        tags: data.tags,
        notes: data.notes,
      })
      .select()
      .single();
    if (error || !rows) { console.error("addArchiveItem:", error); return null; }
    const item = rowToArchiveItem(rows);
    set((s) => ({ archiveItems: [item, ...s.archiveItems] }));
    return item;
  },

  addOralTestimony: async (data) => {
    const { data: rows, error } = await supabase
      .from("oral_testimonies")
      .insert({
        title: data.title,
        speaker: data.speaker,
        interviewer: data.interviewer,
        summary: data.summary,
        transcript: data.transcript ?? null,
        trust_note: data.trustNote,
        linked_entity_ids: data.linkedEntityIds,
        tags: data.tags,
      })
      .select()
      .single();
    if (error || !rows) { console.error("addOralTestimony:", error); return null; }
    const testimony = rowToOralTestimony(rows);
    set((s) => ({ oralTestimonies: [testimony, ...s.oralTestimonies] }));
    return testimony;
  },

  addRelationship: async (data) => {
    const { data: rows, error } = await supabase
      .from("relationships")
      .insert({
        source_entity_type: data.sourceEntityType,
        source_entity_id: data.sourceEntityId,
        target_entity_type: data.targetEntityType,
        target_entity_id: data.targetEntityId,
        relationship_type: data.relationshipType,
        label: data.label ?? null,
        confidence_level: data.confidenceLevel,
        notes: data.notes,
      })
      .select()
      .single();
    if (error || !rows) { console.error("addRelationship:", error); return null; }
    const rel = rowToRelationship(rows);
    set((s) => ({ relationships: [rel, ...s.relationships] }));
    return rel;
  },

  addProject: async (data) => {
    const { data: rows, error } = await supabase
      .from("research_projects")
      .insert({
        title: data.title,
        summary: data.summary,
        research_question: data.researchQuestion,
        period_start: data.periodStart ?? null,
        period_end: data.periodEnd ?? null,
        geographic_scope: data.geographicScope,
        status: data.status,
        tags: data.tags,
        notes: data.notes,
      })
      .select()
      .single();
    if (error || !rows) { console.error("addProject:", error); return null; }
    const project = rowToProject(rows);
    set((s) => ({ projects: [project, ...s.projects] }));
    return project;
  },

  addSource: async (data) => {
    const { data: rows, error } = await supabase
      .from("sources")
      .insert({
        title: data.title,
        source_type: data.sourceType,
        origin: data.origin,
        created_or_published_at: data.createdOrPublishedAt ?? null,
        reference: data.reference,
        summary: data.summary,
        critical_note: data.criticalNote,
        author_name: data.authorName ?? "",
        language: data.language ?? "",
        archive_reference: data.archiveReference ?? "",
        archive_fund: data.archiveFund ?? "",
        repository_name: data.repositoryName ?? "",
        reliability_level: data.reliabilityLevel ?? "unknown",
        bias_notes: data.biasNotes ?? "",
        file_ref: data.fileRef ?? null,
        tags: data.tags,
      })
      .select()
      .single();
    if (error || !rows) { console.error("addSource:", error); return null; }
    const source = rowToSource(rows);
    set((s) => ({ sources: [source, ...s.sources] }));
    return source;
  },

  addExcerpt: async (data) => {
    const { data: rows, error } = await supabase
      .from("source_excerpts")
      .insert({
        source_id: data.sourceId,
        excerpt_type: data.excerptType,
        selected_text: data.selectedText,
        page_or_location: data.pageOrLocation,
        excerpt_summary: data.excerptSummary,
        classification: data.classification,
        importance: data.importance,
        linked_entity_type: data.linkedEntityType ?? null,
        linked_entity_id: data.linkedEntityId ?? null,
        tags: data.tags,
        notes: data.notes,
      })
      .select()
      .single();
    if (error || !rows) { console.error("addExcerpt:", error); return null; }
    const excerpt = rowToExcerpt(rows);
    set((s) => ({ excerpts: [excerpt, ...s.excerpts] }));
    return excerpt;
  },

  addResearchNote: async (data) => {
    const { data: rows, error } = await supabase
      .from("research_notes")
      .insert({
        project_id: data.projectId ?? null,
        note_type: data.noteType,
        content: data.content,
        linked_object_type: data.linkedObjectType ?? null,
        linked_object_id: data.linkedObjectId ?? null,
        tags: data.tags,
      })
      .select()
      .single();
    if (error || !rows) { console.error("addResearchNote:", error); return null; }
    const note = rowToNote(rows);
    set((s) => ({ researchNotes: [note, ...s.researchNotes] }));
    return note;
  },

  deleteProject: async (id) => {
    const { error } = await supabase.from("research_projects").delete().eq("id", id);
    if (error) { console.error("deleteProject:", error); return false; }
    set((s) => ({ projects: s.projects.filter((p) => p.id !== id) }));
    return true;
  },

  deleteSource: async (id) => {
    const { error } = await supabase.from("sources").delete().eq("id", id);
    if (error) { console.error("deleteSource:", error); return false; }
    set((s) => ({
      sources: s.sources.filter((s2) => s2.id !== id),
      excerpts: s.excerpts.filter((e) => e.sourceId !== id),
    }));
    return true;
  },

  addHypothesis: async (data) => {
    const { data: rows, error } = await supabase
      .from("hypotheses")
      .insert({
        title: data.title,
        description: data.description,
        status: data.status,
        confidence_level: data.confidenceLevel,
        author_id: data.authorId ?? null,
        notes: data.notes,
        tags: data.tags,
      })
      .select()
      .single();
    if (error || !rows) { console.error("addHypothesis:", error); return null; }
    const hypothesis = rowToHypothesis(rows);
    set((s) => ({ hypotheses: [hypothesis, ...s.hypotheses] }));
    return hypothesis;
  },

  deleteHypothesis: async (id) => {
    const { error } = await supabase.from("hypotheses").delete().eq("id", id);
    if (error) { console.error("deleteHypothesis:", error); return false; }
    set((s) => ({ hypotheses: s.hypotheses.filter((h) => h.id !== id) }));
    return true;
  },

  addContradiction: async (data) => {
    const { data: rows, error } = await supabase
      .from("contradictions")
      .insert({
        project_id: data.projectId ?? null,
        title: data.title,
        description: data.description,
        status: data.status,
        resolution_note: data.resolutionNote,
        source_a_type: data.sourceAType ?? null,
        source_a_id: data.sourceAId ?? null,
        source_b_type: data.sourceBType ?? null,
        source_b_id: data.sourceBId ?? null,
        tags: data.tags,
      })
      .select()
      .single();
    if (error || !rows) { console.error("addContradiction:", error); return null; }
    const c = rowToContradiction(rows);
    set((s) => ({ contradictions: [c, ...s.contradictions] }));
    return c;
  },

  addEntityAlias: async (data) => {
    const { data: rows, error } = await supabase
      .from("entity_aliases")
      .insert({
        entity_type: data.entityType,
        entity_id: data.entityId,
        alias: data.alias,
        language: data.language,
        script: data.script,
        transcription_system: data.transcriptionSystem,
        notes: data.notes,
      })
      .select()
      .single();
    if (error || !rows) { console.error("addEntityAlias:", error); return null; }
    const a = rowToAlias(rows);
    set((s) => ({ entityAliases: [a, ...s.entityAliases] }));
    return a;
  },

  addBibEntry: async (data) => {
    const { data: rows, error } = await supabase
      .from("bibliography_entries")
      .insert({
        project_id: data.projectId ?? null,
        entry_type: data.entryType,
        title: data.title,
        authors: data.authors,
        year: data.year,
        publisher: data.publisher,
        journal: data.journal,
        volume: data.volume,
        pages: data.pages,
        url: data.url,
        isbn: data.isbn,
        abstract: data.abstract,
        notes: data.notes,
        tags: data.tags,
      })
      .select()
      .single();
    if (error || !rows) { console.error("addBibEntry:", error); return null; }
    const b = rowToBibEntry(rows);
    set((s) => ({ bibliography: [b, ...s.bibliography] }));
    return b;
  },

  getAliasesFor: (entityType, entityId) =>
    get().entityAliases.filter((a) => a.entityType === entityType && a.entityId === entityId),

  addWitness: async (data) => {
    const { data: rows, error } = await supabase.from("witnesses").insert({
      full_name: data.fullName, birth_year: data.birthYear, birth_place: data.birthPlace,
      current_location: data.currentLocation, relation_to_subject: data.relationToSubject,
      reliability_assessment: data.reliabilityAssessment, context_notes: data.contextNotes,
      consent_status: data.consentStatus, consent_notes: data.consentNotes,
      sensitivity_level: data.sensitivityLevel, tags: data.tags,
    }).select().single();
    if (error || !rows) { console.error("addWitness:", error); return null; }
    const w = rowToWitness(rows);
    set((s) => ({ witnesses: [w, ...s.witnesses] }));
    return w;
  },

  addInterviewSession: async (data) => {
    const { data: rows, error } = await supabase.from("interview_sessions").insert({
      witness_id: data.witnessId ?? null, testimony_id: data.testimonyId ?? null,
      project_id: data.projectId ?? null, title: data.title, date: data.date,
      location: data.location, duration_minutes: data.durationMinutes ?? null,
      interview_guide: data.interviewGuide, simultaneous_notes: data.simultaneousNotes,
      topics_covered: data.topicsCovered, names_mentioned: data.namesMentioned,
      places_mentioned: data.placesMentioned, dates_mentioned: data.datesMentioned,
      follow_up_questions: data.followUpQuestions, assessment: data.assessment, tags: data.tags,
    }).select().single();
    if (error || !rows) { console.error("addInterviewSession:", error); return null; }
    const s2 = rowToInterviewSession(rows);
    set((s) => ({ interviewSessions: [s2, ...s.interviewSessions] }));
    return s2;
  },

  addFieldMission: async (data) => {
    const { data: rows, error } = await supabase.from("field_missions").insert({
      project_id: data.projectId ?? null, title: data.title, location: data.location,
      date_start: data.dateStart, date_end: data.dateEnd, objectives: data.objectives,
      persons_to_meet: data.personsToMeet, places_to_visit: data.placesToVisit,
      archives_to_consult: data.archivesToConsult, equipment_checklist: data.equipmentChecklist,
      debrief_notes: data.debriefNotes, status: data.status, tags: data.tags,
    }).select().single();
    if (error || !rows) { console.error("addFieldMission:", error); return null; }
    const m = rowToFieldMission(rows);
    set((s) => ({ fieldMissions: [m, ...s.fieldMissions] }));
    return m;
  },

  addCorpusDocument: async (data) => {
    const { data: rows, error } = await supabase.from("corpus_documents").insert({
      project_id: data.projectId ?? null, source_id: data.sourceId ?? null,
      title: data.title, document_type: data.documentType, content_text: data.contentText,
      transcription: data.transcription, translation: data.translation, language: data.language,
      ocr_status: data.ocrStatus, file_ref: data.fileRef ?? null,
      detected_names: data.detectedNames, detected_places: data.detectedPlaces,
      detected_dates: data.detectedDates, detected_organizations: data.detectedOrganizations,
      tags: data.tags, notes: data.notes,
    }).select().single();
    if (error || !rows) { console.error("addCorpusDocument:", error); return null; }
    const d = rowToCorpusDoc(rows);
    set((s) => ({ corpusDocuments: [d, ...s.corpusDocuments] }));
    return d;
  },

  searchCorpus: (query) => {
    const q = query.toLowerCase().trim();
    if (!q) return [];
    return get().corpusDocuments.filter((d) =>
      d.title.toLowerCase().includes(q) ||
      d.contentText.toLowerCase().includes(q) ||
      d.transcription.toLowerCase().includes(q) ||
      d.detectedNames.some((n) => n.toLowerCase().includes(q)) ||
      d.detectedPlaces.some((p) => p.toLowerCase().includes(q))
    );
  },

  deleteEntity: async (type, id) => {
    const table = { person: "persons", group: "groups", place: "places", event: "events" }[type];
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) { console.error("deleteEntity:", error); return false; }
    // Also delete related relationships
    await supabase.from("relationships").delete().or(
      `and(source_entity_type.eq.${type},source_entity_id.eq.${id}),and(target_entity_type.eq.${type},target_entity_id.eq.${id})`
    );
    set((s) => {
      const key = { person: "persons", group: "groups", place: "places", event: "events" }[type] as keyof typeof s;
      return {
        [key]: (s[key] as AnyEntity[]).filter((e) => e.id !== id),
        relationships: s.relationships.filter(
          (r) => !(r.sourceEntityType === type && r.sourceEntityId === id) &&
                 !(r.targetEntityType === type && r.targetEntityId === id)
        ),
      };
    });
    return true;
  },

  searchAll: (query) => {
    const q = query.toLowerCase().trim();
    if (!q) return [];
    const s = get();
    const results: AnyEntity[] = [];
    for (const p of s.persons) {
      if (
        p.primaryName.toLowerCase().includes(q) ||
        p.alternateNames.some((n) => n.toLowerCase().includes(q)) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
      )
        results.push(p);
    }
    for (const g of s.groups) {
      if (g.name.toLowerCase().includes(q) || g.tags.some((t) => t.toLowerCase().includes(q)))
        results.push(g);
    }
    for (const pl of s.places) {
      if (pl.name.toLowerCase().includes(q) || pl.tags.some((t) => t.toLowerCase().includes(q)))
        results.push(pl);
    }
    for (const ev of s.events) {
      if (ev.title.toLowerCase().includes(q) || ev.tags.some((t) => t.toLowerCase().includes(q)))
        results.push(ev);
    }
    return results;
  },
}));
