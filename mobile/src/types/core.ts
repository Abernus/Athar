// ============================================================
// Athar (أثر) — Core Types
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
  // Enhanced fields
  authorName?: string;
  language?: string;
  archiveReference?: string;
  archiveFund?: string;
  repositoryName?: string;
  reliabilityLevel?: ReliabilityLevel;
  biasNotes?: string;
  fileRef?: string;
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

// --- ProjectWorkspace (legacy) ---

export interface ProjectWorkspace {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

// --- Research Project (Dossier de recherche) ---

export type ProjectStatus = "active" | "paused" | "completed" | "archived";

export interface ResearchProject {
  id: string;
  title: string;
  summary: string;
  researchQuestion: string;
  periodStart?: string;
  periodEnd?: string;
  geographicScope: string;
  status: ProjectStatus;
  tags: string[];
  notes: string;
  createdAt: string;
  updatedAt: string;
}

// --- Source Excerpt (Extrait) ---

export type ExcerptType = "text" | "image_region" | "audio_segment" | "page";
export type ExcerptClassification = "proof" | "clue" | "context" | "contradiction" | "doubt";
export type ExcerptImportance = "high" | "normal" | "low";
export type ReliabilityLevel = "high" | "medium" | "low" | "unknown";

export interface SourceExcerpt {
  id: string;
  sourceId: string;
  excerptType: ExcerptType;
  selectedText: string;
  pageOrLocation: string;
  excerptSummary: string;
  classification: ExcerptClassification;
  importance: ExcerptImportance;
  linkedEntityType?: EntityType;
  linkedEntityId?: string;
  tags: string[];
  notes: string;
  createdAt: string;
  updatedAt: string;
}

// --- Research Note (Carnet de recherche) ---

export type NoteType = "note" | "idea" | "todo" | "field_note" | "abandoned_lead";

export interface ResearchNote {
  id: string;
  projectId?: string;
  noteType: NoteType;
  content: string;
  linkedObjectType?: string;
  linkedObjectId?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// --- Contradiction ---

export type ContradictionStatus = "open" | "resolved" | "acknowledged";

export interface Contradiction {
  id: string;
  projectId?: string;
  title: string;
  description: string;
  status: ContradictionStatus;
  resolutionNote: string;
  sourceAType?: string;
  sourceAId?: string;
  sourceBType?: string;
  sourceBId?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// --- Entity Alias ---

export interface EntityAlias {
  id: string;
  entityType: EntityType;
  entityId: string;
  alias: string;
  language: string;
  script: string;
  transcriptionSystem: string;
  notes: string;
  createdAt: string;
}

// --- Bibliography Entry ---

export type BibEntryType = "book" | "article" | "thesis" | "chapter" | "report" | "website" | "archive_guide";

export interface BibliographyEntry {
  id: string;
  projectId?: string;
  entryType: BibEntryType;
  title: string;
  authors: string;
  year: string;
  publisher: string;
  journal: string;
  volume: string;
  pages: string;
  url: string;
  isbn: string;
  abstract: string;
  notes: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// --- Witness (Fiche témoin) ---

export type ConsentStatus = "pending" | "obtained" | "refused" | "restricted";
export type SensitivityLevel = "public" | "normal" | "sensitive" | "confidential";

export interface Witness {
  id: string;
  fullName: string;
  birthYear: string;
  birthPlace: string;
  currentLocation: string;
  relationToSubject: string;
  reliabilityAssessment: string;
  contextNotes: string;
  consentStatus: ConsentStatus;
  consentNotes: string;
  sensitivityLevel: SensitivityLevel;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// --- Interview Session ---

export interface InterviewSession {
  id: string;
  witnessId?: string;
  testimonyId?: string;
  projectId?: string;
  title: string;
  date: string;
  location: string;
  durationMinutes?: number;
  interviewGuide: string;
  simultaneousNotes: string;
  topicsCovered: string[];
  namesMentioned: string[];
  placesMentioned: string[];
  datesMentioned: string[];
  followUpQuestions: string;
  assessment: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// --- Field Mission ---

export type MissionStatus = "planned" | "in_progress" | "completed";

export interface FieldMission {
  id: string;
  projectId?: string;
  title: string;
  location: string;
  dateStart: string;
  dateEnd: string;
  objectives: string;
  personsToMeet: string;
  placesToVisit: string;
  archivesToConsult: string;
  equipmentChecklist: string;
  debriefNotes: string;
  status: MissionStatus;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// --- Corpus Document ---

export type CorpusDocType = "text" | "image" | "pdf" | "audio" | "video";
export type OcrStatus = "none" | "pending" | "completed" | "failed";

export interface CorpusDocument {
  id: string;
  projectId?: string;
  sourceId?: string;
  title: string;
  documentType: CorpusDocType;
  contentText: string;
  transcription: string;
  translation: string;
  language: string;
  ocrStatus: OcrStatus;
  fileRef?: string;
  detectedNames: string[];
  detectedPlaces: string[];
  detectedDates: string[];
  detectedOrganizations: string[];
  tags: string[];
  notes: string;
  createdAt: string;
  updatedAt: string;
}

// --- Evidence Chain ---

export type ClaimStatus = "unverified" | "supported" | "weakly_supported" | "contested" | "refuted";
export type LinkStrength = "strong" | "moderate" | "weak" | "speculative";

export interface EvidenceChain {
  id: string;
  projectId?: string;
  title: string;
  claimText: string;
  claimStatus: ClaimStatus;
  conclusion: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface EvidenceChainLink {
  id: string;
  chainId: string;
  position: number;
  linkType: string;
  objectType?: string;
  objectId?: string;
  description: string;
  isSupporting: boolean;
  strength: LinkStrength;
  notes: string;
  createdAt: string;
}

// --- Prosopography ---

export interface ProsopographyCohort {
  id: string;
  projectId?: string;
  title: string;
  description: string;
  criteria: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ProsopographyEntry {
  id: string;
  cohortId: string;
  personId?: string;
  birthRegion: string;
  socialOrigin: string;
  educationLevel: string;
  occupation: string;
  politicalAffiliation: string;
  militaryService: string;
  migrationDate: string;
  migrationDestination: string;
  familyStatus: string;
  notableEvents: string;
  customFields: Record<string, string>;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

// --- Entity Suggestions ---

export type SuggestionType = "possible_duplicate" | "related" | "same_identity";
export type SuggestionStatus = "pending" | "accepted" | "rejected" | "merged";

export interface EntitySuggestion {
  id: string;
  entityAType: EntityType;
  entityAId: string;
  entityBType: EntityType;
  entityBId: string;
  suggestionType: SuggestionType;
  confidence: string;
  reason: string;
  status: SuggestionStatus;
  resolutionNote: string;
  createdAt: string;
  updatedAt: string;
}

// --- Publication ---

export type PublicationType = "dossier" | "timeline" | "map" | "narrative" | "mini_site";

export interface Publication {
  id: string;
  projectId?: string;
  title: string;
  description: string;
  publicationType: PublicationType;
  contentHtml: string;
  isPublished: boolean;
  publishedAt?: string;
  shareToken?: string;
  settings: Record<string, any>;
  tags: string[];
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
