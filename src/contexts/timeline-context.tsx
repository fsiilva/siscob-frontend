"use client";

import { createContext, useCallback, useMemo, useState, type PropsWithChildren } from "react";

import type { TimelineEvent } from "@/types/timeline";

interface TimelineContextValue {
  events: TimelineEvent[];
  addEvent(event: TimelineEvent): void;
  removeEvent(id: string): void;
  clearCustomerTimeline(customerId: string): void;
  getCustomerTimeline(customerId: string): TimelineEvent[];
}

export const TimelineContext = createContext<TimelineContextValue | null>(null);

export function TimelineProvider({ children }: PropsWithChildren) {
  const [events, setEvents] = useState<TimelineEvent[]>([]);

  const addEvent = useCallback((event: TimelineEvent) => {
    setEvents((current) => [...current, event]);
  }, []);

  const removeEvent = useCallback((id: string) => {
    setEvents((current) => current.filter((event) => event.id !== id));
  }, []);

  const clearCustomerTimeline = useCallback((customerId: string) => {
    setEvents((current) => current.filter((event) => event.customerId !== customerId));
  }, []);

  const getCustomerTimeline = useCallback((customerId: string) => (
    events
      .filter((event) => event.customerId === customerId)
      .sort((left, right) => right.createdAt.getTime() - left.createdAt.getTime())
  ), [events]);

  const value = useMemo(() => ({
    events,
    addEvent,
    removeEvent,
    clearCustomerTimeline,
    getCustomerTimeline,
  }), [events, addEvent, removeEvent, clearCustomerTimeline, getCustomerTimeline]);

  return <TimelineContext.Provider value={value}>{children}</TimelineContext.Provider>;
}
