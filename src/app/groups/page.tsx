"use client";

import { useResearchStore } from "@/stores/research-store";
import { PageHeader } from "@/components/ui";
import { EntityListItem } from "@/components/entities";

export default function GroupsPage() {
  const { groups } = useResearchStore();

  return (
    <div>
      <PageHeader
        title="Groupes"
        description={`${groups.length} groupes enregistrés`}
      />
      <div className="divide-y divide-[var(--color-border)]">
        {groups.map((g) => (
          <EntityListItem key={g.id} entity={g} href={`/groups/${g.id}`} />
        ))}
      </div>
    </div>
  );
}
