"use client";

import { CalendarClock, CheckCircle2, ChevronDown, ChevronUp, CircleX, Cog, MessageSquareText, RefreshCw } from "lucide-react";
import { useState, type ComponentType } from "react";

import { Button, Card, CardContent } from "@/components/ui";

import type { PresentedTimelineEvent, TimelineIcon } from "./timeline-presenter";

const icons: Record<TimelineIcon, ComponentType<{ className?: string; "aria-hidden"?: boolean }>> = {
  interaction: MessageSquareText,
  created: CalendarClock,
  completed: CheckCircle2,
  cancelled: CircleX,
  rescheduled: RefreshCw,
  system: Cog,
};

export function TimelineItem({ event }: { event: PresentedTimelineEvent }) {
  const [expanded, setExpanded] = useState(false);
  const Icon = icons[event.icon];

  return (
    <li>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <span className="rounded-full bg-blue-50 p-2 text-blue-700"><Icon aria-hidden className="size-5" /></span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                <h3 className="font-semibold text-slate-950">{event.title}</h3>
                <time className="shrink-0 text-xs text-slate-500" dateTime={event.occurredAt}>{event.dateLabel}</time>
              </div>
              <p className="mt-1 whitespace-pre-wrap break-words text-sm text-slate-600">{event.description}</p>
              {event.details.length > 0 ? (
                <>
                  <Button aria-expanded={expanded} className="mt-2 px-0" onClick={() => setExpanded((current) => !current)} variant="ghost">
                    {expanded ? <ChevronUp aria-hidden className="size-4" /> : <ChevronDown aria-hidden className="size-4" />}
                    {expanded ? "Ocultar detalhes" : "Expandir detalhes"}
                  </Button>
                  {expanded ? (
                    <dl className="mt-2 grid gap-2 border-t border-slate-200 pt-3 sm:grid-cols-2">
                      {event.details.map((detail) => (
                        <div className="rounded-lg bg-slate-50 p-3" key={detail.label}>
                          <dt className="text-xs font-medium text-slate-500">{detail.label}</dt>
                          <dd className="mt-1 whitespace-pre-wrap break-words text-sm text-slate-800">{detail.value}</dd>
                        </div>
                      ))}
                    </dl>
                  ) : null}
                </>
              ) : null}
            </div>
          </div>
        </CardContent>
      </Card>
    </li>
  );
}
