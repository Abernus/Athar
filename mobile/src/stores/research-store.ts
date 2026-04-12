import { create } from "zustand";
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
import {
  MOCK_PERSONS,
  MOCK_GROUPS,
  MOCK_PLACES,
  MOCK_EVENTS,
  MOCK_SOURCES,
  MOCK_HYPOTHESES,
  MOCK_RELATIONSHIPS,
  MOCK_ARCHIVE_ITEMS,
  MOCK_ORAL_TESTIMONIES,
} from "@/data/mock";
import { generateId, nowISO } from "@/lib/utils";

interface ResearchState {
  persons: Person[];
  groups: Group[];
  places: Place[];
  events: HistoricalEvent[];
  sources: Source[];
  hypotheses: Hypothesis[];
  relationships: Relationship[];
  archiveItems: ArchiveItem[];
  oralTestimonies: OralTestimony[];

  // Lookups
  getPersonById: (id: string) => Person | undefined;
  getGroupById: (id: string) => Group | undefined;
  getPlaceById: (id: string) => Place | undefined;
  getEventById: (id: string) => HistoricalEvent | undefined;
  getEntityById: (type: EntityType, id: string) => AnyEntity | undefined;
  getEntityDisplayName: (type: EntityType, id: string) => string;
  getRelationshipsFor: (type: EntityType, id: string) => Relationship[];
  getAllEntities: () => AnyEntity[];

  // Mutations (local — will sync to API later)
  addPerson: (data: Omit<Person, "id" | "entityType" | "createdAt" | "updatedAt">) => Person;
  addPlace: (data: Omit<Place, "id" | "entityType" | "createdAt" | "updatedAt">) => Place;
  addEvent: (data: Omit<HistoricalEvent, "id" | "entityType" | "createdAt" | "updatedAt">) => HistoricalEvent;
  addArchiveItem: (data: Omit<ArchiveItem, "id" | "createdAt" | "updatedAt">) => ArchiveItem;
  addOralTestimony: (data: Omit<OralTestimony, "id" | "createdAt" | "updatedAt">) => OralTestimony;
  addRelationship: (data: Omit<Relationship, "id" | "createdAt" | "updatedAt">) => Relationship;

  // Search
  searchAll: (query: string) => AnyEntity[];
}

export const useResearchStore = create<ResearchState>((set, get) => ({
  persons: MOCK_PERSONS,
  groups: MOCK_GROUPS,
  places: MOCK_PLACES,
  events: MOCK_EVENTS,
  sources: MOCK_SOURCES,
  hypotheses: MOCK_HYPOTHESES,
  relationships: MOCK_RELATIONSHIPS,
  archiveItems: MOCK_ARCHIVE_ITEMS,
  oralTestimonies: MOCK_ORAL_TESTIMONIES,

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

  addPerson: (data) => {
    const person: Person = {
      ...data,
      id: generateId(),
      entityType: "person",
      createdAt: nowISO(),
      updatedAt: nowISO(),
    };
    set((s) => ({ persons: [person, ...s.persons] }));
    return person;
  },

  addPlace: (data) => {
    const place: Place = {
      ...data,
      id: generateId(),
      entityType: "place",
      createdAt: nowISO(),
      updatedAt: nowISO(),
    };
    set((s) => ({ places: [place, ...s.places] }));
    return place;
  },

  addEvent: (data) => {
    const event: HistoricalEvent = {
      ...data,
      id: generateId(),
      entityType: "event",
      createdAt: nowISO(),
      updatedAt: nowISO(),
    };
    set((s) => ({ events: [event, ...s.events] }));
    return event;
  },

  addArchiveItem: (data) => {
    const item: ArchiveItem = {
      ...data,
      id: generateId(),
      createdAt: nowISO(),
      updatedAt: nowISO(),
    };
    set((s) => ({ archiveItems: [item, ...s.archiveItems] }));
    return item;
  },

  addOralTestimony: (data) => {
    const testimony: OralTestimony = {
      ...data,
      id: generateId(),
      createdAt: nowISO(),
      updatedAt: nowISO(),
    };
    set((s) => ({ oralTestimonies: [testimony, ...s.oralTestimonies] }));
    return testimony;
  },

  addRelationship: (data) => {
    const rel: Relationship = {
      ...data,
      id: generateId(),
      createdAt: nowISO(),
      updatedAt: nowISO(),
    };
    set((s) => ({ relationships: [rel, ...s.relationships] }));
    return rel;
  },

  searchAll: (query) => {
    const q = query.toLowerCase().trim();
    if (!q) return [];
    const s = get();
    const results: AnyEntity[] = [];
    for (const p of s.persons) {
      if (p.primaryName.toLowerCase().includes(q) || p.alternateNames.some((n) => n.toLowerCase().includes(q)) || p.tags.some((t) => t.toLowerCase().includes(q)))
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
