"use client";

import { useResearchStore } from "@/stores/research-store";
import { PageHeader } from "@/components/ui";
import { EntityListItem } from "@/components/entities";

export default function PlacesPage() {
  const { places } = useResearchStore();

  return (
    <div>
      <PageHeader
        title="Lieux"
        description={`${places.length} lieux enregistrés`}
      />
      <div className="divide-y divide-[var(--color-border)]">
        {places.map((p) => (
          <EntityListItem key={p.id} entity={p} href={`/places/${p.id}`} />
        ))}
      </div>
    </div>
  );
}
