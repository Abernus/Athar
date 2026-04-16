# Athar — Documentation technique

## Stack technologique

### Mobile (app principale)
| Couche | Technologie | Version |
|---|---|---|
| Framework | Expo (SDK 54) | ~54.0.33 |
| Routing | expo-router | ~6.0.23 |
| UI | React Native | 0.81.5 |
| State management | Zustand | ^5.0.12 |
| Backend | Supabase (PostgreSQL) | supabase-js ^2.49.1 |
| Langage | TypeScript | ~5.9.2 |
| Animations | react-native-reanimated | ~4.1.1 |
| Navigation native | react-native-screens | ~4.16.0 |
| Caméra | expo-camera | ~17.0.10 |
| Audio | expo-av | ^16.0.8 |
| Exports | expo-print + expo-sharing | ~15.0.8 / ~14.0.8 |

### Web (workbench — en pause)
| Couche | Technologie |
|---|---|
| Framework | Next.js (App Router) |
| CSS | Tailwind CSS v4 |
| State | Zustand |

---

## Structure du projet

```
Athar/
├── docs/                          # Documentation
│   ├── PRODUCT_SPEC.md
│   ├── TECHNICAL.md
│   ├── ARCHITECTURE.md
│   ├── USER_GUIDE.md
│   └── VISION.md
├── mobile/                        # App Expo
│   ├── app/                       # Écrans (file-based routing)
│   │   ├── (tabs)/               # Tab navigator
│   │   │   ├── _layout.tsx       # Config 5 tabs + 2 hidden
│   │   │   ├── index.tsx         # Accueil
│   │   │   ├── projects.tsx      # Dossiers
│   │   │   ├── capture.tsx       # Hub d'ajout (4 sections)
│   │   │   ├── timeline.tsx      # Frise chronologique
│   │   │   ├── search.tsx        # Recherche
│   │   │   ├── browse.tsx        # Explorer (hidden tab)
│   │   │   └── map.tsx           # Lieux (hidden tab)
│   │   ├── add/                  # Formulaires de création (14)
│   │   │   ├── person.tsx
│   │   │   ├── group.tsx
│   │   │   ├── place.tsx
│   │   │   ├── event.tsx
│   │   │   ├── project.tsx
│   │   │   ├── source.tsx
│   │   │   ├── hypothesis.tsx
│   │   │   ├── note.tsx
│   │   │   ├── relationship.tsx
│   │   │   ├── contradiction.tsx
│   │   │   ├── bibliography.tsx
│   │   │   ├── witness.tsx
│   │   │   ├── mission.tsx
│   │   │   ├── evidence-chain.tsx
│   │   │   └── cohort.tsx
│   │   ├── capture/              # Capture terrain
│   │   │   ├── photo.tsx
│   │   │   └── voice.tsx
│   │   ├── entity/[type]/[id].tsx # Fiche entité détaillée
│   │   ├── project/[id].tsx       # Fiche dossier
│   │   ├── source/[id].tsx        # Fiche source
│   │   ├── network.tsx            # Graphe relationnel
│   │   ├── export/project.tsx     # Export PDF/HTML
│   │   └── _layout.tsx            # Stack navigator racine
│   ├── src/
│   │   ├── components/           # Composants réutilisables
│   │   │   ├── Card.tsx
│   │   │   ├── EntityBadge.tsx
│   │   │   ├── EntityRow.tsx
│   │   │   ├── EntityPicker.tsx
│   │   │   ├── ConfidencePill.tsx
│   │   │   └── SectionHeader.tsx
│   │   ├── stores/
│   │   │   └── research-store.ts  # Zustand + Supabase (~900 lignes)
│   │   ├── types/
│   │   │   ├── core.ts           # Tous les types TS (~550 lignes)
│   │   │   └── index.ts
│   │   ├── lib/
│   │   │   ├── theme.ts          # Design tokens
│   │   │   ├── supabase.ts       # Client Supabase
│   │   │   ├── constants.ts      # Labels français
│   │   │   └── utils.ts          # Helpers
│   │   └── data/
│   │       └── mock.ts           # (legacy, plus utilisé)
│   ├── supabase/                 # Migrations SQL
│   │   ├── schema.sql            # V1 : tables de base
│   │   ├── 002_*.sql             # V1.1 : dossiers, sources, extraits
│   │   ├── 003_*.sql             # V2 : contradictions, aliases, biblio
│   │   ├── 004_*.sql             # V2 : oral history, corpus
│   │   └── 005_*.sql             # V3 : evidence chains, proso, publications
│   ├── app.json                  # Config Expo
│   ├── package.json
│   ├── babel.config.js
│   ├── tsconfig.json
│   └── .env.example
└── src/                          # Web app Next.js (en pause)
```

