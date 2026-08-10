"use client";

import { AlertTriangle, CheckCircle2, ClipboardCheck, Inbox, MessagesSquare, PhoneCall, RefreshCw, TimerOff, UserCheck } from "lucide-react";
import { useState } from "react";

import { DashboardContainer } from "@/components/layout/DashboardContainer";
import { Button, Card, CardContent, Input, StatCard, Table, TableBody, TableCell, TableContainer, TableHead, TableHeader, TableRow } from "@/components/ui";
import { useAuth } from "@/hooks/useAuth";
import { useProductivityDashboard } from "@/hooks/useProductivityDashboard";
import type { ProductivityDashboard as ProductivityData, ProductivityFilters } from "@/types/productivity-dashboard";

import { getDefaultProductivityFilters, getProductivityEfficiency, getProductivityPeriod, isProductivityDashboardEmpty, sortProductivityOperators, type ProductivityShortcut } from "./productivity-dashboard.presenter";
import { getProductivityErrorMessage } from "./productivity-dashboard.error";

const number = new Intl.NumberFormat("pt-BR");
const percentage = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 1 });

export function ProductivityDashboard() {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";
  const [filters, setFilters] = useState<ProductivityFilters>(() => getDefaultProductivityFilters());
  const [draft, setDraft] = useState<ProductivityFilters>(() => getDefaultProductivityFilters());
  const query = useProductivityDashboard(filters);

  function applyFilters() {
    setFilters({ from: draft.from, to: draft.to, ...(isAdmin && draft.operatorId?.trim() ? { operatorId: draft.operatorId.trim() } : {}) });
  }

  function applyShortcut(shortcut: ProductivityShortcut) {
    const period = getProductivityPeriod(shortcut);
    const next = { ...draft, ...period };
    setDraft(next);
    setFilters({ from: next.from, to: next.to, ...(isAdmin && next.operatorId?.trim() ? { operatorId: next.operatorId.trim() } : {}) });
  }

  return (
    <DashboardContainer>
      <header>
        <p className="text-sm font-semibold text-blue-700">Operação</p>
        <h1 className="text-2xl font-bold text-slate-950">Dashboard de Produtividade</h1>
        <p className="mt-1 text-sm text-slate-600">Indicadores operacionais calculados pelo SisCob para o período selecionado.</p>
      </header>

      <ProductivityFilterBar draft={draft} isAdmin={isAdmin} onApply={applyFilters} onChange={setDraft} onShortcut={applyShortcut} />

      {query.isLoading ? <ProductivityLoading /> : null}
      {query.isError ? <ProductivityError error={query.error} onRetry={() => void query.refetch()} /> : null}
      {query.data && isProductivityDashboardEmpty(query.data) ? <ProductivityEmpty /> : null}
      {query.data && !isProductivityDashboardEmpty(query.data) ? <ProductivityContent data={query.data} isAdmin={isAdmin} /> : null}
    </DashboardContainer>
  );
}

function ProductivityFilterBar({ draft, isAdmin, onApply, onChange, onShortcut }: { draft: ProductivityFilters; isAdmin: boolean; onApply(): void; onChange(filters: ProductivityFilters): void; onShortcut(shortcut: ProductivityShortcut): void }) {
  const invalidPeriod = !draft.from || !draft.to || draft.from > draft.to;
  return (
    <section aria-label="Filtros de produtividade" className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => onShortcut("today")} variant="secondary">Hoje</Button>
        <Button onClick={() => onShortcut("7days")} variant="secondary">Últimos 7 dias</Button>
        <Button onClick={() => onShortcut("30days")} variant="secondary">Últimos 30 dias</Button>
      </div>
      <div className="grid items-end gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <label className="text-sm font-medium text-slate-700">Data inicial<Input className="mt-1.5" onChange={(event) => onChange({ ...draft, from: event.target.value })} type="date" value={draft.from} /></label>
        <label className="text-sm font-medium text-slate-700">Data final<Input className="mt-1.5" onChange={(event) => onChange({ ...draft, to: event.target.value })} type="date" value={draft.to} /></label>
        {isAdmin ? <label className="text-sm font-medium text-slate-700">Operador<Input className="mt-1.5" onChange={(event) => onChange({ ...draft, operatorId: event.target.value })} placeholder="ID do operador" value={draft.operatorId ?? ""} /></label> : null}
        <Button disabled={invalidPeriod} onClick={onApply}>Aplicar filtros</Button>
      </div>
      {invalidPeriod ? <p className="text-sm text-red-700" role="alert">Informe um período válido.</p> : null}
    </section>
  );
}

