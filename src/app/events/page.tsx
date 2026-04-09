"use client";

import { useResearchStore } from "@/stores/research-store";
import { PageHeader } from "@/components/ui";
import { EntityListItem } from "@/components/entities";

export default function EventsPage() {
  const { events } = useResearchStore();

  return (
    <div>
      <PageHeader
        title="Événements"
        description={`${events.length} événements enregistrés`}
      />
      <div className="divide-y divide-[var(--color-border)]">
        {events.map((e) => (
          <EntityListItem key={e.id} entity={e} href={`/events/${e.id}`} />
        ))}
      </div>
    </div>
  );
}
