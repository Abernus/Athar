"use client";

import Link from "next/link";
import { useResearchStore } from "@/stores/research-store";
import { Card } from "@/components/ui";

export default function HomePage() {
  const { persons, groups, places, events, sources, hypotheses, archiveItems, oralTestimonies } =
    useResearchStore();

  const stats = [
    { label: "Personnes", count: persons.length, href: "/persons" },
    { label: "Groupes", count: groups.length, href: "/groups" },
    { label: "Lieux", count: places.length, href: "/places" },
    { label: "Événements", count: events.length, href: "/events" },
    { label: "Sources", count: sources.length, href: "/sources" },
    { label: "Hypothèses", count: hypotheses.length, href: "/hypotheses" },
    { label: "Archives", count: archiveItems.length, href: "/archives" },
    { label: "Témoignages", count: oralTestimonies.length, href: "/archives" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[var(--color-ink)]">Espace de recherche</h1>
        <p className="mt-2 text-sm text-[var(--color-ink-secondary)] max-w-xl">
          Reconstituer, documenter et analyser des réseaux humains historiques
          à partir de sources, d&apos;archives, de témoignages et d&apos;hypothèses.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {stats.map((s) => (
          <Link key={s.href + s.label} href={s.href}>
            <Card hover>
              <p className="text-2xl font-semibold text-[var(--color-ink)]">{s.count}</p>
              <p className="text-xs text-[var(--color-ink-muted)] mt-0.5">{s.label}</p>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick access */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <h2 className="text-sm font-medium text-[var(--color-ink)] mb-3">Personnes récentes</h2>
          <div className="space-y-2">
            {persons.slice(0, 4).map((p) => (
              <Link
                key={p.id}
                href={`/persons/${p.id}`}
                className="block text-sm text-[var(--color-ink-secondary)] hover:text-[var(--color-accent)] transition-colors"
              >
                {p.primaryName}
                {p.alternateNames.length > 0 && (
                  <span className="text-[var(--color-ink-muted)] ml-1">
                    ({p.alternateNames[0]})
                  </span>
                )}
              </Link>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="text-sm font-medium text-[var(--color-ink)] mb-3">Hypothèses ouvertes</h2>
          <div className="space-y-2">
            {hypotheses
              .filter((h) => h.status !== "rejected")
              .slice(0, 4)
              .map((h) => (
                <Link
                  key={h.id}
                  href={`/hypotheses/${h.id}`}
                  className="block text-sm text-[var(--color-ink-secondary)] hover:text-[var(--color-accent)] transition-colors"
                >
                  {h.title}
                </Link>
              ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
