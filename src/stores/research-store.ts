"use client";

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

  // Lookups
  getPersonById: (id: string) => Person | undefined;
  getGroupById: (id: string) => Group | undefined;
  getPlaceById: (id: string) => Place | undefined;
  getEventById: (id: string) => HistoricalEvent | undefined;
  getSourceById: (id: string) => Source | undefined;
  getHypothesisById: (id: string) => Hypothesis | undefined;
  getEntityById: (type: EntityType, id: string) => AnyEntity | undefined;
  getEntityName: (type: EntityType, id: string) => string;
  getRelationshipsFor: (entityType: EntityType, entityId: string) => Relationship[];

  // Search
  searchEntities: (query: string) => AnyEntity[];
  searchAll: (query: string) => {
    entities: AnyEntity[];
    sources: Source[];
    hypotheses: Hypothesis[];
    archives: ArchiveItem[];
    testimonies: OralTestimony[];
  };
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
  getSourceById: (id) => get().sources.find((s) => s.id === id),
  getHypothesisById: (id) => get().hypotheses.find((h) => h.id === id),

  getEntityById: (type, id) => {
    const state = get();
    switch (type) {
      case "person":
        return state.persons.find((p) => p.id === id);
      case "group":
        return state.groups.find((g) => g.id === id);
      case "place":
        return state.places.find((p) => p.id === id);
      case "event":
        return state.events.find((e) => e.id === id);
    }
  },

  getEntityName: (type, id) => {
    const entity = get().getEntityById(type, id);
    if (!entity) return "Inconnu";
    return getEntityName(entity);
  },

  getRelationshipsFor: (entityType, entityId) => {
    return get().relationships.filter(
      (r) =>
        (r.sourceEntityType === entityType && r.sourceEntityId === entityId) ||
        (r.targetEntityType === entityType && r.targetEntityId === entityId)
    );
  },

  searchEntities: (query) => {
    const q = query.toLowerCase();
    const state = get();
    const results: AnyEntity[] = [];

    for (const p of state.persons) {
      if (
        p.primaryName.toLowerCase().includes(q) ||
        p.alternateNames.some((n) => n.toLowerCase().includes(q)) ||
        p.summary.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
      ) {
        results.push(p);
      }
    }
    for (const g of state.groups) {
      if (
        g.name.toLowerCase().includes(q) ||
        g.summary.toLowerCase().includes(q) ||
        g.tags.some((t) => t.toLowerCase().includes(q))
      ) {
        results.push(g);
      }
    }
    for (const pl of state.places) {
      if (
        pl.name.toLowerCase().includes(q) ||
        pl.summary.toLowerCase().includes(q) ||
        pl.tags.some((t) => t.toLowerCase().includes(q))
      ) {
        results.push(pl);
      }
    }
    for (const ev of state.events) {
      if (
        ev.title.toLowerCase().includes(q) ||
        ev.description.toLowerCase().includes(q) ||
        ev.tags.some((t) => t.toLowerCase().includes(q))
      ) {
        results.push(ev);
      }
    }

    return results;
  },

  searchAll: (query) => {
    const q = query.toLowerCase();
    const state = get();

    return {
      entities: state.searchEntities(query),
      sources: state.sources.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.summary.toLowerCase().includes(q) ||
          s.tags.some((t) => t.toLowerCase().includes(q))
      ),
      hypotheses: state.hypotheses.filter(
        (h) =>
          h.title.toLowerCase().includes(q) ||
          h.description.toLowerCase().includes(q) ||
          h.tags.some((t) => t.toLowerCase().includes(q))
      ),
      archives: state.archiveItems.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q) ||
          a.tags.some((t) => t.toLowerCase().includes(q))
      ),
      testimonies: state.oralTestimonies.filter(
        (ot) =>
          ot.title.toLowerCase().includes(q) ||
          ot.speaker.toLowerCase().includes(q) ||
          ot.summary.toLowerCase().includes(q) ||
          ot.tags.some((t) => t.toLowerCase().includes(q))
      ),
    };
  },
}));
