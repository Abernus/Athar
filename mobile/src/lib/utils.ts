import type { HistoricalDate } from "@/types";

export function formatHistoricalDate(date?: HistoricalDate): string {
  if (!date) return "—";
  if (date.display) return date.display;

  switch (date.precision) {
    case "exact":
      return date.value;
    case "estimated":
      return `vers ${date.value}`;
    case "approximate":
      return `≈ ${date.value}`;
    case "before":
      return `avant ${date.value}`;
    case "after":
      return `après ${date.value}`;
    case "decade":
      return `années ${date.value}`;
    case "century":
      return `${date.value}e siècle`;
    case "interval":
      return date.value;
    case "unknown":
      return "date inconnue";
  }
}

export function cn(...classes: (string | false | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function generateId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

export function nowISO(): string {
  return new Date().toISOString();
}
