"use client";

import { use } from "react";
import { useResearchStore } from "@/stores/research-store";
import {
  PageHeader,
  Badge,
  Card,
  CardSection,
  ConfidenceBadge,
  HypothesisStatusBadge,
} from "@/components/ui";

export default function HypothesisDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { getHypothesisById } = useResearchStore();
  const hypothesis = getHypothesisById(id);

  if (!hypothesis) {
    return (
      <div className="py-12 text-center text-sm text-[var(--color-ink-muted)]">
        Hypothèse non trouvée.
      </div>
    );
  }

  return (
    <div>
      <PageHeader title={hypothesis.title} />

      <Card>
        <div className="flex items-center gap-2 mb-4">
          <HypothesisStatusBadge status={hypothesis.status} />
          <ConfidenceBadge level={hypothesis.confidenceLevel} />
        </div>

        <div className="mt-3">
          <p className="text-[var(--color-ink-muted)] text-xs uppercase tracking-wide mb-1">
            Description
          </p>
          <p className="text-sm text-[var(--color-ink-secondary)] leading-relaxed">
            {hypothesis.description}
          </p>
        </div>

        {hypothesis.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-4">
            {hypothesis.tags.map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>
        )}
      </Card>

      {hypothesis.notes && (
        <CardSection title="Notes & Argumentation">
          <Card>
            <p className="text-sm text-[var(--color-ink-secondary)] whitespace-pre-wrap leading-relaxed">
              {hypothesis.notes}
            </p>
          </Card>
        </CardSection>
      )}
    </div>
  );
}
