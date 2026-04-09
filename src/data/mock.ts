// ============================================================
// Historiens — Mock data for development
// A small corpus around Algerian migration to France (1900s–1960s)
// ============================================================

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
} from "@/types";

// --- Persons ---

export const MOCK_PERSONS: Person[] = [
  {
    id: "p1",
    entityType: "person",
    primaryName: "Ahmed Ben Mostefa",
    alternateNames: ["Ahmed Benmostefa", "Si Ahmed"],
    summary:
      "Ouvrier originaire de Kabylie, migré en France vers 1925. Actif dans le mouvement nationaliste. Témoignages recueillis auprès de ses petits-enfants.",
    birthDate: { value: "1898", precision: "estimated", display: "vers 1898" },
    deathDate: { value: "1971", precision: "exact" },
    gender: "male",
    tags: ["migration", "kabylie", "ouvrier", "nationalisme"],
    notes: "Plusieurs variantes orthographiques dans les archives.",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-03-01T14:00:00Z",
  },
  {
    id: "p2",
    entityType: "person",
    primaryName: "Fatma Aït Ouali",
    alternateNames: ["Fatma bent Ali"],
    summary:
      "Épouse d'Ahmed Ben Mostefa. Restée au village de Tizi pendant la migration de son mari. Collecte de mémoire orale par sa petite-fille en 2019.",
    birthDate: { value: "1905", precision: "approximate", display: "≈ 1905" },
    deathDate: { value: "1988", precision: "estimated", display: "vers 1988" },
    gender: "female",
    tags: ["kabylie", "femme", "mémoire orale"],
    notes: "",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "p3",
    entityType: "person",
    primaryName: "Slimane Amrouche",
    alternateNames: [],
    summary:
      "Compagnon de travail d'Ahmed à l'usine Renault de Boulogne-Billancourt. Originaire de la même région.",
    birthDate: { value: "1900", precision: "decade", display: "années 1900" },
    deathDate: undefined,
    gender: "male",
    tags: ["migration", "ouvrier", "renault"],
    notes: "Mentionné dans deux témoignages oraux, mais pas dans les archives administratives.",
    createdAt: "2024-02-01T09:00:00Z",
    updatedAt: "2024-02-01T09:00:00Z",
  },
  {
    id: "p4",
    entityType: "person",
    primaryName: "Messali Hadj",
    alternateNames: ["Ahmed Messali"],
    summary:
      "Figure majeure du nationalisme algérien. Fondateur de l'Étoile Nord-Africaine puis du PPA.",
    birthDate: { value: "1898-06-16", precision: "exact" },
    deathDate: { value: "1974-06-03", precision: "exact" },
    gender: "male",
    tags: ["nationalisme", "politique", "figure majeure"],
    notes: "Inclus comme figure contextuelle, non sujet principal de l'étude.",
    createdAt: "2024-02-10T11:00:00Z",
    updatedAt: "2024-02-10T11:00:00Z",
  },
];

// --- Groups ---

export const MOCK_GROUPS: Group[] = [
  {
    id: "g1",
    entityType: "group",
    name: "Étoile Nord-Africaine",
    groupType: "political",
    summary:
      "Organisation politique nationaliste fondée en 1926 à Paris, regroupant les travailleurs nord-africains en France.",
    timeRange: {
      start: { value: "1926", precision: "exact" },
      end: { value: "1937", precision: "exact" },
    },
    tags: ["nationalisme", "politique", "diaspora"],
    notes: "Dissoute par les autorités françaises en 1929, puis reformée, puis définitivement en 1937.",
    createdAt: "2024-01-20T08:00:00Z",
    updatedAt: "2024-01-20T08:00:00Z",
  },
  {
    id: "g2",
    entityType: "group",
    name: "Famille Ben Mostefa",
    groupType: "family",
    summary:
      "Famille élargie originaire d'un village de Kabylie, avec branche migrante en région parisienne.",
    tags: ["famille", "kabylie", "migration"],
    notes: "",
    createdAt: "2024-01-20T09:00:00Z",
    updatedAt: "2024-01-20T09:00:00Z",
  },
  {
    id: "g3",
    entityType: "group",
    name: "Ouvriers kabyles de Renault Boulogne",
    groupType: "community",
    summary:
      "Réseau informel d'ouvriers kabyles travaillant à l'usine Renault de Boulogne-Billancourt dans l'entre-deux-guerres.",
    timeRange: {
      start: { value: "1920", precision: "approximate" },
      end: { value: "1945", precision: "approximate" },
    },
    tags: ["ouvrier", "renault", "kabylie", "réseau"],
    notes: "",
    createdAt: "2024-02-05T10:00:00Z",
    updatedAt: "2024-02-05T10:00:00Z",
  },
];

