"use client";

import { useResearchStore } from "@/stores/research-store";
import { PageHeader } from "@/components/ui";
import { EntityListItem } from "@/components/entities";

export default function PersonsPage() {
  const { persons } = useResearchStore();

  return (
    <div>
      <PageHeader
        title="Personnes"
        description={`${persons.length} personnes enregistrées`}
      />
      <div className="divide-y divide-[var(--color-border)]">
        {persons.map((p) => (
          <EntityListItem key={p.id} entity={p} href={`/persons/${p.id}`} />
        ))}
      </div>
    </div>
  );
}
