"use client";

import { use } from "react";
import Link from "next/link";
import { useResearchStore } from "@/stores/research-store";
import { PageHeader, Badge, Card, CardSection } from "@/components/ui";
import { RelationshipList } from "@/components/entities";
import { formatHistoricalDate } from "@/lib/utils";
import { EVENT_TYPE_LABELS } from "@/lib/constants";

export default function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { getEventById, getPlaceById } = useResearchStore();
  const event = getEventById(id);

  if (!event) {
    return (
      <div className="py-12 text-center text-sm text-[var(--color-ink-muted)]">
        Événement non trouvé.
      </div>
    );
  }

  const place = event.placeId ? getPlaceById(event.placeId) : undefined;

  return (
    <div>
      <PageHeader title={event.title} />

      <Card>
        <div className="grid grid-cols-2 gap-4 text-sm mb-3">
          <div>
            <p className="text-[var(--color-ink-muted)] text-xs uppercase tracking-wide">Type</p>
            <p className="text-[var(--color-ink)]">{EVENT_TYPE_LABELS[event.eventType]}</p>
          </div>
          <div>
            <p className="text-[var(--color-ink-muted)] text-xs uppercase tracking-wide">Date</p>
            <p className="text-[var(--color-ink)]">
              {formatHistoricalDate(event.dateStart)}
              {event.dateEnd && ` — ${formatHistoricalDate(event.dateEnd)}`}
            </p>
          </div>
        </div>

        {place && (
          <div className="text-sm mb-3">
            <p className="text-[var(--color-ink-muted)] text-xs uppercase tracking-wide">Lieu</p>
            <Link
              href={`/places/${place.id}`}
              className="text-[var(--color-accent)] hover:underline"
            >
              {place.name}
            </Link>
          </div>
        )}

        {event.description && (
          <p className="text-sm text-[var(--color-ink-secondary)] leading-relaxed">
            {event.description}
          </p>
        )}

        {event.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-4">
            {event.tags.map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>
        )}
      </Card>

      <CardSection title="Relations">
        <Card>
          <RelationshipList entityType="event" entityId={event.id} />
        </Card>
      </CardSection>

      {event.notes && (
        <CardSection title="Notes">
          <Card>
            <p className="text-sm text-[var(--color-ink-secondary)] whitespace-pre-wrap">
              {event.notes}
            </p>
          </Card>
        </CardSection>
      )}
    </div>
  );
}
