"use client";

import { AlertTriangle, Flame, RefreshCw } from "lucide-react";
import { useMemo, useState } from "react";
import { InteractionDrawer, type InteractionFlow } from "@/components/interactions";
import { buildInteractionPayload } from "@/components/interactions/interaction-api-mapper";
import { Badge, Button, Card, CardContent, EmptyState, Input, LoadingState, Pagination, Select, Skeleton } from "@/components/ui";
import { useAuth } from "@/hooks/useAuth";
import { useCreateInteraction } from "@/hooks/useCreateInteraction";
import { useOperationQueue } from "@/hooks/useOperationQueue";
import type { WorkQueueFilters, WorkQueueItem } from "@/types/work-queue";
import { OperationDetailsDrawer } from "./operation-details-drawer";
import { OperatorSelect } from "./operator-select";
import { operationPriorityLabels, operationStatusLabels } from "./operation-presenter";
import { filterWorkQueueGroup, type WorkQueueGroup } from "./work-queue.presenter";

const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const date = new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" });

export function WorkQueue() {
  const { user } = useAuth();
  const [filters, setFilters] = useState<WorkQueueFilters>({ page: 1, pageSize: 20 });
  const [group, setGroup] = useState<WorkQueueGroup>("priority");
  const [operationId, setOperationId] = useState<string | null>(null);
  const [interactionItem, setInteractionItem] = useState<WorkQueueItem | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const query = useOperationQueue(filters);
  const items = useMemo(() => filterWorkQueueGroup(query.data?.items ?? [], group), [group, query.data?.items]);
  const mutation = useCreateInteraction(
    Number(interactionItem?.operation.customerId ?? 0),
    interactionItem?.operation.id,
  );

  async function save(flow: InteractionFlow) {
    if (!interactionItem) return;
    await mutation.mutateAsync({
      ...buildInteractionPayload(flow, interactionItem.operation.receivableId ?? undefined),
      operationId: interactionItem.operation.id,
    });
    setSuccessMessage(`Cobrança de ${interactionItem.customer?.name ?? interactionItem.operation.customerId} registrada com sucesso.`);
    setInteractionItem(null);
  }

  return <section aria-labelledby="work-queue-title" className="space-y-4">
    <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-lg font-semibold text-slate-950" id="work-queue-title">Fila de trabalho</h2><Button loading={query.isFetching} onClick={() => void query.refetch()} variant="secondary"><RefreshCw aria-hidden className="size-4" />Atualizar dados</Button></div>
    <div className="grid gap-3 rounded-xl border bg-white p-4 sm:grid-cols-2 xl:grid-cols-4">
      <Select aria-label="Agrupar fila" value={group} onChange={(e) => setGroup(e.target.value as WorkQueueGroup)}><option value="priority">Prioridade</option><option value="today">Hoje</option><option value="overdue">Vencidas</option><option value="all">Todas</option></Select>
      <Select aria-label="Filtrar status" value={filters.status ?? ""} onChange={(e) => setFilters((x) => ({ ...x, page: 1, status: value(e.target.value) as WorkQueueFilters["status"] }))}><option value="">Todos os status</option>{Object.entries(operationStatusLabels).filter(([key]) => !["COMPLETED", "CANCELLED"].includes(key)).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</Select>
      <Select aria-label="Filtrar prioridade" value={filters.priority ?? ""} onChange={(e) => setFilters((x) => ({ ...x, page: 1, priority: value(e.target.value) as WorkQueueFilters["priority"] }))}><option value="">Todas as prioridades</option>{Object.entries(operationPriorityLabels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</Select>
      <Input aria-label="Filtrar empresa" placeholder="Empresa" value={filters.company ?? ""} onChange={(e) => setFilters((x) => ({ ...x, page: 1, company: value(e.target.value) }))} />
      <Input aria-label="Filtrar carteira" placeholder="Carteira" value={filters.portfolio ?? ""} onChange={(e) => setFilters((x) => ({ ...x, page: 1, portfolio: value(e.target.value) }))} />
      <Input aria-label="Filtrar cliente" placeholder="Cliente" value={filters.customer ?? ""} onChange={(e) => setFilters((x) => ({ ...x, page: 1, customer: value(e.target.value) }))} />
      {user?.role === "ADMIN" ? <OperatorSelect emptyLabel="Todos os operadores" onChange={(assignedOperatorId) => setFilters((current) => ({ ...current, page: 1, assignedOperatorId }))} value={filters.assignedOperatorId} /> : null}
    </div>
    {query.isLoading ? <LoadingState label="Carregando fila de trabalho"><Skeleton className="h-72" /></LoadingState> : null}
    {query.isError ? <EmptyState action={<Button onClick={() => void query.refetch()}>Tentar novamente</Button>} description="Verifique os filtros e tente novamente." icon={AlertTriangle} title="Não foi possível carregar a fila de trabalho" /> : null}
    {successMessage ? <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800" role="status">{successMessage}</p> : null}
    {!query.isLoading && !query.isError && items.length === 0 ? <EmptyState description="Nenhuma cobrança pendente para os filtros selecionados." title="Fila de trabalho vazia" /> : null}
    {items.map((item, index) => <QueueCard featured={index === 0} item={item} key={item.operation.id} onInteraction={() => setInteractionItem(item)} onOpen={() => setOperationId(item.operation.id)} onRefresh={() => void query.refetch()} />)}
    {query.data ? <Pagination onPageChange={(page) => setFilters((x) => ({ ...x, page }))} page={query.data.page} totalPages={query.data.totalPages} /> : null}
    <OperationDetailsDrawer onClose={() => setOperationId(null)} operationId={operationId} />
    {interactionItem ? <InteractionDrawer customerId={Number(interactionItem.operation.customerId)} customerName={interactionItem.customer?.name ?? interactionItem.operation.customerId} operationContext={{ company: interactionItem.operation.companyName ?? interactionItem.operation.companyId, portfolio: interactionItem.operation.portfolioName ?? interactionItem.operation.portfolioId, receivable: interactionItem.operation.receivableId ?? undefined, objective: interactionItem.operation.objective }} onClose={() => setInteractionItem(null)} onSave={save} open /> : null}
  </section>;
}

export function QueueCard({ featured, item, onInteraction, onOpen, onRefresh }: { featured: boolean; item: WorkQueueItem; onInteraction(): void; onOpen(): void; onRefresh(): void }) {
  return <Card className={featured ? "border-amber-300 bg-amber-50/40 ring-1 ring-amber-200" : undefined}><CardContent className="space-y-4">
    {featured ? <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-800"><Flame aria-hidden className="size-4" />COBRE AGORA</p> : null}
    <div className="flex flex-wrap justify-between gap-3"><div><h3 className="font-semibold text-slate-950">{item.customer?.name ?? `Cliente ${item.operation.customerId}`}</h3><p className="text-sm text-slate-600">{item.operation.objective}</p></div><div className="flex gap-2"><Badge>{operationStatusLabels[item.operation.status]}</Badge><Badge variant={item.operation.priority === "URGENT" || item.operation.priority === "HIGH" ? "danger" : "open"}>{operationPriorityLabels[item.operation.priority]}</Badge><Badge>Score {item.priorityScore}</Badge></div></div>
    <dl className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4"><Info label="Empresa" text={item.operation.companyName ?? item.operation.companyId} /><Info label="Carteira" text={item.operation.portfolioName ?? item.operation.portfolioId} /><Info label="Valor em aberto" text={item.receivable ? currency.format(item.receivable.outstandingAmount) : "—"} /><Info label="Dias de atraso" text={item.receivable ? String(item.receivable.daysOverdue) : "—"} /><Info label="Próxima ação" text={item.nextAction?.description ?? "—"} /><Info label="Vencimento" text={item.nextAction ? date.format(new Date(item.nextAction.dueAt)) : "—"} /></dl>
    <ul aria-label="Motivos da prioridade" className="flex flex-wrap gap-2">{item.priorityReasons.map((reason) => <li className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-700" key={reason}>{reason}</li>)}</ul>
    <div className="flex flex-wrap justify-end gap-2"><Button onClick={onRefresh} variant="secondary">Atualizar dados</Button><Button onClick={onInteraction} variant="secondary">Registrar cobrança</Button><Button onClick={onOpen}>Abrir Operation</Button></div>
  </CardContent></Card>;
}
function Info({ label, text }: { label: string; text: string }) { return <div><dt className="text-xs uppercase text-slate-500">{label}</dt><dd className="mt-1 font-medium text-slate-950">{text}</dd></div>; }
function value(input: string) { return input.trim() || undefined; }
