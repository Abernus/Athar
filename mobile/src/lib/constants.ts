// ============================================================
// Athar (أثر) — Constants, labels, and display maps
// ============================================================

import type {
  ConfidenceLevel,
  HypothesisStatus,
  SourceType,
  ArchiveType,
  RelationshipType,
  EntityType,
  DatePrecision,
  EventType,
  GroupType,
  PlaceType,
  ClaimType,
} from "@/types";

// --- Confidence levels ---

export const CONFIDENCE_LEVELS: readonly ConfidenceLevel[] = [
  "confirmed",
  "probable",
  "uncertain",
  "contested",
  "abandoned",
] as const;

export const CONFIDENCE_LABELS: Record<ConfidenceLevel, string> = {
  confirmed: "Confirmé",
  probable: "Probable",
  uncertain: "Incertain",
  contested: "Contesté",
  abandoned: "Abandonné",
};

export const CONFIDENCE_COLORS: Record<ConfidenceLevel, string> = {
  confirmed: "text-emerald-700 bg-emerald-50 border-emerald-200",
  probable: "text-blue-700 bg-blue-50 border-blue-200",
  uncertain: "text-amber-700 bg-amber-50 border-amber-200",
  contested: "text-orange-700 bg-orange-50 border-orange-200",
  abandoned: "text-stone-500 bg-stone-50 border-stone-200",
};

// --- Hypothesis statuses ---

export const HYPOTHESIS_STATUSES: readonly HypothesisStatus[] = [
  "draft",
  "open",
  "argued",
  "provisionally_validated",
  "rejected",
] as const;

export const HYPOTHESIS_STATUS_LABELS: Record<HypothesisStatus, string> = {
  draft: "Brouillon",
  open: "Ouverte",
  argued: "Argumentée",
  provisionally_validated: "Validée provisoirement",
  rejected: "Rejetée",
};

export const HYPOTHESIS_STATUS_COLORS: Record<HypothesisStatus, string> = {
  draft: "text-stone-600 bg-stone-50 border-stone-200",
  open: "text-blue-700 bg-blue-50 border-blue-200",
  argued: "text-indigo-700 bg-indigo-50 border-indigo-200",
  provisionally_validated: "text-emerald-700 bg-emerald-50 border-emerald-200",
  rejected: "text-red-700 bg-red-50 border-red-200",
};

// --- Source types ---

export const SOURCE_TYPES: readonly SourceType[] = [
  "primary",
  "secondary",
  "testimony",
  "private_archive",
  "internal_note",
  "other",
] as const;

export const SOURCE_TYPE_LABELS: Record<SourceType, string> = {
  primary: "Source primaire",
  secondary: "Source secondaire",
  testimony: "Témoignage",
  private_archive: "Archive privée",
  internal_note: "Note interne",
  other: "Autre",
};

// --- Archive types ---

export const ARCHIVE_TYPES: readonly ArchiveType[] = [
  "act",
  "letter",
  "photo",
  "notebook",
  "administrative",
  "article",
  "register",
  "map",
  "audio_recording",
  "transcript",
  "other",
] as const;

export const ARCHIVE_TYPE_LABELS: Record<ArchiveType, string> = {
  act: "Acte",
  letter: "Lettre",
  photo: "Photo",
  notebook: "Carnet",
  administrative: "Document administratif",
  article: "Article",
  register: "Registre",
  map: "Carte",
  audio_recording: "Enregistrement audio",
  transcript: "Transcription",
  other: "Autre",
};

// --- Relationship types ---

export const RELATIONSHIP_TYPES: readonly RelationshipType[] = [
  "kinship",
  "alliance",
  "neighborhood",
  "membership",
  "function",
  "institutional",
  "participation",
  "dependency",
  "transmission",
  "probable",
  "economic",
  "religious",
  "military",
  "political",
  "social",
  "other",
] as const;

export const RELATIONSHIP_TYPE_LABELS: Record<RelationshipType, string> = {
  kinship: "Parenté",
  alliance: "Alliance",
  neighborhood: "Voisinage",
  membership: "Appartenance",
  function: "Fonction",
  institutional: "Institutionnel",
  participation: "Participation",
  dependency: "Dépendance",
  transmission: "Transmission",
  probable: "Relation probable",
  economic: "Économique",
  religious: "Religieux",
  military: "Militaire",
  political: "Politique",
  social: "Social",
  other: "Autre",
};

// --- Entity types ---

export const ENTITY_TYPES: readonly EntityType[] = [
  "person",
  "group",
  "place",
  "event",
] as const;

export const ENTITY_TYPE_LABELS: Record<EntityType, string> = {
  person: "Personne",
  group: "Groupe",
  place: "Lieu",
  event: "Événement",
};

export const ENTITY_TYPE_LABELS_PLURAL: Record<EntityType, string> = {
  person: "Personnes",
  group: "Groupes",
  place: "Lieux",
  event: "Événements",
};

// --- Date precision ---

export const DATE_PRECISION_LABELS: Record<DatePrecision, string> = {
  exact: "Date exacte",
  estimated: "Estimée",
  approximate: "Approximative",
  before: "Avant",
  after: "Après",
  decade: "Décennie",
  century: "Siècle",
  interval: "Intervalle",
  unknown: "Inconnue",
};

// --- Event types ---

export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  birth: "Naissance",
  death: "Décès",
  marriage: "Mariage",
  migration: "Migration",
  conflict: "Conflit",
  founding: "Fondation",
  political: "Politique",
  economic: "Économique",
  religious: "Religieux",
  social: "Social",
  cultural: "Culturel",
  legal: "Juridique",
  other: "Autre",
};

// --- Group types ---

export const GROUP_TYPE_LABELS: Record<GroupType, string> = {
  family: "Famille",
  lineage: "Lignée",
  tribe: "Tribu",
  institution: "Institution",
  community: "Communauté",
  association: "Association",
  political: "Politique",
  religious: "Religieux",
  military: "Militaire",
  economic: "Économique",
  other: "Autre",
};

// --- Place types ---

export const PLACE_TYPE_LABELS: Record<PlaceType, string> = {
  village: "Village",
  city: "Ville",
  region: "Région",
  country: "Pays",
  neighborhood: "Quartier",
  building: "Bâtiment",
  site: "Site",
  other: "Autre",
};

// --- Claim types ---

export const CLAIM_TYPE_LABELS: Record<ClaimType, string> = {
  birth_date: "Date de naissance",
  death_date: "Date de décès",
  birth_place: "Lieu de naissance",
  occupation: "Occupation",
  affiliation: "Affiliation",
  residence: "Résidence",
  event_participation: "Participation à un événement",
  name_variant: "Variante de nom",
  attribute: "Attribut",
  other: "Autre",
};
