"use client";

import { use } from "react";
import { useResearchStore } from "@/stores/research-store";
import { PageHeader, Badge, ConfidenceBadge, CardSection, Card } from "@/components/ui";
import { RelationshipList } from "@/components/entities";
import { formatHistoricalDate } from "@/lib/utils";

export default function PersonDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { getPersonById } = useResearchStore();
  const person = getPersonById(id);

  if (!person) {
    return (
      <div className="py-12 text-center text-sm text-[var(--color-ink-muted)]">
        Personne non trouvée.
      </div>
    );
  }

  return (
    <div>
      <PageHeader title={person.primaryName} />

      <Card>
        {/* Alternate names */}
        {person.alternateNames.length > 0 && (
          <p className="text-sm text-[var(--color-ink-secondary)] mb-3">
            Aussi connu(e) comme : {person.alternateNames.join(", ")}
          </p>
        )}

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-[var(--color-ink-muted)] text-xs uppercase tracking-wide">Naissance</p>
            <p className="text-[var(--color-ink)]">{formatHistoricalDate(person.birthDate)}</p>
          </div>
          <div>
            <p className="text-[var(--color-ink-muted)] text-xs uppercase tracking-wide">Décès</p>
            <p className="text-[var(--color-ink)]">{formatHistoricalDate(person.deathDate)}</p>
          </div>
        </div>

        {/* Summary */}
        {person.summary && (
          <p className="mt-4 text-sm text-[var(--color-ink-secondary)] leading-relaxed">
            {person.summary}
          </p>
        )}

        {/* Tags */}
        {person.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-4">
            {person.tags.map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>
        )}
      </Card>

      {/* Relations */}
      <CardSection title="Relations">
        <Card>
          <RelationshipList entityType="person" entityId={person.id} />
        </Card>
      </CardSection>

      {/* Notes */}
      {person.notes && (
        <CardSection title="Notes">
          <Card>
            <p className="text-sm text-[var(--color-ink-secondary)] whitespace-pre-wrap">
              {person.notes}
            </p>
          </Card>
        </CardSection>
      )}
    </div>
  );
}
