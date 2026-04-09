import type { EntityType } from "@/types";
import { cn } from "@/lib/utils";

const ICONS: Record<EntityType, string> = {
  person: "P",
  group: "G",
  place: "L",
  event: "E",
};

const COLORS: Record<EntityType, string> = {
  person: "bg-blue-100 text-blue-700",
  group: "bg-violet-100 text-violet-700",
  place: "bg-emerald-100 text-emerald-700",
  event: "bg-amber-100 text-amber-700",
};

interface EntityTypeIconProps {
  type: EntityType;
  size?: "sm" | "md";
}

export function EntityTypeIcon({ type, size = "sm" }: EntityTypeIconProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded font-semibold",
        COLORS[type],
        size === "sm" && "h-5 w-5 text-[10px]",
        size === "md" && "h-7 w-7 text-xs"
      )}
    >
      {ICONS[type]}
    </span>
  );
}
