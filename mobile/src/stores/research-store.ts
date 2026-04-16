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
  addPlace: (data: Omit<Place, "id" | "entityType" | "createdAt" | "updatedAt">) => Promise<Place | null>;
  addEvent: (data: Omit<HistoricalEvent, "id" | "entityType" | "createdAt" | "updatedAt">) => Promise<HistoricalEvent | null>;
  addArchiveItem: (data: Omit<ArchiveItem, "id" | "createdAt" | "updatedAt">) => Promise<ArchiveItem | null>;
  addOralTestimony: (data: Omit<OralTestimony, "id" | "createdAt" | "updatedAt">) => Promise<OralTestimony | null>;
  addRelationship: (data: Omit<Relationship, "id" | "createdAt" | "updatedAt">) => Promise<Relationship | null>;

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
  loading: false,
  initialized: false,

  fetchAll: async () => {
    set({ loading: true });
    const [persons, groups, places, events, relationships, archiveItems, oralTestimonies] =
      await Promise.all([
        supabase.from("persons").select("*").order("created_at", { ascending: false }),
        supabase.from("groups").select("*").order("created_at", { ascending: false }),
        supabase.from("places").select("*").order("created_at", { ascending: false }),
        supabase.from("events").select("*").order("created_at", { ascending: false }),
        supabase.from("relationships").select("*").order("created_at", { ascending: false }),
        supabase.from("archive_items").select("*").order("created_at", { ascending: false }),
        supabase.from("oral_testimonies").select("*").order("created_at", { ascending: false }),
      ]);
    set({
      persons: (persons.data ?? []).map(rowToPerson),
      groups: (groups.data ?? []).map(rowToGroup),
      places: (places.data ?? []).map(rowToPlace),
      events: (events.data ?? []).map(rowToEvent),
      relationships: (relationships.data ?? []).map(rowToRelationship),
      archiveItems: (archiveItems.data ?? []).map(rowToArchiveItem),
      oralTestimonies: (oralTestimonies.data ?? []).map(rowToOralTestimony),
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
