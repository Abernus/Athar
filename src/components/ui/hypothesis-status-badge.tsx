"use client";

import type { HypothesisStatus } from "@/types";
import { HYPOTHESIS_STATUS_LABELS, HYPOTHESIS_STATUS_COLORS } from "@/lib/constants";
import { Badge } from "./badge";

interface HypothesisStatusBadgeProps {
  status: HypothesisStatus;
}

export function HypothesisStatusBadge({ status }: HypothesisStatusBadgeProps) {
  return (
    <Badge variant="custom" className={HYPOTHESIS_STATUS_COLORS[status]}>
      {HYPOTHESIS_STATUS_LABELS[status]}
    </Badge>
  );
}
