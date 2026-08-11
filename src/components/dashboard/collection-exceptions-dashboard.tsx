"use client";

import { AlertTriangle, BellRing, Building2, CircleAlert, Inbox, Info, RefreshCw, ShieldAlert, TriangleAlert } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { DashboardContainer } from "@/components/layout/DashboardContainer";
import { CollectionAlertsPanel } from "@/components/operation/collection-alerts-panel";
import { CollectionCadencePanel } from "@/components/operation/collection-cadence-panel";
import { OperationDetailsDrawer } from "@/components/operation/operation-details-drawer";
import { operationPriorityLabels } from "@/components/operation/operation-presenter";
import { Badge, Button, Card, CardContent, EmptyState, Input, LoadingState, Pagination, Select, Skeleton, StatCard, Table, TableBody, TableCell, TableContainer, TableHead, TableHeader, TableRow } from "@/components/ui";
import { useAuth } from "@/hooks/useAuth";
import { useCollectionExceptionsDashboard } from "@/hooks/useCollectionExceptionsDashboard";
import { useCompanies } from "@/hooks/useCompanies";
import type { CollectionAlertItemSeverity, CollectionAlertType } from "@/types/collection-alert";
import type { CollectionExceptionItem, CollectionExceptionsDashboard as DashboardData, CollectionExceptionsFilters } from "@/types/collection-exceptions-dashboard";
import { formatCustomer360Company } from "@/components/customers/customer-360.presenter";

import { getCollectionExceptionsErrorMessage } from "./collection-exceptions-dashboard.error";

const PAGE_SIZE = 20;
const number = new Intl.NumberFormat("pt-BR");
const initialFilters: CollectionExceptionsFilters = { page: 1, pageSize: PAGE_SIZE };
const alertTypeLabels: Record<CollectionAlertType, string> = {
  CRITICAL_WITHOUT_FOLLOW_UP: "Crítico sem acompanhamento",
  OVERDUE_FOLLOW_UP: "Acompanhamento vencido",
  DUE_TODAY: "Ação para hoje",
  HIGH_VALUE_WITHOUT_ACTIVE_COLLECTION: "Oportunidade relevante sem cobrança ativa",
};

export function CollectionExceptionsDashboard() {
  const { user } = useAuth();
  if (user?.role !== "ADMIN") return <DashboardContainer><EmptyState description="Este painel está disponível apenas para administradores." icon={ShieldAlert} title="Acesso restrito" /></DashboardContainer>;
  return <CollectionExceptionsAdminDashboard />;
}

function CollectionExceptionsAdminDashboard() {
  const [filters, setFilters] = useState<CollectionExceptionsFilters>(initialFilters);
  const [operationId, setOperationId] = useState<string | null>(null);
  const query = useCollectionExceptionsDashboard(filters);
  const companiesQuery = useCompanies({ active: true });

  function update<Key extends keyof CollectionExceptionsFilters>(key: Key, value: CollectionExceptionsFilters[Key]) {
    setFilters((current) => ({ ...current, [key]: value, page: 1 }));
  }

  return <DashboardContainer>
    <header><p className="text-sm font-semibold text-blue-700">Gestão</p><h1 className="text-2xl font-bold text-slate-950">Exceções de Cobrança</h1><p className="mt-1 text-sm text-slate-600">Acompanhe os alertas que exigem atenção gerencial na operação de cobrança.</p></header>
    <ExceptionFilters companiesQuery={companiesQuery} filters={filters} onChange={update} />
    {query.isLoading ? <LoadingState label="Carregando exceções de cobrança"><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{Array.from({ length: 8 }, (_, index) => <Skeleton className="h-28" key={index} />)}</div></LoadingState> : null}
    {query.isError ? <EmptyState action={<Button onClick={() => void query.refetch()}><RefreshCw aria-hidden className="size-4" />Tentar novamente</Button>} description={getCollectionExceptionsErrorMessage(query.error)} icon={AlertTriangle} title="Não foi possível carregar as exceções" /> : null}
    {query.data && query.data.total === 0 ? <EmptyState description="Nenhuma exceção encontrada para os filtros selecionados." icon={Inbox} title="Nenhuma exceção encontrada" /> : null}
    {query.data && query.data.total > 0 ? <ExceptionsContent data={query.data} onOpenOperation={setOperationId} onPageChange={(page) => setFilters((current) => ({ ...current, page }))} /> : null}
    <OperationDetailsDrawer onClose={() => setOperationId(null)} operationId={operationId} />
  </DashboardContainer>;
}