// --- Places ---

export const MOCK_PLACES: Place[] = [
  {
    id: "pl1",
    entityType: "place",
    name: "Tizi (village de Kabylie)",
    placeType: "village",
    summary: "Village d'origine de la famille Ben Mostefa en Grande Kabylie.",
    tags: ["kabylie", "algérie", "village"],
    notes: "Le nom exact du village est anonymisé dans cette recherche.",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "pl2",
    entityType: "place",
    name: "Boulogne-Billancourt",
    placeType: "city",
    summary:
      "Ville industrielle de la banlieue parisienne, siège de l'usine Renault. Important lieu d'emploi pour les travailleurs immigrés.",
    tags: ["france", "industrie", "renault", "migration"],
    notes: "",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "pl3",
    entityType: "place",
    name: "Alger",
    placeType: "city",
    parentPlaceId: undefined,
    summary: "Capitale de l'Algérie. Point de transit pour les migrants vers la France.",
    tags: ["algérie", "ville", "transit"],
    notes: "",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "pl4",
    entityType: "place",
    name: "Paris",
    placeType: "city",
    summary:
      "Centre de la diaspora nord-africaine en France. Sièges de nombreuses organisations nationalistes.",
    tags: ["france", "diaspora", "politique"],
    notes: "",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
];

// --- Events ---

export const MOCK_EVENTS: HistoricalEvent[] = [
  {
    id: "ev1",
    entityType: "event",
    title: "Migration d'Ahmed vers la France",
    eventType: "migration",
    description:
      "Ahmed Ben Mostefa quitte la Kabylie pour travailler en France, probablement à Marseille d'abord, puis en région parisienne.",
    dateStart: { value: "1925", precision: "estimated", display: "vers 1925" },
    placeId: "pl1",
    tags: ["migration", "kabylie"],
    notes: "La date exacte est incertaine. Le témoignage familial dit 'au milieu des années 20'.",
    createdAt: "2024-01-20T10:00:00Z",
    updatedAt: "2024-01-20T10:00:00Z",
  },
  {
    id: "ev2",
    entityType: "event",
    title: "Fondation de l'Étoile Nord-Africaine",
    eventType: "founding",
    description:
      "Création de l'Étoile Nord-Africaine à Paris, sous l'impulsion de Messali Hadj et du PCF.",
    dateStart: { value: "1926", precision: "exact" },
    placeId: "pl4",
    tags: ["nationalisme", "politique", "fondation"],
    notes: "",
    createdAt: "2024-01-20T10:00:00Z",
    updatedAt: "2024-01-20T10:00:00Z",
  },
  {
    id: "ev3",
    entityType: "event",
    title: "Embauche à l'usine Renault",
    eventType: "economic",
    description:
      "Ahmed Ben Mostefa est embauché à l'usine Renault de Boulogne-Billancourt.",
    dateStart: { value: "1926", precision: "approximate", display: "≈ 1926" },
    placeId: "pl2",
    tags: ["ouvrier", "renault", "emploi"],
    notes: "Déduit du témoignage de Slimane, non confirmé par les archives Renault consultées.",
    createdAt: "2024-02-01T10:00:00Z",
    updatedAt: "2024-02-01T10:00:00Z",
  },
  {
    id: "ev4",
    entityType: "event",
    title: "Retour définitif en Algérie",
    eventType: "migration",
    description:
      "Ahmed Ben Mostefa rentre définitivement dans son village de Kabylie après l'indépendance.",
    dateStart: { value: "1963", precision: "estimated", display: "vers 1963" },
    placeId: "pl1",
    tags: ["migration", "retour", "indépendance"],
    notes: "",
    createdAt: "2024-02-01T10:00:00Z",
    updatedAt: "2024-02-01T10:00:00Z",
  },
];

// --- Sources ---

export const MOCK_SOURCES: Source[] = [
  {
    id: "s1",
    title: "Registre de l'état civil — commune de Tizi",
    sourceType: "primary",
    origin: "Mairie de Tizi, Algérie",
    createdOrPublishedAt: { value: "1898", precision: "estimated" },
    reference: "Registre EC 1895-1910, folio 42",
    summary:
      "Mention de la naissance d'un 'Ahmed fils de Mostefa' dans le registre communal.",
    criticalNote:
      "Les registres d'état civil de cette commune sont lacunaires pour la période. L'orthographe des noms est francisée.",
    tags: ["état civil", "naissance", "kabylie"],
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "s2",
    title: "Témoignage de Yamina Ben Mostefa",
    sourceType: "testimony",
    origin: "Entretien recueilli par Dr. Mehenni, 2019",
    createdOrPublishedAt: { value: "2019-08-15", precision: "exact" },
    reference: "Entretien enregistré, 45 min",
    summary:
      "Petite-fille d'Ahmed, Yamina raconte les souvenirs familiaux de la migration de son grand-père et de son travail en France.",
    criticalNote:
      "Témoignage de seconde génération. Certains éléments sont probablement reconstitués à partir de récits transmis.",
    tags: ["mémoire orale", "famille", "migration"],
    createdAt: "2024-01-20T10:00:00Z",
    updatedAt: "2024-01-20T10:00:00Z",
  },
  {
    id: "s3",
    title: "Benjamin Stora, Ils venaient d'Algérie",
    sourceType: "secondary",
    origin: "Publication académique",
    createdOrPublishedAt: { value: "1992", precision: "exact" },
    reference: "Stora, Benjamin. Ils venaient d'Algérie. Paris: Fayard, 1992.",
    summary:
      "Ouvrage de référence sur l'immigration algérienne en France, couvrant la période 1912-1992.",
    criticalNote: "Source secondaire fiable, largement citée dans la littérature.",
    tags: ["immigration", "algérie", "france", "ouvrage"],
    createdAt: "2024-02-01T10:00:00Z",
    updatedAt: "2024-02-01T10:00:00Z",
  },
  {
    id: "s4",
    title: "Fiche de police — Préfecture de la Seine",
    sourceType: "primary",
    origin: "Archives de la Préfecture de Police de Paris",
    createdOrPublishedAt: { value: "1928", precision: "estimated" },
    reference: "APP, BA 1679, dossier 'Nord-Africains'",
    summary:
      "Fiche de surveillance mentionnant un 'Ahmed Benmostefa, manœuvre, Boulogne-Billancourt' parmi les fréquentations de l'ENA.",
    criticalNote:
      "L'identification avec notre Ahmed est probable mais non certaine. L'orthographe et la profession correspondent.",
    tags: ["police", "surveillance", "ENA", "Boulogne"],
    createdAt: "2024-02-10T10:00:00Z",
    updatedAt: "2024-02-10T10:00:00Z",
  },
];

// --- Hypotheses ---

export const MOCK_HYPOTHESES: Hypothesis[] = [
  {
    id: "h1",
    title: "Ahmed Ben Mostefa était membre actif de l'ENA",
    description:
      "La fiche de police de 1928 et le témoignage familial suggèrent qu'Ahmed n'était pas un simple sympathisant mais un membre actif de l'Étoile Nord-Africaine.",
    status: "argued",
    confidenceLevel: "probable",
    notes:
      "La fiche de police le mentionne parmi les 'fréquentations', ce qui est vague. Le témoignage familial est plus affirmatif mais de seconde génération.",
    tags: ["ENA", "nationalisme", "engagement"],
    createdAt: "2024-02-15T10:00:00Z",
    updatedAt: "2024-03-01T10:00:00Z",
  },
  {
    id: "h2",
    title: "Ahmed et Slimane étaient originaires du même village",
    description:
      "Le témoignage de Yamina mentionne que le compagnon de travail de son grand-père 'venait du même village'. Cela pourrait être Slimane Amrouche.",
    status: "open",
    confidenceLevel: "uncertain",
    notes:
      "Le nom 'Amrouche' n'est pas mentionné dans le témoignage. L'identification est une inférence du chercheur.",
    tags: ["réseau", "voisinage", "kabylie"],
    createdAt: "2024-02-20T10:00:00Z",
    updatedAt: "2024-02-20T10:00:00Z",
  },
  {
    id: "h3",
    title: "La photo de famille date des années 1930",
    description:
      "Une photo de famille trouvée dans les archives privées de Yamina montre Ahmed en tenue d'ouvrier. Le style vestimentaire et le décor suggèrent les années 1930.",
    status: "draft",
    confidenceLevel: "uncertain",
    notes: "Aucune date au dos de la photo. Estimation basée sur l'analyse vestimentaire uniquement.",
    tags: ["photo", "datation", "archive privée"],
    createdAt: "2024-03-01T10:00:00Z",
    updatedAt: "2024-03-01T10:00:00Z",
  },
];

// --- Relationships ---

export const MOCK_RELATIONSHIPS: Relationship[] = [
  {
    id: "r1",
    sourceEntityType: "person",
    sourceEntityId: "p1",
    targetEntityType: "person",
    targetEntityId: "p2",
    relationshipType: "alliance",
    label: "époux",
    confidenceLevel: "confirmed",
    notes: "Mariage attesté par le témoignage familial et le registre d'état civil.",
    createdAt: "2024-01-20T10:00:00Z",
    updatedAt: "2024-01-20T10:00:00Z",
  },
  {
    id: "r2",
    sourceEntityType: "person",
    sourceEntityId: "p1",
    targetEntityType: "person",
    targetEntityId: "p3",
    relationshipType: "neighborhood",
    label: "compagnon de travail",
    confidenceLevel: "probable",
    notes: "Mentionné dans le témoignage de Yamina. Pas de source administrative.",
    createdAt: "2024-02-01T10:00:00Z",
    updatedAt: "2024-02-01T10:00:00Z",
  },
  {
    id: "r3",
    sourceEntityType: "person",
    sourceEntityId: "p1",
    targetEntityType: "group",
    targetEntityId: "g1",
    relationshipType: "membership",
    label: "membre supposé",
    confidenceLevel: "probable",
    notes: "Voir hypothèse H1.",
    createdAt: "2024-02-15T10:00:00Z",
    updatedAt: "2024-02-15T10:00:00Z",
  },
  {
    id: "r4",
    sourceEntityType: "person",
    sourceEntityId: "p1",
    targetEntityType: "group",
    targetEntityId: "g2",
    relationshipType: "kinship",
    label: "chef de famille",
    confidenceLevel: "confirmed",
    notes: "",
    createdAt: "2024-01-20T10:00:00Z",
    updatedAt: "2024-01-20T10:00:00Z",
  },
  {
    id: "r5",
    sourceEntityType: "person",
    sourceEntityId: "p4",
    targetEntityType: "group",
    targetEntityId: "g1",
    relationshipType: "function",
    label: "fondateur et dirigeant",
    confidenceLevel: "confirmed",
    notes: "",
    createdAt: "2024-02-10T10:00:00Z",
    updatedAt: "2024-02-10T10:00:00Z",
  },
  {
    id: "r6",
    sourceEntityType: "person",
    sourceEntityId: "p1",
    targetEntityType: "group",
    targetEntityId: "g3",
    relationshipType: "membership",
    label: "membre",
    confidenceLevel: "confirmed",
    notes: "",
    createdAt: "2024-02-05T10:00:00Z",
    updatedAt: "2024-02-05T10:00:00Z",
  },
  {
    id: "r7",
    sourceEntityType: "person",
    sourceEntityId: "p3",
    targetEntityType: "group",
    targetEntityId: "g3",
    relationshipType: "membership",
    label: "membre",
    confidenceLevel: "probable",
    notes: "Déduit du témoignage oral.",
    createdAt: "2024-02-05T10:00:00Z",
    updatedAt: "2024-02-05T10:00:00Z",
  },
];

// --- Archive items ---

export const MOCK_ARCHIVE_ITEMS: ArchiveItem[] = [
  {
    id: "ai1",
    title: "Photo de famille — Ahmed en tenue d'ouvrier",
    archiveType: "photo",
    description:
      "Photographie noir et blanc montrant Ahmed en tenue de travail, probablement à Boulogne-Billancourt.",
    dateOrPeriod: { value: "1930", precision: "decade", display: "années 1930" },
    linkedEntityIds: [{ entityType: "person", entityId: "p1" }],
    tags: ["photo", "ouvrier", "Boulogne"],
    notes: "Voir hypothèse H3 pour la datation.",
    createdAt: "2024-03-01T10:00:00Z",
    updatedAt: "2024-03-01T10:00:00Z",
  },
  {
    id: "ai2",
    title: "Carnet personnel d'Ahmed",
    archiveType: "notebook",
    description:
      "Petit carnet contenant des adresses, quelques mots en arabe et en français, et des comptes.",
    dateOrPeriod: { value: "1930", precision: "approximate", display: "≈ années 1930-1940" },
    linkedEntityIds: [{ entityType: "person", entityId: "p1" }],
    tags: ["carnet", "écriture", "archive privée"],
    notes: "Confié par Yamina. État fragile. Non encore transcrit intégralement.",
    createdAt: "2024-03-01T10:00:00Z",
    updatedAt: "2024-03-01T10:00:00Z",
  },
];

// --- Oral testimonies ---

export const MOCK_ORAL_TESTIMONIES: OralTestimony[] = [
  {
    id: "ot1",
    title: "Entretien avec Yamina Ben Mostefa",
    speaker: "Yamina Ben Mostefa",
    interviewer: "Dr. Mehenni",
    recordedAt: { value: "2019-08-15", precision: "exact" },
    summary:
      "Yamina raconte les souvenirs familiaux de la migration d'Ahmed, son travail en France, ses retours au village, et les récits transmis par sa mère.",
    transcript:
      "Mon grand-père, on l'appelait Si Ahmed. Ma mère disait qu'il est parti très jeune, au milieu des années vingt, il devait avoir vingt-cinq, vingt-six ans. Il a travaillé à l'usine, chez Renault je crois, avec un homme du village...",
    trustNote:
      "Témoignage de seconde génération, sincère mais reconstruit. À croiser avec archives.",
    linkedEntityIds: [
      { entityType: "person", entityId: "p1" },
      { entityType: "person", entityId: "p2" },
      { entityType: "place", entityId: "pl1" },
      { entityType: "place", entityId: "pl2" },
    ],
    tags: ["mémoire orale", "famille", "migration", "Renault"],
    createdAt: "2024-01-20T10:00:00Z",
    updatedAt: "2024-01-20T10:00:00Z",
  },
];
