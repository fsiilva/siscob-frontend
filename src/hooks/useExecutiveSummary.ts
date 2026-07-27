"use client";

import { useQuery } from "@tanstack/react-query";

import { getExecutiveSummary } from "@/services/executive.service";

const FIVE_MINUTES_IN_MS = 5 * 60 * 1000;

export function useExecutiveSummary() {
  return useQuery({
    queryKey: ["executive-summary"],
    queryFn: getExecutiveSummary,
    staleTime: FIVE_MINUTES_IN_MS,
    retry: 2,
  });
}
