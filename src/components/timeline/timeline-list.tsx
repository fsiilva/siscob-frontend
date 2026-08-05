"use client";

import { AlertTriangle } from "lucide-react";

import { Button, EmptyState, LoadingState, Skeleton } from "@/components/ui";
import { canFetchNextTimelinePage, useCustomerTimeline } from "@/hooks/useCustomerTimeline";
import { getSafeApiErrorMessage } from "@/lib/api-error-message";

import { TimelineEmpty } from "./timeline-empty";
import { TimelineItem } from "./timeline-item";
import { presentTimelineEvent } from "./timeline-presenter";

export function TimelineList({ customerId }: { customerId: number }) {
  const timelineQuery = useCustomerTimeline(customerId);
  const events = timelineQuery.data?.pages.flatMap((page) => page.items) ?? [];

  function loadMore() {
    if (!canFetchNextTimelinePage(timelineQuery.hasNextPage, timelineQuery.isFetchingNextPage)) return;
    void timelineQuery.fetchNextPage();
  }

  if (timelineQuery.isPending) {
    return (
      <LoadingState className="space-y-3" label="Carregando timeline">
        <Skeleton className="h-32" /><Skeleton className="h-32" />
      </LoadingState>
    );
  }

  if (timelineQuery.isError && !timelineQuery.data) {
    return (
      <EmptyState
        action={<Button onClick={() => void timelineQuery.refetch()}>Tentar novamente</Button>}
        description={getTimelineErrorMessage(timelineQuery.error)}
        icon={AlertTriangle}
        title="Erro ao carregar timeline"
      />
    );
  }

  if (events.length === 0) return <TimelineEmpty />;

  return (
    <div className="space-y-4">
      <ol className="space-y-3">
        {events.map((event) => <TimelineItem event={presentTimelineEvent(event)} key={event.id} />)}
      </ol>

      {timelineQuery.isFetchNextPageError ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
          Não foi possível carregar mais eventos. Os eventos já carregados foram preservados.
        </p>
      ) : null}

      {timelineQuery.hasNextPage ? (
        <div className="flex flex-col items-center gap-2">
          <Button disabled={timelineQuery.isFetchingNextPage} loading={timelineQuery.isFetchingNextPage} onClick={loadMore} variant="secondary">
            {timelineQuery.isFetchNextPageError ? "Tentar carregar novamente" : "Carregar mais"}
          </Button>
          {timelineQuery.isFetchingNextPage ? <p className="text-sm text-slate-500" role="status">Carregando mais eventos...</p> : null}
        </div>
      ) : null}
    </div>
  );
}

function getTimelineErrorMessage(error: Error) {
  return getSafeApiErrorMessage(error, {
    defaultMessage: "Não foi possível consultar a timeline.",
    byStatus: {
      400: "O cursor ou filtro da timeline é inválido. Reinicie a consulta.",
      401: "Sua sessão expirou. Entre novamente para continuar.",
    },
  });
}
