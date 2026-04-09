"use client";

import { use } from "react";
import Link from "next/link";
import { useResearchStore } from "@/stores/research-store";
import { PageHeader, Badge, Card, CardSection, EntityTypeIcon } from "@/components/ui";
import { ARCHIVE_TYPE_LABELS, ENTITY_TYPE_LABELS } from "@/lib/constants";
import { formatHistoricalDate } from "@/lib/utils";

function entityHref(type: string, id: string): string {
  const map: Record<string, string> = {
    person: "/persons",
    group: "/groups",
    place: "/places",
    event: "/events",
  };
  return `${map[type] || "/"}/${id}`;
}

export default function ArchiveDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { archiveItems, getEntityName: getName } = useResearchStore();
  const archive = archiveItems.find((a) => a.id === id);

  if (!archive) {
    return (
      <div className="py-12 text-center text-sm text-[var(--color-ink-muted)]">
        Archive non trouvée.
      </div>
    );
  }

  return (
    <div>
      <PageHeader title={archive.title} />

      <Card>
        <div className="grid grid-cols-2 gap-4 text-sm mb-3">
          <div>
            <p className="text-[var(--color-ink-muted)] text-xs uppercase tracking-wide">Type</p>
            <p className="text-[var(--color-ink)]">{ARCHIVE_TYPE_LABELS[archive.archiveType]}</p>
          </div>
          <div>
            <p className="text-[var(--color-ink-muted)] text-xs uppercase tracking-wide">Période</p>
            <p className="text-[var(--color-ink)]">{formatHistoricalDate(archive.dateOrPeriod)}</p>
          </div>
        </div>

        {archive.description && (
          <p className="text-sm text-[var(--color-ink-secondary)] leading-relaxed mt-3">
            {archive.description}
          </p>
        )}

        {archive.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-4">
            {archive.tags.map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>
        )}
      </Card>

      {archive.linkedEntityIds.length > 0 && (
        <CardSection title="Entités liées">
          <Card>
            <div className="space-y-2">
              {archive.linkedEntityIds.map((link) => (
                <Link
                  key={`${link.entityType}-${link.entityId}`}
                  href={entityHref(link.entityType, link.entityId)}
                  className="flex items-center gap-2 p-2 -mx-2 rounded hover:bg-[var(--color-surface-sunken)] transition-colors"
                >
                  <EntityTypeIcon type={link.entityType} />
                  <span className="text-sm text-[var(--color-ink)]">
                    {getName(link.entityType, link.entityId)}
                  </span>
                </Link>
              ))}
            </div>
          </Card>
        </CardSection>
      )}

      {archive.notes && (
        <CardSection title="Notes">
          <Card>
            <p className="text-sm text-[var(--color-ink-secondary)] whitespace-pre-wrap">
              {archive.notes}
            </p>
          </Card>
        </CardSection>
      )}
    </div>
  );
}
