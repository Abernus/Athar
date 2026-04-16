# Athar — Architecture

## Vue d'ensemble

```
┌─────────────────────────────────────────────────┐
│                  App Mobile                      │
│              (Expo / React Native)               │
│                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │  Screens │  │Components│  │  Store   │      │
│  │  (31)    │  │  (6)     │  │ (Zustand)│      │
│  └────┬─────┘  └──────────┘  └────┬─────┘      │
│       │                           │              │
│       └───────────┬───────────────┘              │
│                   │                              │
│          ┌────────▼────────┐                     │
│          │  Supabase Client│                     │
│          │  (schema: athar)│                     │
│          └────────┬────────┘                     │
└───────────────────┼──────────────────────────────┘
                    │ HTTPS
         ┌──────────▼──────────┐
         │      Supabase       │
         │                     │
         │  ┌───────────────┐  │
         │  │  PostgreSQL   │  │
         │  │  (25 tables)  │  │
         │  │  schema:athar │  │
         │  └───────────────┘  │
         │                     │
         │  ┌───────────────┐  │
         │  │   Storage     │  │
         │  │  (photos,     │  │
         │  │   audio)      │  │
         │  └───────────────┘  │
         │                     │
         │  ┌───────────────┐  │
         │  │   Auth        │  │
         │  │  (futur)      │  │
         │  └───────────────┘  │
         └─────────────────────┘
```

---

## Architecture de l'app

### Pattern : Feature-based file routing

L'app utilise expo-router (file-based routing) où chaque fichier dans `app/` correspond à un écran.

```
app/
├── (tabs)/          # Tab navigator — 5 onglets visibles + 2 cachés
├── add/             # 15 formulaires de création (modals)
├── capture/         # Photo + voice (modals)
├── entity/          # Fiche entité dynamique [type]/[id]
├── project/         # Fiche dossier [id]
├── source/          # Fiche source [id]
├── export/          # Export dossier
├── network.tsx      # Graphe relationnel
└── _layout.tsx      # Stack navigator racine
```

### Navigation

```
Stack (racine)
├── (tabs)
│   ├── Accueil        → index.tsx
│   ├── Dossiers       → projects.tsx
│   ├── Ajouter        → capture.tsx (hub central)
│   ├── Frise          → timeline.tsx
│   └── Chercher       → search.tsx
│   (hidden: browse.tsx, map.tsx)
│
├── Modals (presentation: "modal")
│   ├── add/person, group, place, event
│   ├── add/project, source, hypothesis, note
│   ├── add/relationship, contradiction, bibliography
│   ├── add/witness, mission, evidence-chain, cohort
│   ├── capture/photo, capture/voice
│   └── export/project
│
└── Screens (push)
    ├── entity/[type]/[id]
    ├── project/[id]
    ├── source/[id]
    └── network
```

---

## Flux de données

### Architecture Zustand + Supabase

```
┌────────────────────────────────────────┐
│             Zustand Store              │
│                                        │
│  ┌─────────┐  ┌─────────┐  ┌───────┐ │
│  │ persons │  │ sources │  │ etc.  │ │
│  │ groups  │  │ excerpts│  │ (25   │ │
│  │ places  │  │ notes   │  │ tables│ │
│  │ events  │  │ hypo.   │  │  )    │ │
│  └─────────┘  └─────────┘  └───────┘ │
│                                        │
│  ┌─────────────────────────────────┐  │
│  │ fetchAll()                      │  │
│  │ 25 parallel supabase.select()   │  │
│  │ → map rows → set state          │  │
│  └─────────────────────────────────┘  │
│                                        │
│  ┌─────────────────────────────────┐  │
│  │ addX(data)                      │  │
│  │ → supabase.insert()            │  │
│  │ → rowToX(result)               │  │
│  │ → set(state => [...])          │  │
│  └─────────────────────────────────┘  │
│                                        │
│  ┌─────────────────────────────────┐  │
│  │ Lookups (synchrones)            │  │
│  │ getEntityById, searchAll, etc.  │  │
│  └─────────────────────────────────┘  │
└────────────────────────────────────────┘
```

### Cycle de vie

1. **App start** → `_layout.tsx` appelle `fetchAll()`
2. **Loading** → `loading: true`, `initialized: false`
3. **Ready** → `loading: false`, `initialized: true`
4. **Mutation** → `addX()` → Supabase insert → local state update
5. **Refresh** → Pull-to-refresh → `fetchAll()` (re-sync complet)

---

## Modèle de données

### Graphe relationnel

```
Person ←──→ Relationship ←──→ Person/Group/Place/Event
  │                              │
  ├── EntityAlias (variantes)    ├── EntityAlias
  │                              │
  └── ProsopographyEntry ───→ ProsopographyCohort
                                 │
Research Project                 │
  ├── Sources ─→ SourceExcerpts  │
  ├── Hypotheses                 │
  ├── Contradictions             │
  ├── ResearchNotes              │
  ├── EvidenceChains ─→ ChainLinks
  └── Publications

Capture terrain
  ├── ArchiveItems (photos) ─→ linkedEntityIds
  ├── OralTestimonies ─→ linkedEntityIds
  ├── Witnesses ─→ InterviewSessions
  └── FieldMissions

Référence
  └── BibliographyEntries
```

### Mapping SQL ↔ TypeScript

| Convention SQL | Convention TypeScript |
|---|---|
| `snake_case` | `camelCase` |
| `uuid` | `string` |
| `text[]` | `string[]` |
| `jsonb` | `Record<string, any>` ou type dédié |
| `timestamptz` | `string` (ISO) |
| `boolean` | `boolean` |

Chaque table a un mapper `rowToX()` dans le store qui effectue la conversion.

---

## Sécurité

### État actuel (développement)
- RLS activé sur toutes les tables
- Policies permissives (`using (true)`)
- Pas d'authentification
- Clé anon exposée côté client

### Plan sécurité (production)
1. Ajouter Supabase Auth (email/password ou OAuth)
2. Remplacer policies par `auth.uid() = user_id`
3. Ajouter colonne `user_id` à chaque table
4. Storage : policies par bucket (photos privées, audio privé)
5. Sensibilité des témoignages : champ `sensitivity_level` déjà en place

---

## Performance

### Stratégies actuelles
- **Fetch initial** : 25 queries parallèles via `Promise.all`
- **State local** : toute la data en mémoire (rapide pour petits corpus)
- **Recherche locale** : pas de round-trip réseau pour search
- **Pull-to-refresh** : re-sync complet

### Évolutions prévues
- Pagination pour les corpus volumineux
- Incremental sync (Supabase Realtime)
- Cache local (AsyncStorage ou SQLite)
- Lazy loading des fiches détaillées

---

## Tests

### Non implémentés (à venir)
- Tests unitaires : Zustand store + mappers
- Tests d'intégration : formulaires de création
- Tests E2E : parcours utilisateur complet

### Validation actuelle
- TypeScript strict (`"strict": true`)
- Expo Metro bundler (erreurs de compilation)
- Test manuel via Expo Go
