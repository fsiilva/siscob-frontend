"use client";

import { AlertTriangle, Inbox } from "lucide-react";

import { useExecutiveSummary } from "@/hooks/useExecutiveSummary";
import { DashboardContainer } from "@/components/layout/DashboardContainer";
import { DashboardHeader } from "@/components/layout/DashboardHeader";

import { ExecutiveGrid } from "./ExecutiveGrid";
import { KpiCards } from "./KpiCards";

function DashboardLoading() {
  return (
    <div aria-label="Carregando dashboard" className="space-y-8" role="status">
      <span className="sr-only">Carregando dados executivos...</span>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <div
            key={index}
            className="h-32 animate-pulse rounded-2xl border border-slate-200 bg-white"
          />
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-5">
        <div className="h-80 animate-pulse rounded-2xl bg-white xl:col-span-3" />
        <div className="h-80 animate-pulse rounded-2xl bg-white xl:col-span-2" />
      </div>
    </div>
  );
}

interface DashboardMessageProps {
  type: "error" | "empty";
  onRetry?: () => void;
}

function DashboardMessage({ type, onRetry }: DashboardMessageProps) {
  const isError = type === "error";
  const Icon = isError ? AlertTriangle : Inbox;

  return (
    <div className="flex min-h-80 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 text-center">
      <span className="rounded-full bg-slate-100 p-3 text-slate-600">
        <Icon aria-hidden="true" className="size-6" />
      </span>
      <h2 className="mt-4 text-lg font-semibold text-slate-950">
        {isError ? "Não foi possível carregar os dados" : "Nenhum dado disponível"}
      </h2>
      <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">
        {isError
          ? "A API não respondeu como esperado. Tente novamente em alguns instantes."
          : "A API não retornou informações para o resumo executivo."}
      </p>
      {isError && onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-5 rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
        >
          Tentar novamente
        </button>
      ) : null}
    </div>
  );
}

export function ExecutiveDashboard() {
  const { data, isLoading, isError, refetch } = useExecutiveSummary();

  return (
    <DashboardContainer>
      <DashboardHeader lastSync={data?.alerts.lastSislocSync} />

      {isLoading ? <DashboardLoading /> : null}
      {isError ? (
        <DashboardMessage type="error" onRetry={() => void refetch()} />
      ) : null}
      {!isLoading && !isError && !data ? (
        <DashboardMessage type="empty" />
      ) : null}
      {data ? (
        <div className="space-y-8">
          <KpiCards kpis={data.portfolioKpis} />
          <ExecutiveGrid
            aging={data.portfolioAging}
            collection={data.collectionSummary}
            alerts={data.alerts}
          />
        </div>
      ) : null}
    </DashboardContainer>
  );
}
