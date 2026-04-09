"use client";

import { use } from "react";
import { useResearchStore } from "@/stores/research-store";
import { PageHeader, Badge, Card, CardSection } from "@/components/ui";
import { RelationshipList } from "@/components/entities";
import { formatHistoricalDate } from "@/lib/utils";
import { GROUP_TYPE_LABELS } from "@/lib/constants";

export default function GroupDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { getGroupById } = useResearchStore();
  const group = getGroupById(id);

  if (!group) {
    return (
      <div className="py-12 text-center text-sm text-[var(--color-ink-muted)]">
        Groupe non trouvé.
      </div>
    );
  }

  return (
    <div>
      <PageHeader title={group.name} />

      <Card>
        <div className="grid grid-cols-2 gap-4 text-sm mb-3">
          <div>
            <p className="text-[var(--color-ink-muted)] text-xs uppercase tracking-wide">Type</p>
            <p className="text-[var(--color-ink)]">{GROUP_TYPE_LABELS[group.groupType]}</p>
          </div>
          {group.timeRange && (
            <div>
              <p className="text-[var(--color-ink-muted)] text-xs uppercase tracking-wide">Période</p>
              <p className="text-[var(--color-ink)]">
                {formatHistoricalDate(group.timeRange.start)} — {formatHistoricalDate(group.timeRange.end)}
              </p>
            </div>
          )}
        </div>

        {group.summary && (
          <p className="text-sm text-[var(--color-ink-secondary)] leading-relaxed">{group.summary}</p>
        )}

        {group.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-4">
            {group.tags.map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>
        )}
      </Card>

      <CardSection title="Relations">
        <Card>
          <RelationshipList entityType="group" entityId={group.id} />
        </Card>
      </CardSection>

      {group.notes && (
        <CardSection title="Notes">
          <Card>
            <p className="text-sm text-[var(--color-ink-secondary)] whitespace-pre-wrap">{group.notes}</p>
          </Card>
        </CardSection>
      )}
    </div>
  );
}
