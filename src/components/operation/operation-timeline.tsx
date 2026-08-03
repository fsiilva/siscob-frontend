"use client";

import { Ban, CheckCircle2, CircleDot, Flag, UserRound, Workflow } from "lucide-react";
import type { ComponentType } from "react";

import { Button, EmptyState, LoadingState, Skeleton } from "@/components/ui";
import { useOperationTimeline } from "@/hooks/useOperations";
import type { OperationResponse, OperationTimelineItem } from "@/types/operations-api";

import { presentOperationTimelineItem, type OperationTimelineIcon } from "./operation-timeline-presenter";

const icons: Record<OperationTimelineIcon, ComponentType<{ className?: string; "aria-hidden"?: boolean }>> = {
  created: CircleDot, assigned: UserRound, status: Workflow,
  completed: CheckCircle2, cancelled: Ban, priority: Flag,
};

export function OperationTimeline({ operation, items }: { operation: OperationResponse; items?: OperationTimelineItem[] }) {
  const query = useOperationTimeline(operation.id, !items);

  if (!items && query.isPending) return <LoadingState label="Carregando timeline da Operation"><Skeleton className="h-28" /></LoadingState>;
  if (!items && query.isError) return <div className="space-y-2" role="alert"><p className="text-sm text-red-700">Não foi possível carregar a timeline da Operation.</p><Button onClick={() => void query.refetch()} variant="secondary">Tentar novamente</Button></div>;

  const events = [...(items ?? query.data?.items ?? [])].reverse().map(presentOperationTimelineItem);
  if (!events.length) return <EmptyState description="Nenhum evento registrado." icon={CircleDot} title="Timeline vazia" />;

  return (
    <ol className="relative space-y-0 border-l border-slate-200 pl-6">
      {events.map((event) => {
        const Icon = icons[event.icon];
        return (
          <li className="relative pb-6 last:pb-0" key={event.id}>
            <span className="absolute -left-[2.45rem] rounded-full border border-blue-100 bg-blue-50 p-2 text-blue-700"><Icon aria-hidden className="size-4" /></span>
            <article className="rounded-lg border border-slate-200 bg-white p-4">
              <h4 className="font-semibold text-slate-950">{event.title}</h4>
              <p className="mt-1 text-sm text-slate-600">{event.description}</p>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                <span>{event.user}</span>
                <time dateTime={event.createdAt}>{event.date}</time>
                <span>{event.time}</span>
              </div>
            </article>
          </li>
        );
      })}
    </ol>
  );
}
