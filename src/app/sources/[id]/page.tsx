"use client";

import { use } from "react";
import { useResearchStore } from "@/stores/research-store";
import { PageHeader, Badge, Card, CardSection } from "@/components/ui";
import { SOURCE_TYPE_LABELS } from "@/lib/constants";
import { formatHistoricalDate } from "@/lib/utils";

export default function SourceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { getSourceById } = useResearchStore();
  const source = getSourceById(id);

  if (!source) {
    return (
      <div className="py-12 text-center text-sm text-[var(--color-ink-muted)]">
        Source non trouvée.
      </div>
    );
  }

  return (
    <div>
      <PageHeader title={source.title} />

      <Card>
        <div className="grid grid-cols-2 gap-4 text-sm mb-3">
          <div>
            <p className="text-[var(--color-ink-muted)] text-xs uppercase tracking-wide">Type</p>
            <p className="text-[var(--color-ink)]">{SOURCE_TYPE_LABELS[source.sourceType]}</p>
          </div>
          <div>
            <p className="text-[var(--color-ink-muted)] text-xs uppercase tracking-wide">Date</p>
            <p className="text-[var(--color-ink)]">{formatHistoricalDate(source.createdOrPublishedAt)}</p>
          </div>
          <div>
            <p className="text-[var(--color-ink-muted)] text-xs uppercase tracking-wide">Origine</p>
            <p className="text-[var(--color-ink)]">{source.origin || "—"}</p>
          </div>
          <div>
            <p className="text-[var(--color-ink-muted)] text-xs uppercase tracking-wide">Référence</p>
            <p className="text-[var(--color-ink)]">{source.reference || "—"}</p>
          </div>
        </div>

        {source.summary && (
          <div className="mt-4">
            <p className="text-[var(--color-ink-muted)] text-xs uppercase tracking-wide mb-1">Résumé</p>
            <p className="text-sm text-[var(--color-ink-secondary)] leading-relaxed">{source.summary}</p>
          </div>
        )}

        {source.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-4">
            {source.tags.map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>
        )}
      </Card>

      {source.criticalNote && (
        <CardSection title="Note critique">
          <Card>
            <p className="text-sm text-[var(--color-ink-secondary)] whitespace-pre-wrap leading-relaxed">
              {source.criticalNote}
            </p>
          </Card>
        </CardSection>
      )}
    </div>
  );
}
