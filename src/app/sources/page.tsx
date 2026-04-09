"use client";

import Link from "next/link";
import { useResearchStore } from "@/stores/research-store";
import { PageHeader, Card, Badge } from "@/components/ui";
import { SOURCE_TYPE_LABELS } from "@/lib/constants";
import { formatHistoricalDate } from "@/lib/utils";

export default function SourcesPage() {
  const { sources } = useResearchStore();

  return (
    <div>
      <PageHeader
        title="Sources"
        description={`${sources.length} sources enregistrées`}
      />
      <div className="space-y-3">
        {sources.map((s) => (
          <Link key={s.id} href={`/sources/${s.id}`}>
            <Card hover>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--color-ink)]">{s.title}</p>
                  <p className="text-xs text-[var(--color-ink-muted)] mt-0.5">
                    {SOURCE_TYPE_LABELS[s.sourceType]}
                    {s.createdOrPublishedAt && ` · ${formatHistoricalDate(s.createdOrPublishedAt)}`}
                  </p>
                  <p className="text-xs text-[var(--color-ink-secondary)] mt-1 line-clamp-2">
                    {s.summary}
                  </p>
                </div>
              </div>
              {s.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {s.tags.slice(0, 4).map((tag) => (
                    <Badge key={tag}>{tag}</Badge>
                  ))}
                </div>
              )}
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