function ExceptionFilters({ companiesQuery, filters, onChange }: { companiesQuery: ReturnType<typeof useCompanies>; filters: CollectionExceptionsFilters; onChange<Key extends keyof CollectionExceptionsFilters>(key: Key, value: CollectionExceptionsFilters[Key]): void }) {
  return <section aria-label="Filtros de exceções" className="space-y-3 rounded-xl border border-slate-200 bg-white p-4"><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
    <Filter label="Empresa"><Select disabled={companiesQuery.isLoading} onChange={(event) => onChange("companyId", optional(event.target.value))} value={filters.companyId ?? ""}><option value="">Todas as empresas</option>{companiesQuery.data?.data.map((company) => <option key={company.id} value={company.id}>{company.name}</option>)}</Select></Filter>
    <Filter label="Cliente"><Input inputMode="numeric" onChange={(event) => onChange("customerId", optional(event.target.value))} placeholder="ID do cliente" value={filters.customerId ?? ""} /></Filter>
    <Filter label="Severidade"><Select onChange={(event) => onChange("severity", optional(event.target.value) as CollectionAlertItemSeverity | undefined)} value={filters.severity ?? ""}><option value="">Todas</option><option value="CRITICAL">Crítico</option><option value="WARNING">Atenção</option><option value="INFO">Informativo</option></Select></Filter>
    <Filter label="Tipo de alerta"><Select onChange={(event) => onChange("alertType", optional(event.target.value) as CollectionAlertType | undefined)} value={filters.alertType ?? ""}><option value="">Todos</option>{Object.entries(alertTypeLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</Select></Filter>
  </div>{companiesQuery.isError ? <div className="flex flex-col items-start justify-between gap-2 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900 sm:flex-row sm:items-center" role="alert"><span>Não foi possível carregar o catálogo de empresas.</span><Button onClick={() => void companiesQuery.refetch()} variant="secondary">Tentar novamente</Button></div> : null}</section>;
}

function ExceptionsContent({ data, onOpenOperation, onPageChange }: { data: DashboardData; onOpenOperation(id: string): void; onPageChange(page: number): void }) {
  const summaryCards = [
    ["Total de exceções", data.summary.totalExceptions, BellRing], ["Críticas", data.summary.critical, CircleAlert], ["Atenção", data.summary.warning, TriangleAlert], ["Informativas", data.summary.informational, Info],
    ["Críticas sem acompanhamento", data.summary.criticalWithoutFollowUp, CircleAlert], ["Acompanhamentos vencidos", data.summary.overdueFollowUp, TriangleAlert], ["Ações para hoje", data.summary.dueToday, BellRing], ["Oportunidades relevantes sem cobrança ativa", data.summary.highValueWithoutActiveCollection, Building2],
  ] as const;
  return <div className="space-y-8">
    <section aria-label="Resumo das exceções" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{summaryCards.map(([label, value, Icon]) => <StatCard icon={Icon} key={label} label={label} value={number.format(value)} />)}</section>
    <section aria-labelledby="exceptions-company-title"><h2 className="mb-3 text-lg font-semibold text-slate-950" id="exceptions-company-title">Exceções por empresa</h2>{data.byCompany.length ? <Card className="overflow-hidden"><TableContainer><Table className="min-w-[640px]"><TableHeader><TableRow><TableHead>Empresa</TableHead><TableHead>Total</TableHead><TableHead>Críticas</TableHead><TableHead>Atenção</TableHead><TableHead>Informativas</TableHead></TableRow></TableHeader><TableBody>{data.byCompany.map((item) => <TableRow key={item.company.id}><TableCell className="font-semibold text-slate-950">{formatCustomer360Company(item.company)}</TableCell><TableCell>{number.format(item.total)}</TableCell><TableCell>{number.format(item.critical)}</TableCell><TableCell>{number.format(item.warning)}</TableCell><TableCell>{number.format(item.informational)}</TableCell></TableRow>)}</TableBody></Table></TableContainer></Card> : <InlineEmpty text="Nenhuma empresa com exceções para exibir." />}</section>
    <section aria-labelledby="exceptions-list-title"><h2 className="mb-3 text-lg font-semibold text-slate-950" id="exceptions-list-title">Cobranças que exigem atenção</h2><div className="space-y-4">{data.items.map((item, index) => <ExceptionCard item={item} key={`${item.kind}-${item.operationId ?? item.receivableId ?? index}`} onOpenOperation={onOpenOperation} />)}</div></section>
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><p className="text-sm text-slate-600">{number.format(data.total)} item(ns) · página {number.format(data.page)}</p><Pagination onPageChange={onPageChange} page={data.page} totalPages={data.totalPages} /></div>
  </div>;
}

function ExceptionCard({ item, onOpenOperation }: { item: CollectionExceptionItem; onOpenOperation(id: string): void }) {
  return <Card><CardContent className="space-y-4"><div className="flex flex-wrap items-start justify-between gap-3"><div><Badge variant={item.kind === "OPERATION" ? "open" : "success"}>{item.kind === "OPERATION" ? "Cobrança ativa" : "Oportunidade"}</Badge><Link className="mt-2 block break-words font-semibold text-blue-700 hover:underline" href={`/customers/${item.customer.id}`} prefetch={false}>{item.customer.name}</Link><p className="mt-1 text-sm text-slate-600">{formatCustomer360Company(item.company)}</p></div><div className="flex flex-wrap gap-2"><Badge>{operationPriorityLabels[item.suggestedPriority]}</Badge><Badge>Score {number.format(item.score)}</Badge></div></div>
    <dl className="grid gap-3 text-sm sm:grid-cols-2"><InfoRow label="ID da cobrança" value={item.operationId ?? "Não disponível"} /><InfoRow label="ID do título" value={item.receivableId ?? "Não disponível"} /></dl>
    {item.cadence ? <CollectionCadencePanel cadence={item.cadence} /> : null}
    <CollectionAlertsPanel alerts={item.alerts} highestSeverity={item.highestAlertSeverity} />
    <div className="flex flex-wrap justify-end gap-2">{item.kind === "OPERATION" && item.operationId ? <Button onClick={() => onOpenOperation(item.operationId as string)}>Abrir cobrança</Button> : item.kind === "OPPORTUNITY" ? <Link className="inline-flex min-h-10 items-center justify-center rounded-lg bg-blue-700 px-4 text-sm font-semibold text-white hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700" href={`/customers/${item.customer.id}`} prefetch={false}>Ver cliente</Link> : null}</div>
  </CardContent></Card>;
}

function Filter({ children, label }: { children: React.ReactNode; label: string }) { return <label className="text-sm font-medium text-slate-700">{label}<span className="mt-1.5 block">{children}</span></label>; }
function InfoRow({ label, value }: { label: string; value: string }) { return <div className="min-w-0"><dt className="text-xs uppercase text-slate-500">{label}</dt><dd className="mt-1 break-words font-medium text-slate-950">{value}</dd></div>; }
function InlineEmpty({ text }: { text: string }) { return <div className="rounded-xl border border-dashed bg-white p-6 text-center text-sm text-slate-600">{text}</div>; }
function optional(value: string) { return value.trim() || undefined; }
