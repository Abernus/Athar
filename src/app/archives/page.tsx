"use client";

import Link from "next/link";
import { useResearchStore } from "@/stores/research-store";
import { PageHeader, Card, Badge } from "@/components/ui";
import { ARCHIVE_TYPE_LABELS } from "@/lib/constants";
import { formatHistoricalDate } from "@/lib/utils";

export default function ArchivesPage() {
  const { archiveItems, oralTestimonies } = useResearchStore();

  return (
    <div>
      <PageHeader
        title="Archives & Témoignages"
        description={`${archiveItems.length} archives, ${oralTestimonies.length} témoignages`}
      />

      {/* Archive items */}
      <h2 className="text-sm font-medium text-[var(--color-ink-secondary)] mb-3 uppercase tracking-wide">
        Archives
      </h2>
      <div className="space-y-3 mb-8">
        {archiveItems.map((a) => (
          <Link key={a.id} href={`/archives/${a.id}`}>
            <Card hover>
              <p className="text-sm font-medium text-[var(--color-ink)]">{a.title}</p>
              <p className="text-xs text-[var(--color-ink-muted)] mt-0.5">
                {ARCHIVE_TYPE_LABELS[a.archiveType]}
                {a.dateOrPeriod && ` · ${formatHistoricalDate(a.dateOrPeriod)}`}
              </p>
              <p className="text-xs text-[var(--color-ink-secondary)] mt-1 line-clamp-2">
                {a.description}
              </p>
              {a.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {a.tags.slice(0, 4).map((tag) => (
                    <Badge key={tag}>{tag}</Badge>
                  ))}
                </div>
              )}
            </Card>
          </Link>
        ))}
      </div>

      {/* Oral testimonies */}
      <h2 className="text-sm font-medium text-[var(--color-ink-secondary)] mb-3 uppercase tracking-wide">
        Témoignages oraux
      </h2>
      <div className="space-y-3">
        {oralTestimonies.map((ot) => (
          <Card key={ot.id}>
            <p className="text-sm font-medium text-[var(--color-ink)]">{ot.title}</p>
            <p className="text-xs text-[var(--color-ink-muted)] mt-0.5">
              {ot.speaker} · Entretien par {ot.interviewer}
              {ot.recordedAt && ` · ${formatHistoricalDate(ot.recordedAt)}`}
            </p>
            <p className="text-xs text-[var(--color-ink-secondary)] mt-1 line-clamp-2">
              {ot.summary}
            </p>
            {ot.trustNote && (
              <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-1 mt-2">
                {ot.trustNote}
              </p>
            )}
            {ot.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {ot.tags.slice(0, 4).map((tag) => (
                  <Badge key={tag}>{tag}</Badge>
                ))}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
