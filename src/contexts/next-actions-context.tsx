"use client";

import { createContext, useCallback, useMemo, useState, type PropsWithChildren } from "react";

import type { CustomerNextAction } from "@/types/next-action";
import { useTimeline } from "@/hooks/useTimeline";

type NextActionUpdates = Partial<Omit<CustomerNextAction, "id" | "interactionId">>;

interface NextActionsContextValue {
  actions: CustomerNextAction[];
  addAction(action: CustomerNextAction): void;
  updateAction(id: string, updates: NextActionUpdates): void;
  completeAction(id: string): void;
  cancelAction(id: string): void;
  removeAction(id: string): void;
}

export const NextActionsContext = createContext<NextActionsContextValue | null>(null);

export function NextActionsProvider({ children }: PropsWithChildren) {
  const [actions, setActions] = useState<CustomerNextAction[]>([]);
  const { addEvent } = useTimeline();

  const addAction = useCallback((action: CustomerNextAction) => {
    setActions((current) => [...current, action]);
    addEvent({
      id: crypto.randomUUID(),
      customerId: String(action.customerId),
      interactionId: action.interactionId,
      type: "next_action",
      title: "Próxima ação criada",
      description: action.title,
      createdAt: new Date(),
      metadata: {
        actionId: action.id,
        actionType: action.type,
        dueAt: action.dueAt?.toISOString(),
        priority: action.priority,
      },
    });
  }, [addEvent]);

  const updateAction = useCallback((id: string, updates: NextActionUpdates) => {
    setActions((current) => current.map((action) => action.id === id ? { ...action, ...updates } : action));
  }, []);

  const completeAction = useCallback((id: string) => {
    setActions((current) => current.map((action) => action.id === id ? { ...action, status: "completed" } : action));
  }, []);

  const cancelAction = useCallback((id: string) => {
    setActions((current) => current.map((action) => action.id === id ? { ...action, status: "cancelled" } : action));
  }, []);

  const removeAction = useCallback((id: string) => {
    setActions((current) => current.filter((action) => action.id !== id));
  }, []);

  const value = useMemo(() => ({
    actions,
    addAction,
    updateAction,
    completeAction,
    cancelAction,
    removeAction,
  }), [actions, addAction, updateAction, completeAction, cancelAction, removeAction]);

  return <NextActionsContext.Provider value={value}>{children}</NextActionsContext.Provider>;
}
