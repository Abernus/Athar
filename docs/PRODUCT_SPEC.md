# Athar (أثر) — Spec produit

> **Athar** — L'atelier d'enquête historique
> Transformer des traces hétérogènes en dossiers de recherche structurés, argumentés et vérifiables.

---

## 1. Vision produit

Athar est une application conçue pour aider les historiens, chercheurs, documentalistes, enquêteurs du passé et porteurs de mémoire à **construire un savoir historique traçable** à partir de sources dispersées, incomplètes, parfois contradictoires.

L'objectif est de fournir un **workbench de recherche historique** : un espace où l'on collecte, annote, croise, hiérarchise, met en doute, contextualise et publie.

### Promesse centrale
> Transformer des traces hétérogènes en dossiers de recherche structurés, argumentés et vérifiables.

---

## 2. Différence avec Silsila

| | Silsila | Athar |
|---|---|---|
| Centre | La famille | Les sources |
| Objet | La mémoire intime | Le dossier de recherche |
| Ton | Émotionnel, transmission | Méthodique, critique |
| Entrée | L'arbre généalogique | L'enquête / le dossier |
| Valeur | Conserver ce qu'on veut transmettre | Démontrer ce qu'on peut établir |

**Silsila conserve ce que les familles veulent transmettre.**
**Athar organise ce que les historiens doivent démontrer.**

---

## 3. Positionnement

Athar **n'est pas** :
- un arbre généalogique plus sérieux
- un album de souvenirs amélioré
- un Notion historique

Athar **est** :
- un atelier de recherche historique
- un graphe documentaire critique
- un système d'enquête sur sources
- un environnement pour produire une connaissance traçable

---

## 4. Utilisateurs cibles

1. **Historien universitaire** — corpus, archives, thèses, articles
2. **Chercheur indépendant** — enquête sur une région, un conflit, une lignée
3. **Documentaliste / archiviste** — fonds, métadonnées, analyse
4. **Enquêteur mémoire / histoire orale** — témoignages, photos terrain, variantes de récits
5. **Journaliste / auteur non-fiction** — personnes, événements, sources, contradictions

---

## 5. Problèmes résolus

- Sources éclatées dans plusieurs supports
- Notes dispersées entre carnets, Word, PDF, photos, tableurs
- Noms variant selon langues, époques et orthographes
- Contradictions entre témoignages et archives
- Difficulté à distinguer fait, assertion, hypothèse et interprétation
- Impossibilité de visualiser chronologie, lieux et réseaux
- Perte de traçabilité entre affirmation et sources

---

## 6. Principes produit

1. **Source-first** : toute affirmation doit pouvoir être reliée à une ou plusieurs sources
2. **Séparation du certain et de l'incertain** : ne jamais mélanger fait attesté et hypothèse
3. **Traçabilité complète** : chaque interprétation remontable à ses appuis documentaires
4. **Pluralité des récits** : les contradictions visibles, pas écrasées
5. **Temps et contexte** : distinguer date du fait, date du document, date du témoignage, date de l'analyse
6. **Historien augmenté, pas remplacé** : l'outil structure, il ne pense pas à la place du chercheur
7. **Dossier avant arbre** : le point d'entrée est l'enquête, pas la parenté

---

## 7. Objets métiers

### 7.1 Dossier de recherche
Unité centrale. Contient : titre, problématique, résumé, période, aire géographique, mots-clés, statut, hypothèses, entités liées, bibliographie, sources, questions ouvertes, zones d'incertitude.

### 7.2 Source
Trace mobilisée : archive, lettre, photo, journal, article, jugement, registre, document militaire, témoignage oral, ouvrage secondaire.

### 7.3 Extrait
Fragment précis d'une source : citation, passage d'entretien, page numérisée, timestamp audio/vidéo, zone d'image annotée.

### 7.4 Entité historique
Personne, lieu, organisation, événement, unité, groupe, concept/thème.

### 7.5 Hypothèse
Proposition de lecture du chercheur, plus ou moins solide.

