"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: string;
}

const NAV_SECTIONS: { title?: string; items: NavItem[] }[] = [
  {
    items: [
      { label: "Accueil", href: "/", icon: "H" },
      { label: "Recherche", href: "/search", icon: "R" },
    ],
  },
  {
    title: "Entités",
    items: [
      { label: "Personnes", href: "/persons", icon: "P" },
      { label: "Groupes", href: "/groups", icon: "G" },
      { label: "Lieux", href: "/places", icon: "L" },
      { label: "Événements", href: "/events", icon: "E" },
    ],
  },
  {
    title: "Recherche",
    items: [
      { label: "Sources", href: "/sources", icon: "S" },
      { label: "Archives", href: "/archives", icon: "A" },
      { label: "Hypothèses", href: "/hypotheses", icon: "?" },
    ],
  },
  {
    title: "Visualisation",
    items: [
      { label: "Chronologie", href: "/timeline", icon: "T" },
      { label: "Réseau", href: "/network", icon: "N" },
    ],
  },
];

function NavIcon({ letter, active }: { letter: string; active: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex h-5 w-5 items-center justify-center rounded text-[10px] font-semibold",
        active
          ? "bg-[var(--color-accent)] text-white"
          : "bg-[var(--color-surface-sunken)] text-[var(--color-ink-muted)]"
      )}
    >
      {letter}
    </span>
  );
}

export function Sidebar() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[var(--sidebar-width)] border-r border-[var(--color-border)] bg-[var(--color-surface-raised)] flex flex-col z-10">
      {/* Logo */}
      <div className="px-4 py-4 border-b border-[var(--color-border)]">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-base font-semibold tracking-tight text-[var(--color-ink)]">
            Historiens
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-2 px-2">
        {NAV_SECTIONS.map((section, i) => (
          <div key={i} className={cn(i > 0 && "mt-4")}>
            {section.title && (
              <p className="px-2 mb-1 text-[10px] font-medium uppercase tracking-wider text-[var(--color-ink-muted)]">
                {section.title}
              </p>
            )}
            {section.items.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm transition-colors",
                    active
                      ? "bg-[var(--color-surface)] text-[var(--color-ink)] font-medium shadow-sm"
                      : "text-[var(--color-ink-secondary)] hover:bg-[var(--color-surface)] hover:text-[var(--color-ink)]"
                  )}
                >
                  <NavIcon letter={item.icon} active={active} />
                  {item.label}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-[var(--color-border)]">
        <Link
          href="/methodology"
          className="text-xs text-[var(--color-ink-muted)] hover:text-[var(--color-ink-secondary)] transition-colors"
        >
          Méthodologie & Guide
        </Link>
      </div>
    </aside>
  );
}
