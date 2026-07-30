"use client";

import { useContext } from "react";

import { NextActionsContext } from "@/contexts/next-actions-context";

export function useNextActions() {
  const context = useContext(NextActionsContext);
  if (!context) throw new Error("useNextActions deve ser usado dentro de NextActionsProvider");
  return context;
}