### 7.6 Assertion
Énoncé attribué à une source ou un témoin.

### 7.7 Fait attesté
Élément jugé suffisamment établi au regard des preuves.

### 7.8 Relation
Lien entre deux objets : participe à, mentionne, contredit, confirme, appartient à, localisé à, dépend de, témoigne de, même identité probable que.

### 7.9 Note de recherche
Note libre liée à source, entité, hypothèse ou dossier.

### 7.10 Publication / sortie
Synthèse ou export.

---

## 8. Modules fonctionnels

### 8.1 Dossiers
Créer, structurer, suivre des enquêtes par problématique. Vue dossier : résumé, chronologie, carte, sources, hypothèses, contradictions, entités, carnet.

### 8.2 Sources
Décrire, organiser, qualifier. Métadonnées : titre, type, auteur, date production, date faits, langue, cote, fonds, support, fiabilité, biais, résumé. Import document/photo/PDF/audio/vidéo. Transcription, traduction, annotation par extrait.

Distinction analytique :
- ce que la source dit explicitement
- ce que la source suggère
- ce qui est hypothétique
- limites / biais / réserves

### 8.3 Extraits & annotations
Sélectionner un extrait texte, zone image, segment audio/vidéo. Annoter, associer à entité/événement, classer : preuve, indice, contexte, contradiction, doute. Générer citation.

### 8.4 Entités historiques
Types : personne, lieu, organisation, unité, événement, groupe, thème/concept. Alias, variantes orthographiques, noms multilingues, identité probable/contestée, périodes d'activité.

### 8.5 Chronologie critique
Frise globale, par dossier, par entité. Couches : faits / documents / témoignages / analyses. Dates floues. Contradictions temporelles. Distinction : date du fait / date de la source / date du témoignage / date de l'analyse.

### 8.6 Cartographie historique
Fiche lieu, géolocalisation (précise/approximative), toponymes multiples, couches historiques, trajets, zones d'opérations. Degré de certitude : exact, probable, approximatif, inconnu.

### 8.7 Hypothèses & controverses
Créer hypothèse, arguments pour/contre, sources en soutien/contestation, hypothèses concurrentes. Statuts : confirmé, probable, hypothétique, contesté, réfuté, indéterminé.

### 8.8 Réseau relationnel
Graphe interactif, filtrage par période et type de lien. Types : parenté, voisinage, alliance, commandement, subordination, appartenance, dénonciation, protection, co-présence, collaboration, opposition, même identité probable.

### 8.9 Corpus
Import corpus, OCR, transcription assistée, recherche plein texte, surlignage entités, variantes orthographiques, comparaison documents, index thématique, cooccurrences.

### 8.10 Carnet de recherche
Journal daté, notes terrain, pistes à vérifier, hypothèses en cours, pistes abandonnées, tâches, rappels, liens vers sources et entités.

### 8.11 Histoire orale / terrain
Enregistrement audio/vidéo, notes simultanées, fiche témoin, guide d'entretien, transcription, traduction, annotation, indexation, droits/consentement, sensibilité, checklist mission, photos terrain.

### 8.12 Rédaction & publication
Fiche synthèse, chronologie commentée, export Word/Markdown/PDF, bibliographie, citations normalisées, plan de chapitre, résumé acteurs/lieux/événements/sources, carte/frise narrative, dossier démonstratif.

---

## 9. Distinctions métier structurantes

| Catégorie | Définition |
|---|---|
| Fait attesté | Élément jugé suffisamment établi |
| Assertion de source | Ce qu'une source affirme |
| Hypothèse | Proposition du chercheur |
| Interprétation | Lecture historiographique ou analytique |
| Controverse | Point de divergence non résolu |
| Réfutation | Élément rejeté à l'issue de l'analyse |

---

## 10. Parcours principaux

### 10.1 Créer un dossier
Créer → définir période/espace/problématique → ajouter sources → créer entités → annoter extraits → formuler hypothèses → visualiser frise/carte

