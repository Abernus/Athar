"use client";

import Link from "next/link";
import type { Relationship, EntityType } from "@/types";
import { useResearchStore } from "@/stores/research-store";
import { ConfidenceBadge, EntityTypeIcon } from "@/components/ui";
import { RELATIONSHIP_TYPE_LABELS } from "@/lib/constants";

interface RelationshipListProps {
  entityType: EntityType;
  entityId: string;
}

function entityHref(type: EntityType, id: string): string {
  const map: Record<EntityType, string> = {
    person: "/persons",
    group: "/groups",
    place: "/places",
    event: "/events",
  };
  return `${map[type]}/${id}`;
}

export function RelationshipList({ entityType, entityId }: RelationshipListProps) {
  const { getRelationshipsFor, getEntityName: getName } = useResearchStore();
  const relationships = getRelationshipsFor(entityType, entityId);

  if (relationships.length === 0) {
    return <p className="text-sm text-[var(--color-ink-muted)]">Aucune relation enregistrée.</p>;
  }

  return (
    <div className="space-y-2">
      {relationships.map((rel) => {
        const isSource = rel.sourceEntityType === entityType && rel.sourceEntityId === entityId;
        const otherType = isSource ? rel.targetEntityType : rel.sourceEntityType;
        const otherId = isSource ? rel.targetEntityId : rel.sourceEntityId;
        const otherName = getName(otherType, otherId);

        return (
          <Link
            key={rel.id}
            href={entityHref(otherType, otherId)}
            className="flex items-center gap-2 p-2 -mx-2 rounded hover:bg-[var(--color-surface-sunken)] transition-colors"
          >
            <EntityTypeIcon type={otherType} />
            <div className="flex-1 min-w-0">
              <span className="text-sm text-[var(--color-ink)]">{otherName}</span>
              <span className="text-xs text-[var(--color-ink-muted)] ml-2">
                {rel.label || RELATIONSHIP_TYPE_LABELS[rel.relationshipType]}
              </span>
            </div>
            <ConfidenceBadge level={rel.confidenceLevel} />
          </Link>
        );
      })}
    </div>
  );
}
