"use client";

import { useContext } from "react";

import { TimelineContext } from "@/contexts/timeline-context";

export function useTimeline() {
  const context = useContext(TimelineContext);
  if (!context) throw new Error("useTimeline deve ser usado dentro de TimelineProvider");
  return context;
}
