"use client";

import { Button, LoadingState, Skeleton } from "@/components/ui";
import { TimelineEmpty, TimelineItem, presentTimelineEvent } from "@/components/timeline";
import { useOperationTimeline } from "@/hooks/useOperations";
import type { OperationResponse } from "@/types/operations-api";

import { isOperationTimelineEvent } from "./operation-presenter";

export function OperationTimeline({ operation }: { operation: OperationResponse }) {
  const query = useOperationTimeline(operation);
  const events = (query.data?.pages.flatMap((page) => page.items) ?? [])
    .filter((event) => isOperationTimelineEvent(event, operation.id));

  if (query.isPending) return <LoadingState label="Carregando timeline da Operation"><Skeleton className="h-28" /></LoadingState>;
  if (query.isError && !query.data) return <div className="space-y-2" role="alert"><p className="text-sm text-red-700">Não foi possível carregar a timeline relacionada.</p><Button onClick={() => void query.refetch()} variant="secondary">Tentar novamente</Button></div>;

  return (
    <div className="space-y-3">
      {events.length ? <ol className="space-y-3">{events.map((event) => <TimelineItem event={presentTimelineEvent(event)} key={event.id} />)}</ol> : <TimelineEmpty />}
      {query.isFetchNextPageError ? <p className="text-sm text-red-700" role="alert">Falha ao carregar mais eventos.</p> : null}
      {query.hasNextPage ? <Button disabled={query.isFetchingNextPage} loading={query.isFetchingNextPage} onClick={() => { if (!query.isFetchingNextPage) void query.fetchNextPage(); }} variant="secondary">{query.isFetchNextPageError ? "Tentar novamente" : "Carregar mais"}</Button> : null}
    </div>
  );
}
