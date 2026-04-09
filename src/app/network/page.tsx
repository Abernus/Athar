"use client";

import Link from "next/link";
import { useResearchStore } from "@/stores/research-store";
import { PageHeader, Card, EntityTypeIcon, ConfidenceBadge } from "@/components/ui";
import { RELATIONSHIP_TYPE_LABELS, ENTITY_TYPE_LABELS } from "@/lib/constants";
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

export default function NetworkPage() {
  const { relationships, getEntityName: getName } = useResearchStore();

  return (
    <div>
      <PageHeader
        title="Réseau"
        description="Vue relationnelle de toutes les connexions entre entités"
      />

      {/* Simple list-based network view */}
      <div className="space-y-2">
        {relationships.map((rel) => (
          <Card key={rel.id} className="!p-3">
            <div className="flex items-center gap-2 flex-wrap">
              <Link
                href={entityHref(rel.sourceEntityType, rel.sourceEntityId)}
                className="flex items-center gap-1.5 hover:text-[var(--color-accent)] transition-colors"
              >
                <EntityTypeIcon type={rel.sourceEntityType} />
                <span className="text-sm font-medium text-[var(--color-ink)]">
                  {getName(rel.sourceEntityType, rel.sourceEntityId)}
                </span>
              </Link>

              <span className="text-xs text-[var(--color-ink-muted)] px-2">
                {rel.label || RELATIONSHIP_TYPE_LABELS[rel.relationshipType]}
              </span>

              <Link
                href={entityHref(rel.targetEntityType, rel.targetEntityId)}
                className="flex items-center gap-1.5 hover:text-[var(--color-accent)] transition-colors"
              >
                <EntityTypeIcon type={rel.targetEntityType} />
                <span className="text-sm font-medium text-[var(--color-ink)]">
                  {getName(rel.targetEntityType, rel.targetEntityId)}
                </span>
              </Link>

              <div className="ml-auto">
                <ConfidenceBadge level={rel.confidenceLevel} />
              </div>
            </div>
            {rel.notes && (
              <p className="text-xs text-[var(--color-ink-muted)] mt-1.5 ml-7">{rel.notes}</p>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