export function ProductivityContent({ data, isAdmin }: { data: ProductivityData; isAdmin: boolean }) {
  const efficiency = getProductivityEfficiency(data);
  const cards = [
    ["Interações", data.summary.interactions, MessagesSquare],
    ["Contatos realizados", data.summary.contactMade, PhoneCall],
    ["Sem resposta", data.summary.noAnswer, TimerOff],
    ["Promessas de pagamento", data.summary.promisesToPay, UserCheck],
    ["Next Actions concluídas", data.summary.completedNextActions, ClipboardCheck],
    ["Next Actions vencidas", data.summary.overdueNextActions, AlertTriangle],
    ["Operations concluídas", data.summary.completedOperations, CheckCircle2],
  ] as const;
  const operators = sortProductivityOperators(data);

  return <div className="space-y-6">
    <section aria-label="Resumo de produtividade" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map(([label, value, Icon]) => <StatCard icon={Icon} key={label} label={label} value={number.format(value)} />)}
    </section>

    <section aria-labelledby="efficiency-title">
      <h2 className="mb-3 text-lg font-semibold text-slate-950" id="efficiency-title">Eficiência operacional</h2>
      <p className="mb-3 text-sm text-slate-600">Percentuais derivados exclusivamente dos números retornados para o período atual.</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <EfficiencyCard description="Contatos realizados ÷ interações" label="Taxa de contato" value={efficiency.contactRate} />
        <EfficiencyCard description="Promessas de pagamento ÷ contatos realizados" label="Taxa de promessa" value={efficiency.promiseRate} />
      </div>
    </section>

    <section aria-labelledby="productivity-operators-title">
      <h2 className="mb-3 text-lg font-semibold text-slate-950" id="productivity-operators-title">{isAdmin ? "Produtividade por operador" : "Minha produtividade"}</h2>
      <Card className="overflow-hidden"><TableContainer><Table>
        <TableHeader><TableRow><TableHead>Operador</TableHead><TableHead>Interações</TableHead><TableHead>Contatos</TableHead><TableHead>Sem resposta</TableHead><TableHead>Promessas</TableHead><TableHead>Next Actions concluídas</TableHead><TableHead>Operations concluídas</TableHead></TableRow></TableHeader>
        <TableBody>{operators.map((operator) => <TableRow key={operator.id}><TableCell className="font-medium text-slate-950">{operator.name}</TableCell><TableCell>{number.format(operator.interactions)}</TableCell><TableCell>{number.format(operator.contactMade)}</TableCell><TableCell>{number.format(operator.noAnswer)}</TableCell><TableCell>{number.format(operator.promisesToPay)}</TableCell><TableCell>{number.format(operator.completedNextActions)}</TableCell><TableCell>{number.format(operator.completedOperations)}</TableCell></TableRow>)}</TableBody>
      </Table></TableContainer></Card>
    </section>
  </div>;
}

function EfficiencyCard({ description, label, value }: { description: string; label: string; value: number }) {
  return <Card><CardContent><p className="text-sm text-slate-600">{label}</p><p className="mt-2 text-3xl font-bold text-slate-950">{percentage.format(value)}%</p><p className="mt-2 text-xs text-slate-500">{description}</p></CardContent></Card>;
}

function ProductivityLoading() {
  return <div aria-label="Carregando produtividade" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" role="status">{Array.from({ length: 7 }, (_, index) => <div className="h-32 animate-pulse rounded-xl border bg-white" key={index} />)}</div>;
}

function ProductivityError({ error, onRetry }: { error: unknown; onRetry(): void }) {
  return <DashboardState icon={AlertTriangle} title="Não foi possível carregar a produtividade"><p className="text-sm text-slate-600">{getProductivityErrorMessage(error)}</p><Button onClick={onRetry}><RefreshCw aria-hidden className="size-4" />Tentar novamente</Button></DashboardState>;
}

function ProductivityEmpty() {
  return <DashboardState icon={Inbox} title="Nenhuma atividade registrada no período selecionado."><p className="text-sm text-slate-600">Altere o período ou os filtros para consultar outra combinação.</p></DashboardState>;
}

function DashboardState({ children, icon: Icon, title }: { children: React.ReactNode; icon: typeof Inbox; title: string }) {
  return <div className="flex min-h-72 flex-col items-center justify-center gap-4 rounded-xl border border-dashed bg-white p-8 text-center"><Icon aria-hidden className="size-7 text-slate-500" /><h2 className="text-lg font-semibold text-slate-950">{title}</h2>{children}</div>;
}
