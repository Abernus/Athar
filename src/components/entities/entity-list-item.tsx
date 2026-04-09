"use client";

import Link from "next/link";
import type { AnyEntity } from "@/types";
import { getEntityName } from "@/types";
import { EntityTypeIcon, Badge, ConfidenceBadge } from "@/components/ui";
import { formatHistoricalDate } from "@/lib/utils";

interface EntityListItemProps {
  entity: AnyEntity;
  href: string;
}

export function EntityListItem({ entity, href }: EntityListItemProps) {
  return (
    <Link
      href={href}
      className="flex items-start gap-3 p-3 -mx-3 rounded-lg transition-colors hover:bg-[var(--color-surface-sunken)]"
    >
      <EntityTypeIcon type={entity.entityType} size="md" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[var(--color-ink)]">
          {getEntityName(entity)}
        </p>
        {entity.entityType === "person" && entity.alternateNames.length > 0 && (
          <p className="text-xs text-[var(--color-ink-muted)]">
            {entity.alternateNames.join(", ")}
          </p>
        )}
        <p className="text-xs text-[var(--color-ink-secondary)] mt-0.5 line-clamp-2">
          {entity.entityType === "person" && (
            <>
              {formatHistoricalDate(entity.birthDate)}
              {entity.deathDate && ` — ${formatHistoricalDate(entity.deathDate)}`}
              {entity.summary && ` · ${entity.summary}`}
            </>
          )}
          {entity.entityType === "group" && entity.summary}
          {entity.entityType === "place" && entity.summary}
          {entity.entityType === "event" && entity.description}
        </p>
        {entity.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1.5">
            {entity.tags.slice(0, 4).map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
