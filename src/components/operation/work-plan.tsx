"use client";

import { AlertTriangle, Flame, Inbox, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { buildInteractionPayload } from "@/components/interactions/interaction-api-mapper";
import { InteractionDrawer, type InteractionFlow } from "@/components/interactions";
import { formatCustomer360Company, formatCustomer360Date } from "@/components/customers/customer-360.presenter";
import { DashboardContainer } from "@/components/layout/DashboardContainer";
import { Badge, Button, Card, CardContent, EmptyState, Input, LoadingState, Pagination, Select, Skeleton } from "@/components/ui";
import { useAuth } from "@/hooks/useAuth";
import { useCompanies } from "@/hooks/useCompanies";
import { useCreateInteraction } from "@/hooks/useCreateInteraction";
import { useWorkPlan } from "@/hooks/useWorkPlan";
import type { OperationPriority, OperationStatus } from "@/types/operations-api";
import type { WorkPlanFilters, WorkPlanItem, WorkPlanKind } from "@/types/work-plan";

import { CreateOperationDrawer, type CreateOperationContext } from "./create-operation-drawer";
import { OperationDetailsDrawer } from "./operation-details-drawer";
import { operationPriorityLabels, operationStatusLabels } from "./operation-presenter";
import { getWorkPlanErrorMessage } from "./work-plan.error";

const PAGE_SIZE = 20;
const number = new Intl.NumberFormat("pt-BR");
const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const initialFilters: WorkPlanFilters = { page: 1, pageSize: PAGE_SIZE };

export function WorkPlan() {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";
  const [filters, setFilters] = useState<WorkPlanFilters>(initialFilters);
  const query = useWorkPlan(filters);
  const companiesQuery = useCompanies({ active: true });
  const [operationId, setOperationId] = useState<string | null>(null);
  const [createContext, setCreateContext] = useState<CreateOperationContext | null>(null);
  const [interactionItem, setInteractionItem] = useState<WorkPlanItem | null>(null);
  const interactionOperationId = interactionItem?.operation?.id;
  const interactionMutation = useCreateInteraction(Number(interactionItem?.customer.id ?? 0), interactionOperationId);

  function updateFilter<Key extends keyof WorkPlanFilters>(key: Key, value: WorkPlanFilters[Key]) {
    setFilters((current) => ({ ...current, [key]: value, page: 1 }));
  }

  async function saveInteraction(flow: InteractionFlow) {
    if (!interactionItem?.operation) return;
    await interactionMutation.mutateAsync({
      ...buildInteractionPayload(flow, interactionItem.receivable?.id),
      operationId: interactionItem.operation.id,
    });
    setInteractionItem(null);
  }

  return <DashboardContainer>
    <header><p className="text-sm font-semibold text-blue-700">Operação</p><h1 className="text-2xl font-bold text-slate-950">Plano de Trabalho</h1><p className="mt-1 text-sm text-slate-600">Priorize e execute as próximas cobranças em uma única fila.</p></header>

    <WorkPlanFilterBar companiesQuery={companiesQuery} filters={filters} isAdmin={isAdmin} onChange={updateFilter} />

    {query.isLoading ? <LoadingState label="Carregando plano de trabalho"><div className="space-y-4"><Skeleton className="h-64" /><Skeleton className="h-64" /></div></LoadingState> : null}
    {query.isError ? <EmptyState action={<Button onClick={() => void query.refetch()}><RefreshCw aria-hidden className="size-4" />Tentar novamente</Button>} description={getWorkPlanErrorMessage(query.error)} icon={AlertTriangle} title="Não foi possível carregar o plano de trabalho" /> : null}
    {query.data?.items.length === 0 ? <EmptyState description="Nenhuma cobrança disponível para os filtros selecionados." icon={Inbox} title="Plano de trabalho vazio" /> : null}
    {query.data?.items.length ? <section aria-label="Cobranças priorizadas" className="space-y-4">{query.data.items.map((item, index) => <WorkPlanCard featured={index === 0} isAdmin={isAdmin} item={item} key={`${item.kind}-${item.operation?.id ?? item.receivable?.id ?? index}`} onCreate={setCreateContext} onInteraction={setInteractionItem} onOpen={setOperationId} />)}</section> : null}
    {query.data ? <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><p className="text-sm text-slate-600">{number.format(query.data.total)} item(ns) · página {number.format(query.data.page)}</p><Pagination onPageChange={(page) => setFilters((current) => ({ ...current, page }))} page={query.data.page} totalPages={query.data.totalPages} /></div> : null}

    <OperationDetailsDrawer onClose={() => setOperationId(null)} operationId={operationId} />
    {createContext ? <CreateOperationDrawer context={createContext} onClose={() => setCreateContext(null)} onCreated={() => setCreateContext(null)} /> : null}
    {interactionItem?.operation ? <InteractionDrawer customerId={Number(interactionItem.customer.id)} customerName={interactionItem.customer.name} onClose={() => setInteractionItem(null)} onSave={saveInteraction} open /> : null}
  </DashboardContainer>;
}

function WorkPlanFilterBar({ companiesQuery, filters, isAdmin, onChange }: { companiesQuery: ReturnType<typeof useCompanies>; filters: WorkPlanFilters; isAdmin: boolean; onChange<Key extends keyof WorkPlanFilters>(key: Key, value: WorkPlanFilters[Key]): void }) {
  return <section aria-label="Filtros do plano de trabalho" className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
      {isAdmin ? <Filter label="Tipo"><Select onChange={(event) => onChange("kind", optional(event.target.value) as WorkPlanKind | undefined)} value={filters.kind ?? ""}><option value="">Todos</option><option value="OPERATION">Operations</option><option value="OPPORTUNITY">Oportunidades</option></Select></Filter> : null}
      <Filter label="Empresa"><Select disabled={companiesQuery.isLoading} onChange={(event) => onChange("companyId", optional(event.target.value))} value={filters.companyId ?? ""}><option value="">Todas as empresas</option>{companiesQuery.data?.data.map((company) => <option key={company.id} value={company.id}>{company.name}</option>)}</Select></Filter>
      <Filter label="Cliente"><Input inputMode="numeric" onChange={(event) => onChange("customerId", optional(event.target.value))} placeholder="ID do cliente" value={filters.customerId ?? ""} /></Filter>
      <Filter label="Prioridade"><Select onChange={(event) => onChange("priority", optional(event.target.value) as OperationPriority | undefined)} value={filters.priority ?? ""}><option value="">Todas</option>{Object.entries(operationPriorityLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</Select></Filter>
      <Filter label="Status da Operation"><Select onChange={(event) => onChange("status", optional(event.target.value) as OperationStatus | undefined)} value={filters.status ?? ""}><option value="">Todos</option>{Object.entries(operationStatusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</Select></Filter>
    </div>
    {filters.status ? <p className="text-xs text-slate-500">O filtro de status aplica-se somente a Operations; oportunidades não participam desse filtro.</p> : null}
    <label className="inline-flex min-h-10 items-center gap-2 text-sm font-medium text-slate-700"><input checked={filters.overdueOnly ?? false} onChange={(event) => onChange("overdueOnly", event.target.checked || undefined)} type="checkbox" />Somente vencidos</label>
    {companiesQuery.isError ? <div className="flex flex-col items-start justify-between gap-2 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900 sm:flex-row sm:items-center" role="alert"><span>Não foi possível carregar o catálogo de empresas.</span><Button onClick={() => void companiesQuery.refetch()} variant="secondary">Tentar novamente</Button></div> : null}
  </section>;
}

function WorkPlanCard({ featured, isAdmin, item, onCreate, onInteraction, onOpen }: { featured: boolean; isAdmin: boolean; item: WorkPlanItem; onCreate(context: CreateOperationContext): void; onInteraction(item: WorkPlanItem): void; onOpen(id: string): void }) {
  const opportunityContext: CreateOperationContext | null = item.kind === "OPPORTUNITY" && item.receivable ? { customerId: item.customer.id, customerName: item.customer.name, companyId: item.company.id, companyName: formatCustomer360Company(item.company), receivableId: item.receivable.id, suggestedPriority: item.suggestedPriority } : null;
  return <Card className={featured ? "border-amber-300 bg-amber-50/40 ring-1 ring-amber-200" : undefined}><CardContent className="space-y-4">
    <div className="flex flex-wrap items-start justify-between gap-3"><div className="space-y-2">{featured ? <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-800"><Flame aria-hidden className="size-4" />COBRAR AGORA</p> : null}<div className="flex flex-wrap gap-2"><Badge variant={item.kind === "OPERATION" ? "open" : "success"}>{item.kind === "OPERATION" ? "Operation ativa" : "Oportunidade"}</Badge><Badge>{operationPriorityLabels[item.suggestedPriority]}</Badge><Badge>Score {number.format(item.score)}</Badge></div></div>{item.operation ? <div className="flex flex-wrap gap-2"><Badge>{operationStatusLabels[item.operation.status]}</Badge><Badge variant={item.operation.priority === "HIGH" || item.operation.priority === "URGENT" ? "danger" : "open"}>Prioridade persistida: {operationPriorityLabels[item.operation.priority]}</Badge></div> : null}</div>
    <div><Link className="font-semibold text-blue-700 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2" href={`/customers/${item.customer.id}`} prefetch={false}>{item.customer.name}</Link><p className="mt-1 text-sm text-slate-600">{formatCustomer360Company(item.company)}</p></div>
    <dl className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4"><Info label="Recebível" value={item.receivable?.id ?? "Não vinculado"} /><Info label="Saldo" value={item.receivable ? currency.format(item.receivable.balance) : "—"} /><Info label="Vencimento" value={item.receivable ? formatCustomer360Date(item.receivable.dueDate) : "—"} /><Info label="Atraso" value={item.receivable ? `${number.format(item.receivable.daysOverdue)} dias` : "—"} />{item.operation ? <Info label="Operador responsável" value={item.operation.assignedOperator?.name ?? "Não atribuído"} /> : null}{item.operation ? <Info label="Next Action" value={item.nextAction ? `${item.nextAction.type} · ${formatCustomer360Date(item.nextAction.dueAt)}` : "Não definida"} /> : null}</dl>
    {item.reasons.length ? <div><p className="text-xs font-medium uppercase tracking-wide text-slate-500">Motivos</p><ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">{item.reasons.map((reason, index) => <li key={`${item.kind}-${index}`}>{reason}</li>)}</ul></div> : null}
    <div className="flex flex-wrap justify-end gap-2">{item.operation ? <><Button onClick={() => onInteraction(item)} variant="secondary">Registrar cobrança</Button><Button onClick={() => onOpen(item.operation?.id ?? "")}>Abrir Operation</Button></> : opportunityContext && isAdmin ? <Button onClick={() => onCreate(opportunityContext)}>Criar Operation</Button> : null}</div>
  </CardContent></Card>;
}

function Filter({ children, label }: { children: React.ReactNode; label: string }) { return <label className="text-sm font-medium text-slate-700">{label}<span className="mt-1.5 block">{children}</span></label>; }
function Info({ label, value }: { label: string; value: string }) { return <div className="min-w-0"><dt className="text-xs uppercase text-slate-500">{label}</dt><dd className="mt-1 break-words font-medium text-slate-950">{value}</dd></div>; }
function optional(value: string) { return value.trim() || undefined; }
