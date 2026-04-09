"use client";

import { PageHeader, Card, CardSection } from "@/components/ui";
import { ConfidenceBadge, HypothesisStatusBadge, Badge } from "@/components/ui";
import { CONFIDENCE_LEVELS, CONFIDENCE_LABELS } from "@/lib/constants";
import { HYPOTHESIS_STATUSES, HYPOTHESIS_STATUS_LABELS } from "@/lib/constants";
import { SOURCE_TYPE_LABELS, SOURCE_TYPES } from "@/lib/constants";
import type { ConfidenceLevel, HypothesisStatus, SourceType } from "@/types";

export default function MethodologyPage() {
  return (
    <div>
      <PageHeader
        title="Méthodologie & Guide de lecture"
        description="Comment interpréter les statuts, niveaux de confiance et types de sources dans Historiens."
      />

      <div className="space-y-8">
        {/* Confidence levels */}
        <Card>
          <h2 className="text-sm font-semibold text-[var(--color-ink)] mb-1">
            Niveaux de confiance
          </h2>
          <p className="text-xs text-[var(--color-ink-secondary)] mb-4">
            Chaque fait, lien ou hypothèse est associé à un niveau de confiance reflétant
            l&apos;état actuel des preuves.
          </p>
          <div className="space-y-3">
            {CONFIDENCE_LEVELS.map((level) => (
              <div key={level} className="flex items-start gap-3">
                <div className="shrink-0 pt-0.5">
                  <ConfidenceBadge level={level} />
                </div>
                <p className="text-xs text-[var(--color-ink-secondary)]">
                  {confidenceDescriptions[level]}
                </p>
              </div>
            ))}
          </div>
        </Card>

        {/* Hypothesis statuses */}
        <Card>
          <h2 className="text-sm font-semibold text-[var(--color-ink)] mb-1">
            Statuts des hypothèses
          </h2>
          <p className="text-xs text-[var(--color-ink-secondary)] mb-4">
            Une hypothèse traverse plusieurs états au fil de la recherche.
          </p>
          <div className="space-y-3">
            {HYPOTHESIS_STATUSES.map((status) => (
              <div key={status} className="flex items-start gap-3">
                <div className="shrink-0 pt-0.5">
                  <HypothesisStatusBadge status={status} />
                </div>
                <p className="text-xs text-[var(--color-ink-secondary)]">
                  {hypothesisDescriptions[status]}
                </p>
              </div>
            ))}
          </div>
        </Card>

        {/* Source types */}
        <Card>
          <h2 className="text-sm font-semibold text-[var(--color-ink)] mb-1">
            Types de sources
          </h2>
          <p className="text-xs text-[var(--color-ink-secondary)] mb-4">
            La distinction entre les types de sources est fondamentale pour évaluer la fiabilité d&apos;une information.
          </p>
          <div className="space-y-3">
            {SOURCE_TYPES.map((type) => (
              <div key={type} className="flex items-start gap-3">
                <div className="shrink-0 pt-0.5">
                  <Badge>{SOURCE_TYPE_LABELS[type]}</Badge>
                </div>
                <p className="text-xs text-[var(--color-ink-secondary)]">
                  {sourceTypeDescriptions[type]}
                </p>
              </div>
            ))}
          </div>
        </Card>

        {/* Principles */}
        <Card>
          <h2 className="text-sm font-semibold text-[var(--color-ink)] mb-1">
            Principes de traçabilité
          </h2>
          <div className="text-xs text-[var(--color-ink-secondary)] space-y-2 mt-3">
            <p>
              1. <strong>Chaque affirmation importante doit être reliée à une source</strong> ou à une note de raisonnement explicite.
            </p>
            <p>
              2. <strong>La source n&apos;est pas la vérité</strong> — elle est un élément à interpréter, critiquer et croiser.
            </p>
            <p>
              3. <strong>L&apos;hypothèse n&apos;est pas le fait</strong> — elle est une proposition ouverte, documentée et révisable.
            </p>
            <p>
              4. <strong>La contradiction est normale</strong> — elle doit être documentée, pas masquée.
            </p>
            <p>
              5. <strong>L&apos;incertitude est une information</strong> — marquer un fait comme incertain est aussi utile que le confirmer.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}

const confidenceDescriptions: Record<ConfidenceLevel, string> = {
  confirmed:
    "Établi par au moins une source primaire fiable, corroboré si possible. Considéré comme acquis dans l'état actuel de la recherche.",
  probable:
    "Soutenu par des éléments convergents mais sans preuve définitive. Cohérent avec le contexte et les sources disponibles.",
  uncertain:
    "Repose sur des indices fragiles, un seul témoignage non corroboré, ou une déduction fragile. Nécessite des recherches complémentaires.",
  contested:
    "Fait l'objet de versions contradictoires entre sources ou entre chercheurs. La contradiction est documentée.",
  abandoned:
    "Ancienne hypothèse ou ancienne attribution désormais considérée comme erronée ou sans fondement suffisant.",
};

const hypothesisDescriptions: Record<HypothesisStatus, string> = {
  draft:
    "Idée ou intuition encore non formalisée. Pas encore d'argumentation structurée.",
  open:
    "Hypothèse formulée, en attente d'évaluation. Les sources et arguments sont en cours de collecte.",
  argued:
    "Hypothèse soutenue par des arguments et des sources, mais pas encore validée définitivement.",
  provisionally_validated:
    "Acceptée provisoirement dans l'état actuel de la recherche. Peut être révisée si de nouvelles preuves apparaissent.",
  rejected:
    "Réfutée par les sources ou l'argumentation. Conservée pour mémoire et traçabilité.",
};

const sourceTypeDescriptions: Record<SourceType, string> = {
  primary:
    "Document produit au moment des faits : acte d'état civil, registre administratif, lettre, photographie d'époque.",
  secondary:
    "Ouvrage, article ou travail de recherche analysant des sources primaires. Interprétation savante.",
  testimony:
    "Récit oral ou écrit d'un témoin direct ou indirect. Précieux mais à croiser avec d'autres sources.",
  private_archive:
    "Document conservé dans un fonds privé (famille, association). Accès et fiabilité variables.",
  internal_note:
    "Note du chercheur : raisonnement, inférence, observation. Pas une source externe.",
  other:
    "Source ne rentrant pas dans les catégories précédentes.",
};