---

## Base de données

### Schéma Supabase : `athar`

Le projet utilise un schéma dédié `athar` pour coexister avec d'autres projets sur la même instance Supabase.

### Tables (25 tables)

#### Entités historiques
| Table | Description |
|---|---|
| `persons` | Personnes historiques |
| `groups` | Groupes, organisations, familles |
| `places` | Lieux géographiques |
| `events` | Événements historiques |
| `relationships` | Relations entre entités |
| `entity_aliases` | Variantes de noms multilingues |

#### Sources & documentation
| Table | Description |
|---|---|
| `sources` | Sources documentaires (15+ champs) |
| `source_excerpts` | Extraits annotés avec classification |
| `archive_items` | Photos d'archives |
| `oral_testimonies` | Enregistrements vocaux |
| `corpus_documents` | Documents de corpus avec full-text search |
| `bibliography_entries` | Références bibliographiques |

#### Recherche & analyse
| Table | Description |
|---|---|
| `research_projects` | Dossiers de recherche |
| `project_entities` | Liaison projet → entités |
| `project_sources` | Liaison projet → sources |
| `project_questions` | Questions ouvertes |
| `hypotheses` | Hypothèses de recherche |
| `contradictions` | Contradictions documentaires |
| `research_notes` | Carnet de recherche |

#### Histoire orale & terrain
| Table | Description |
|---|---|
| `witnesses` | Fiches témoins (consentement, sensibilité) |
| `interview_sessions` | Sessions d'entretien structurées |
| `field_missions` | Missions terrain planifiées |

#### V3 — Expert
| Table | Description |
|---|---|
| `evidence_chains` | Chaînes de preuve |
| `evidence_chain_links` | Maillons individuels |
| `prosopography_cohorts` | Cohortes prosopographiques |
| `prosopography_entries` | Fiches individuelles comparables |
| `entity_suggestions` | Suggestions de rapprochement |
| `publications` | Publications partageables |

### Conventions SQL
- UUIDs via `gen_random_uuid()`
- `created_at` / `updated_at` automatiques (triggers)
- snake_case côté SQL, camelCase côté TypeScript
- RLS activé sur toutes les tables (policies permissives en dev)
- Full-text search GIN index sur `corpus_documents`

---

## Configuration

### Variables d'environnement

```env
EXPO_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

### Supabase

1. Exposer le schéma `athar` dans Settings → API → Exposed schemas
2. Exécuter les migrations SQL dans l'ordre :
   - `schema.sql`
   - `002_projects_sources_excerpts.sql`
   - `003_v2_contradictions_aliases.sql`
   - `004_v2_oral_history_corpus.sql`
   - `005_v3_expert.sql`

### Installation locale

```bash
cd mobile
npm install
cp .env.example .env  # Remplir avec vos credentials
npx expo start -c
```

---

## Store (Zustand)

Le store central (`research-store.ts`) suit le pattern :

1. **State** : tableaux typés pour chaque table
2. **Mappers** : `rowToX()` convertit snake_case SQL → camelCase TS
3. **fetchAll()** : charge tout depuis Supabase au démarrage
4. **Mutations** : `addX()` → insert Supabase → update local state
5. **Lookups** : `getEntityById()`, `getRelationshipsFor()`, etc.
6. **Search** : recherche locale full-text sur les entités et corpus

### Flux de données
```
UI → store.addX(data) → supabase.insert() → rowToX(result) → set(state)
App start → store.fetchAll() → 25 parallel queries → set(all state)
Pull-to-refresh → store.fetchAll() → refresh all
```

---

## Design system

### Palette
- **Accent** : #B45309 (amber chaud)
- **Surface** : stone-50 → stone-200
- **Entités** : bleu (personne), violet (groupe), vert (lieu), amber (événement)
- **Confiance** : vert (confirmé) → rouge (contesté) → gris (abandonné)

### Tokens (`theme.ts`)
- `Colors`, `Spacing` (xs→xxxl), `Radius` (xs→full), `FontSize` (xs→xxxl), `Shadow` (sm/md/lg)

### Composants partagés
- `Card` : conteneur avec shadow
- `EntityBadge` : icône Ionicons colorée par type
- `EntityRow` : ligne pressable avec badge + nom + chevron
- `EntityPicker` : sélecteur d'entité avec filtres type
- `ConfidencePill` : pill colorée par niveau de confiance
- `SectionHeader` : barre ambrée + label
