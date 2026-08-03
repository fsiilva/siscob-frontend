"use client";

import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Inbox,
  ListChecks,
  MessagesSquare,
  RefreshCw,
} from "lucide-react";
import { Button, Card, CardContent, StatCard } from "@/components/ui";
import { DashboardContainer } from "@/components/layout/DashboardContainer";
import { useDashboardOverview } from "@/hooks/useDashboardOverview";
import type { DashboardOverview } from "@/types/dashboard-overview";
import { getOperationCards, isDashboardEmpty } from "./operational-dashboard.presenter";

const number = new Intl.NumberFormat("pt-BR");

export function OperationalDashboard() {
  const query = useDashboardOverview();

  if (query.isLoading) return <DashboardLoading />;
  if (query.isError) {
    return <DashboardError onRetry={() => void query.refetch()} />;
  }
  if (!query.data || isDashboardEmpty(query.data)) return <DashboardEmpty />;
  return <DashboardCards data={query.data} />;
}

export function DashboardCards({ data }: { data: DashboardOverview }) {
  const operationCards = getOperationCards(data);

  return (
    <DashboardContainer>
      <header className="mb-6">
        <p className="text-sm font-semibold text-blue-700">Operação</p>
        <h1 className="text-2xl font-bold text-slate-950">Dashboard Operacional</h1>
        <p className="mt-1 text-sm text-slate-600">Visão atual de Operations, Next Actions e Interactions.</p>
      </header>

      <section aria-label="Resumo de Operations" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {operationCards.map((card, index) => <StatCard icon={[ListChecks, Clock3, Activity, CheckCircle2][index]} key={card.label} label={card.label} value={number.format(card.value)} />)}
      </section>

      <section aria-label="Detalhes operacionais" className="mt-6 grid gap-4 lg:grid-cols-3">
        <DetailCard title="Prioridades" rows={[
          ["Baixa", data.priorities.low], ["Normal", data.priorities.normal],
          ["Alta", data.priorities.high], ["Urgente", data.priorities.urgent],
        ]} />
        <DetailCard title="Next Actions" rows={[
          ["Pendentes", data.nextActions.pending], ["Vencidas", data.nextActions.overdue],
          ["Vencendo hoje", data.nextActions.today],
        ]} />
        <Card>
          <CardContent>
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-semibold text-slate-950">Interactions de hoje</h2>
              <MessagesSquare aria-hidden="true" className="size-5 text-blue-700" />
            </div>
            <p className="mt-6 text-3xl font-bold text-slate-950">{number.format(data.interactions.today)}</p>
          </CardContent>
        </Card>
      </section>
    </DashboardContainer>
  );
}

function DetailCard({ title, rows }: { title: string; rows: Array<[string, number]> }) {
  return (
    <Card>
      <CardContent>
        <h2 className="font-semibold text-slate-950">{title}</h2>
        <dl className="mt-4 space-y-3">
          {rows.map(([label, value]) => (
            <div className="flex justify-between gap-4 text-sm" key={label}>
              <dt className="text-slate-600">{label}</dt>
              <dd className="font-semibold text-slate-950">{number.format(value)}</dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  );
}

function DashboardLoading() {
  return <DashboardContainer><div aria-label="Carregando dashboard operacional" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" role="status">{Array.from({ length: 7 }, (_, index) => <div className="h-32 animate-pulse rounded-xl border bg-white" key={index} />)}</div></DashboardContainer>;
}

function DashboardError({ onRetry }: { onRetry(): void }) {
  return <DashboardState icon={AlertTriangle} title="Não foi possível carregar o Dashboard"><Button onClick={onRetry}><RefreshCw aria-hidden="true" className="size-4" />Tentar novamente</Button></DashboardState>;
}

function DashboardEmpty() {
  return <DashboardState icon={Inbox} title="Nenhum dado operacional disponível"><p className="text-sm text-slate-600">Ainda não existem Operations, Next Actions ou Interactions para exibir.</p></DashboardState>;
}

function DashboardState({ icon: Icon, title, children }: { icon: typeof Inbox; title: string; children: React.ReactNode }) {
  return <DashboardContainer><div className="flex min-h-80 flex-col items-center justify-center gap-4 rounded-xl border border-dashed bg-white p-8 text-center"><Icon aria-hidden="true" className="size-7 text-slate-500" /><h1 className="text-lg font-semibold text-slate-950">{title}</h1>{children}</div></DashboardContainer>;
}