### 10.2 Étudier une source
Importer → décrire métadonnées → transcrire/traduire → découper en extraits → annoter → relier aux entités → qualifier fiabilité

### 10.3 Construire une démonstration
Identifier affirmation → lister sources soutien → lister sources contestation → distinguer fait/assertion/hypothèse → synthèse argumentée → export

### 10.4 Enquête terrain
Préparer mission → définir personnes/lieux → enregistrer entretiens → importer photos → indexer → croiser avec archives

---

## 11. Modèle de données conceptuel

### Tables principales
- research_project, research_project_tag
- source, source_file, source_excerpt, source_annotation
- historical_entity, entity_alias, entity_relationship
- event, place, organization
- hypothesis, claim, evidence_link, contradiction
- research_note
- field_mission, interview_session
- bibliography_entry
- export_job

*(Détail complet dans le schéma SQL Supabase)*

---

## 12. Direction UX

### Ton
Sérieux, lisible, sobre, méthodique, élégant mais non sentimental.

### Logique visuelle
- Priorité à la lisibilité documentaire
- Codes d'incertitude visibles
- Hiérarchie claire fait/source/hypothèse
- Navigation orientée travail

### Principes UI
- Filtres puissants
- Vues croisées
- Accès rapide à la source d'une affirmation
- Traçabilité toujours visible
- Multivues : liste / carte / frise / graphe / carnet

---

## 13. Roadmap

### V1 — Socle différenciant
- [x] Entités : personnes, groupes, lieux, événements
- [x] Relations entre entités
- [x] Niveaux de confiance
- [x] Capture terrain (photo, audio)
- [x] Recherche
- [x] Supabase backend
- [ ] **Dossiers de recherche**
- [ ] **Sources (gestion complète + UI)**
- [ ] **Extraits & annotations**
- [ ] **Hypothèses (UI)**
- [ ] **Chronologie critique**
- [ ] **Cartographie historique**
- [ ] **Carnet de recherche**
- [ ] **Exports Markdown / PDF**

### V2 — Renforcement métier
- [ ] Graphe relationnel interactif
- [ ] Contradictions structurées
- [ ] Variantes de noms / identités incertaines
- [ ] Corpus + OCR + indexation plein texte
- [ ] Histoire orale enrichie
- [ ] Bibliographie
- [ ] Collaboration multi-utilisateur

### V3 — Niveau expert / labo
- [ ] Prosopographie
- [ ] Chaîne de preuve
- [ ] Analyse de réseaux avancée
- [ ] Publication publique scénarisée
- [ ] Suggestions de rapprochement d'entités
- [ ] Comparaisons multi-corpus

---

## 14. Fonctionnalités premium / avancées

- **Identités incertaines** : fusion prudente, doublons provisoires, homonymes
- **Variantes linguistiques** : arabe/français/translittérations, noms coloniaux/postcoloniaux
- **Chaîne de preuve** : sources → extraits → sauts interprétatifs → maillons fragiles
- **Prosopographie** : fiches structurées, champs comparables, statistiques
- **Analyse de réseau** : centralité, communautés, ponts, dynamiques temporelles
- **Publication scénarisée** : mini-site, frise narrative, carte annotée, dossier partageable

---

## 15. Permissions (futur)

### V1
Propriétaire / éditeur / lecteur

### V2
Chercheur principal / co-chercheur / assistant documentaire / annotateur / relecteur / publicateur

---

## 16. Ce qu'il faut éviter

Pour préserver la différence avec Silsila, éviter comme coeur produit :
- feed social familial
- souvenirs du quotidien
- capsules intergénérationnelles
- groupes familiaux comme structure principale
- ton émotionnel comme première couche UX
- arbre généalogique comme entrée par défaut

---

## 17. Extensions écosystème

Un pont Silsila ↔ Athar pourra exister :
- Silsila = espace de collecte mémoire familiale
- Athar = espace d'enquête historique critique

Les deux produits restent distincts dans leur ADN, vocabulaire, UX et promesses.
