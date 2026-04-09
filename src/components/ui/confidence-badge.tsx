"use client";

import type { ConfidenceLevel } from "@/types";
import { CONFIDENCE_LABELS, CONFIDENCE_COLORS } from "@/lib/constants";
import { Badge } from "./badge";

interface ConfidenceBadgeProps {
  level: ConfidenceLevel;
}

export function ConfidenceBadge({ level }: ConfidenceBadgeProps) {
  return (
    <Badge variant="custom" className={CONFIDENCE_COLORS[level]}>
      {CONFIDENCE_LABELS[level]}
    </Badge>
  );
}
