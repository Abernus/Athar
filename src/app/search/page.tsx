"use client";

import { useState } from "react";
import Link from "next/link";
import { useResearchStore } from "@/stores/research-store";
import { PageHeader, Card, EntityTypeIcon, Badge, EmptyState } from "@/components/ui";
import { ENTITY_TYPE_LABELS, SOURCE_TYPE_LABELS } from "@/lib/constants";
import { getEntityName } from "@/types";
import type { EntityType } from "@/types";

function entityHref(type: EntityType, id: string): string {
  const map: Record<EntityType, string> = {
    person: "/persons",
    group: "/groups",
    place: "/places",
    event: "/events",
  };
  return `${map[type]}/${id}`;
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const { searchAll } = useResearchStore();

  const results = query.length >= 2 ? searchAll(query) : null;
  const totalResults = results
    ? results.entities.length +
      results.sources.length +
      results.hypotheses.length +
      results.archives.length +
      results.testimonies.length
    : 0;

  return (
    <div>
      <PageHeader title="Recherche" />

      {/* Search input */}
      <div className="mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher des personnes, groupes, lieux, événements, sources..."
          className="w-full px-4 py-2.5 text-sm border border-[var(--color-border)] rounded-lg bg-[var(--color-surface)] text-[var(--color-ink)] placeholder:text-[var(--color-ink-muted)] focus:outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] transition-colors"
          autoFocus
        />
      </div>

      {/* Results */}
      {query.length >= 2 && results && (
        <div>
          <p className="text-xs text-[var(--color-ink-muted)] mb-4">
            {totalResults} résultat{totalResults !== 1 ? "s" : ""} pour &ldquo;{query}&rdquo;
          </p>

          {totalResults === 0 && (
            <EmptyState
              title="Aucun résultat"
              description="Essayez avec d'autres termes de recherche."
            />
          )}

          {/* Entities */}
          {results.entities.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xs font-medium text-[var(--color-ink-secondary)] uppercase tracking-wide mb-2">
                Entités ({results.entities.length})
              </h2>
              <div className="space-y-2">
                {results.entities.map((entity) => (
                  <Link
                    key={`${entity.entityType}-${entity.id}`}
                    href={entityHref(entity.entityType, entity.id)}
                  >
                    <Card hover className="!p-3">
                      <div className="flex items-center gap-2">
                        <EntityTypeIcon type={entity.entityType} />
                        <span className="text-sm font-medium text-[var(--color-ink)]">
                          {getEntityName(entity)}
                        </span>
                        <Badge variant="outline">
                          {ENTITY_TYPE_LABELS[entity.entityType]}
                        </Badge>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Sources */}
          {results.sources.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xs font-medium text-[var(--color-ink-secondary)] uppercase tracking-wide mb-2">
                Sources ({results.sources.length})
              </h2>
              <div className="space-y-2">
                {results.sources.map((source) => (
                  <Link key={source.id} href={`/sources/${source.id}`}>
                    <Card hover className="!p-3">
                      <p className="text-sm font-medium text-[var(--color-ink)]">{source.title}</p>
                      <p className="text-xs text-[var(--color-ink-muted)]">
                        {SOURCE_TYPE_LABELS[source.sourceType]}
                      </p>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Hypotheses */}
          {results.hypotheses.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xs font-medium text-[var(--color-ink-secondary)] uppercase tracking-wide mb-2">
                Hypothèses ({results.hypotheses.length})
              </h2>
              <div className="space-y-2">
                {results.hypotheses.map((h) => (
                  <Link key={h.id} href={`/hypotheses/${h.id}`}>
                    <Card hover className="!p-3">
                      <p className="text-sm font-medium text-[var(--color-ink)]">{h.title}</p>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Archives */}
          {results.archives.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xs font-medium text-[var(--color-ink-secondary)] uppercase tracking-wide mb-2">
                Archives ({results.archives.length})
              </h2>
              <div className="space-y-2">
                {results.archives.map((a) => (
                  <Link key={a.id} href={`/archives/${a.id}`}>
                    <Card hover className="!p-3">
                      <p className="text-sm font-medium text-[var(--color-ink)]">{a.title}</p>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Testimonies */}
          {results.testimonies.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xs font-medium text-[var(--color-ink-secondary)] uppercase tracking-wide mb-2">
                Témoignages ({results.testimonies.length})
              </h2>
              <div className="space-y-2">
                {results.testimonies.map((ot) => (
                  <Card key={ot.id} className="!p-3">
                    <p className="text-sm font-medium text-[var(--color-ink)]">{ot.title}</p>
                    <p className="text-xs text-[var(--color-ink-muted)]">{ot.speaker}</p>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {query.length > 0 && query.length < 2 && (
        <p className="text-xs text-[var(--color-ink-muted)]">
          Saisissez au moins 2 caractères pour lancer la recherche.
        </p>
      )}
    </div>
  );
}
