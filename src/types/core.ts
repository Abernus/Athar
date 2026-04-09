// ============================================================
// Historiens — Core Types
// All fundamental types for the historical research platform.
// ============================================================

// --- Temporal primitives ---

export type DatePrecision =
  | "exact"
  | "estimated"
  | "approximate"
  | "before"
  | "after"
  | "decade"
  | "century"
  | "interval"
  | "unknown";

export interface HistoricalDate {
  value: string; // ISO date string or free text like "vers 1890"
  precision: DatePrecision;
  display?: string; // Human-readable form, e.g. "vers 1890", "avant 1962"
}

// --- Statuses and confidence ---

export type ConfidenceLevel =
  | "confirmed"
  | "probable"
  | "uncertain"
  | "contested"
  | "abandoned";

export type HypothesisStatus =
  | "draft"
  | "open"
  | "argued"
  | "provisionally_validated"
  | "rejected";

export type SourceType =
  | "primary"
  | "secondary"
  | "testimony"
  | "private_archive"
  | "internal_note"
  | "other";

export type ArchiveType =
  | "act"
  | "letter"
  | "photo"
  | "notebook"
  | "administrative"
  | "article"
  | "register"
  | "map"
  | "audio_recording"
  | "transcript"
  | "other";

export type RelationshipType =
  | "kinship"
  | "alliance"
  | "neighborhood"
  | "membership"
  | "function"
  | "institutional"
  | "participation"
  | "dependency"
  | "transmission"
  | "probable"
  | "economic"
  | "religious"
  | "military"
  | "political"
  | "social"
  | "other";

export type EntityType = "person" | "group" | "place" | "event";

// --- Base entity ---

interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  notes: string;
}

// --- Person ---

export interface Person extends BaseEntity {
  entityType: "person";
  primaryName: string;
  alternateNames: string[];
  summary: string;
  birthDate?: HistoricalDate;
  deathDate?: HistoricalDate;
  gender?: string;
}

// --- Group ---

export type GroupType =
  | "family"
  | "lineage"
  | "tribe"
  | "institution"
  | "community"
  | "association"
  | "political"
  | "religious"
  | "military"
  | "economic"
  | "other";

export interface Group extends BaseEntity {
  entityType: "group";
  name: string;
  groupType: GroupType;
  summary: string;
  timeRange?: { start?: HistoricalDate; end?: HistoricalDate };
}

// --- Place ---

export type PlaceType =
  | "village"
  | "city"
  | "region"
  | "country"
  | "neighborhood"
  | "building"
  | "site"
  | "other";

export interface Place extends BaseEntity {
  entityType: "place";
  name: string;
  placeType: PlaceType;
  parentPlaceId?: string;
  summary: string;
  coordinates?: { lat: number; lng: number };
}

// --- HistoricalEvent ---

export type EventType =
  | "birth"
  | "death"
  | "marriage"
  | "migration"
  | "conflict"
  | "founding"
  | "political"
  | "economic"
  | "religious"
  | "social"
  | "cultural"
  | "legal"
  | "other";

export interface HistoricalEvent extends BaseEntity {
  entityType: "event";
  title: string;
  eventType: EventType;
  description: string;
  dateStart?: HistoricalDate;
  dateEnd?: HistoricalDate;
  placeId?: string;
}

// --- Relationship ---

export interface Relationship {
  id: string;
  sourceEntityType: EntityType;
  sourceEntityId: string;
  targetEntityType: EntityType;
  targetEntityId: string;
  relationshipType: RelationshipType;
  label?: string; // e.g. "father", "president", "neighbor"
  confidenceLevel: ConfidenceLevel;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

// --- Source ---

export interface Source {
  id: string;
  title: string;
  sourceType: SourceType;
  origin: string;
  createdOrPublishedAt?: HistoricalDate;
  reference: string;
  summary: string;
  criticalNote: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// --- SourceExcerpt ---

export interface SourceExcerpt {
  id: string;
  sourceId: string;
  excerptText: string;
  pageOrLocation: string;
  note: string;
}

// --- Claim ---

export type ClaimType =
  | "birth_date"
  | "death_date"
  | "birth_place"
  | "occupation"
  | "affiliation"
  | "residence"
  | "event_participation"
  | "name_variant"
  | "attribute"
  | "other";

export interface Claim {
  id: string;
  entityType: EntityType;
  entityId: string;
  claimType: ClaimType;
  valueText: string;
  confidenceLevel: ConfidenceLevel;
  note: string;
  createdAt: string;
  updatedAt: string;
}

// --- Hypothesis ---

export interface Hypothesis {
  id: string;
  title: string;
  description: string;
  status: HypothesisStatus;
  confidenceLevel: ConfidenceLevel;
  authorId?: string;
  notes: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// --- EvidenceLink ---

export type EvidenceLinkableType =
  | "source"
  | "source_excerpt"
  | "archive_item"
  | "oral_testimony";

export type EvidenceTargetType =
  | "claim"
  | "hypothesis"
  | "relationship"
  | "person"
  | "group"
  | "place"
  | "event";

export interface EvidenceLink {
  id: string;
  sourceType: EvidenceLinkableType;
  sourceId: string;
  targetType: EvidenceTargetType;
  targetId: string;
  rationale: string;
  confidenceLevel: ConfidenceLevel;
  createdAt: string;
}

// --- ArchiveItem ---

export interface ArchiveItem {
  id: string;
  title: string;
  archiveType: ArchiveType;
  description: string;
  dateOrPeriod?: HistoricalDate;
  fileRef?: string;
  linkedEntityIds: { entityType: EntityType; entityId: string }[];
  tags: string[];
  notes: string;
  createdAt: string;
  updatedAt: string;
}

// --- OralTestimony ---

export interface OralTestimony {
  id: string;
  title: string;
  speaker: string;
  interviewer: string;
  recordedAt?: HistoricalDate;
  summary: string;
  transcript?: string;
  trustNote: string;
  linkedEntityIds: { entityType: EntityType; entityId: string }[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// --- ProjectWorkspace ---

export interface ProjectWorkspace {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

// --- Union type for any entity ---

export type AnyEntity = Person | Group | Place | HistoricalEvent;

export function getEntityName(entity: AnyEntity): string {
  switch (entity.entityType) {
    case "person":
      return entity.primaryName;
    case "group":
      return entity.name;
    case "place":
      return entity.name;
    case "event":
      return entity.title;
  }
}
