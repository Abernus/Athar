"use client";

import Link from "next/link";
import { useResearchStore } from "@/stores/research-store";
import { PageHeader, Card, Badge } from "@/components/ui";
import { EVENT_TYPE_LABELS } from "@/lib/constants";
import { formatHistoricalDate } from "@/lib/utils";

export default function TimelinePage() {
  const { events, getPlaceById } = useResearchStore();

  // Sort events by date value (simple string sort for now)
  const sortedEvents = [...events].sort((a, b) => {
    const aVal = a.dateStart?.value || "9999";
    const bVal = b.dateStart?.value || "9999";
    return aVal.localeCompare(bVal);
  });

  return (
    <div>
      <PageHeader
        title="Chronologie"
        description="Vue temporelle des événements enregistrés"
      />

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-[79px] top-0 bottom-0 w-px bg-[var(--color-border)]" />

        <div className="space-y-0">
          {sortedEvents.map((event) => {
            const place = event.placeId ? getPlaceById(event.placeId) : undefined;
            return (
              <div key={event.id} className="flex gap-4 py-3">
                {/* Date column */}
                <div className="w-[70px] shrink-0 text-right">
                  <p className="text-xs font-medium text-[var(--color-ink)]">
                    {formatHistoricalDate(event.dateStart)}
                  </p>
                </div>

                {/* Dot */}
                <div className="relative shrink-0 flex items-start pt-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-accent)] border-2 border-white" />
                </div>

                {/* Content */}
                <Link href={`/events/${event.id}`} className="flex-1 min-w-0 -mt-0.5">
                  <Card hover className="!p-3">
                    <p className="text-sm font-medium text-[var(--color-ink)]">{event.title}</p>
                    <p className="text-xs text-[var(--color-ink-muted)] mt-0.5">
                      {EVENT_TYPE_LABELS[event.eventType]}
                      {place && ` · ${place.name}`}
                    </p>
                    {event.description && (
                      <p className="text-xs text-[var(--color-ink-secondary)] mt-1 line-clamp-2">
                        {event.description}
                      </p>
                    )}
                  </Card>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
