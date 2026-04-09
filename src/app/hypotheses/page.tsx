"use client";

import Link from "next/link";
import { useResearchStore } from "@/stores/research-store";
import { PageHeader, Card, ConfidenceBadge, HypothesisStatusBadge } from "@/components/ui";

export default function HypothesesPage() {
  const { hypotheses } = useResearchStore();

  return (
    <div>
      <PageHeader
        title="Hypothèses"
        description={`${hypotheses.length} hypothèses enregistrées`}
      />
      <div className="space-y-3">
        {hypotheses.map((h) => (
          <Link key={h.id} href={`/hypotheses/${h.id}`}>
            <Card hover>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--color-ink)]">{h.title}</p>
                  <p className="text-xs text-[var(--color-ink-secondary)] mt-1 line-clamp-2">
                    {h.description}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <HypothesisStatusBadge status={h.status} />
                  <ConfidenceBadge level={h.confidenceLevel} />
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
