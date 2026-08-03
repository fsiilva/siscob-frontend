"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";
import { useState } from "react";

import { Button, EmptyState, Input, LoadingState, Pagination, Select, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableHeader, TableRow } from "@/components/ui";
import { useCompany } from "@/context/company";
import { useAuth } from "@/hooks/useAuth";
import { useOperations } from "@/hooks/useOperations";
import { ApiRequestError } from "@/services/api";
import type { OperationListParams, OperationPriority, OperationSortField, OperationSortOrder, OperationStatus } from "@/types/operations-api";

import { CreateOperationDrawer } from "./create-operation-drawer";
import { canCreateOperation } from "./create-operation-form";
import { OperationDetailsDrawer } from "./operation-details-drawer";
import { formatOperationDate, operationPriorityLabels, operationStatusLabels } from "./operation-presenter";

type FilterDraft = Omit<OperationListParams, "page" | "pageSize">;

export function OperationList() {
  const { user } = useAuth();
  const { selectedCompany } = useCompany();
  const initialFilters: FilterDraft = { sortBy: "updatedAt", sortOrder: "desc", ...(selectedCompany ? { companyId: String(selectedCompany.id) } : {}) };
  const [draft, setDraft] = useState<FilterDraft>(initialFilters);
  const [params, setParams] = useState<OperationListParams>({ ...initialFilters, page: 1, pageSize: 20 });
  const [selectedOperationId, setSelectedOperationId] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const query = useOperations(params);

  function applyFilters() {
    setParams({ ...draft, page: 1, pageSize: params.pageSize });
  }

  function clearFilters() {
    const cleared: FilterDraft = { sortBy: "updatedAt", sortOrder: "desc", ...(selectedCompany ? { companyId: String(selectedCompany.id) } : {}) };
    setDraft(cleared);
    setParams({ ...cleared, page: 1, pageSize: 20 });
  }

  const status = query.error instanceof ApiRequestError ? query.error.status : null;

  return (
    <section aria-labelledby="operations-title" className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-sm font-semibold text-slate-950" id="operations-title">Operations</h2><div className="flex gap-2">{canCreateOperation(user) ? <Button onClick={() => { setSuccess(null); setCreateOpen(true); }}>Nova Operation</Button> : null}<Button loading={query.isFetching} onClick={() => void query.refetch()} variant="secondary"><RefreshCw aria-hidden className="size-4" />Atualizar dados</Button></div></div>
      {success ? <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800" role="status">{success}</p> : null}
      <div className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:grid-cols-2 xl:grid-cols-4">
        <Select aria-label="Filtrar por estado" onChange={(event) => setDraft((current) => ({ ...current, status: valueOrUndefined(event.target.value) as OperationStatus | undefined }))} value={draft.status ?? ""}><option value="">Todos os estados</option>{Object.entries(operationStatusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</Select>
        <Select aria-label="Filtrar por prioridade" onChange={(event) => setDraft((current) => ({ ...current, priority: valueOrUndefined(event.target.value) as OperationPriority | undefined }))} value={draft.priority ?? ""}><option value="">Todas as prioridades</option>{Object.entries(operationPriorityLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</Select>
        <Input aria-label="Filtrar por empresa" onChange={(event) => setDraft((current) => ({ ...current, companyId: valueOrUndefined(event.target.value) }))} placeholder="Empresa" value={draft.companyId ?? ""} />
        <Input aria-label="Filtrar por carteira" onChange={(event) => setDraft((current) => ({ ...current, portfolioId: valueOrUndefined(event.target.value) }))} placeholder="Carteira" value={draft.portfolioId ?? ""} />
        <Input aria-label="Filtrar por operador" onChange={(event) => setDraft((current) => ({ ...current, assignedOperatorId: valueOrUndefined(event.target.value) }))} placeholder="UUID do operador" value={draft.assignedOperatorId ?? ""} />
        <Input aria-label="Filtrar por cliente" onChange={(event) => setDraft((current) => ({ ...current, customerId: valueOrUndefined(event.target.value) }))} placeholder="Cliente" value={draft.customerId ?? ""} />
        <Input aria-label="Filtrar por receivable" onChange={(event) => setDraft((current) => ({ ...current, receivableId: valueOrUndefined(event.target.value) }))} placeholder="Receivable" value={draft.receivableId ?? ""} />
        <div className="grid grid-cols-2 gap-2"><Select aria-label="Ordenar por" onChange={(event) => setDraft((current) => ({ ...current, sortBy: event.target.value as OperationSortField }))} value={draft.sortBy}><option value="updatedAt">Atualização</option><option value="createdAt">Criação</option><option value="priority">Prioridade</option><option value="status">Estado</option></Select><Select aria-label="Direção da ordenação" onChange={(event) => setDraft((current) => ({ ...current, sortOrder: event.target.value as OperationSortOrder }))} value={draft.sortOrder}><option value="desc">Decrescente</option><option value="asc">Crescente</option></Select></div>
        <div className="flex gap-2 sm:col-span-2 xl:col-span-4 xl:justify-end"><Button onClick={clearFilters} variant="secondary">Limpar</Button><Button onClick={applyFilters}>Aplicar filtros</Button></div>
      </div>

      {query.isLoading ? <LoadingState label="Carregando Operations"><Skeleton className="h-80" /></LoadingState> : null}
      {query.isError ? <EmptyState action={status !== 403 ? <Button onClick={() => void query.refetch()}>Tentar novamente</Button> : undefined} description={status === 403 ? "Você não tem acesso a esta lista." : status === 400 || status === 422 ? "Revise os filtros informados." : "Não foi possível consultar as Operations."} icon={AlertTriangle} title={status === 403 ? "Acesso negado" : "Erro ao carregar Operations"} /> : null}
      {query.data?.items.length === 0 ? <EmptyState action={canCreateOperation(user) ? <Button onClick={() => setCreateOpen(true)}>Criar primeira Operation</Button> : undefined} description="Nenhuma Operation corresponde aos filtros aplicados." title="Nenhuma Operation encontrada" /> : null}
      {query.data?.items.length ? (
        <div className="space-y-4 rounded-xl border border-slate-200 bg-white">
          <TableContainer><Table><TableHeader><TableRow><TableHead>Cliente / Receivable</TableHead><TableHead>Objetivo</TableHead><TableHead>Empresa / Carteira</TableHead><TableHead>Operador</TableHead><TableHead>Estado</TableHead><TableHead>Prioridade</TableHead><TableHead>Atualização</TableHead><TableHead><span className="sr-only">Ações</span></TableHead></TableRow></TableHeader><TableBody>
            {query.data.items.map((operation) => <TableRow key={operation.id}><TableCell><p className="font-medium text-slate-950">{operation.customerId}</p><p className="text-xs text-slate-500">{operation.receivableId ?? "Sem receivable"}</p></TableCell><TableCell className="max-w-72"><p className="line-clamp-2">{operation.objective}</p></TableCell><TableCell><p>{operation.companyId}</p><p className="text-xs text-slate-500">{operation.portfolioId}</p></TableCell><TableCell>{operation.assignedOperatorId ?? "Não atribuído"}</TableCell><TableCell>{operationStatusLabels[operation.status]}</TableCell><TableCell>{operationPriorityLabels[operation.priority]}</TableCell><TableCell>{formatOperationDate(operation.updatedAt)}</TableCell><TableCell><Button onClick={() => setSelectedOperationId(operation.id)} variant="secondary">Abrir detalhes</Button></TableCell></TableRow>)}
          </TableBody></Table></TableContainer>
          <Pagination className="px-4 pb-4" onPageChange={(page) => setParams((current) => ({ ...current, page }))} page={query.data.page} totalPages={query.data.totalPages} />
        </div>
      ) : null}
      <OperationDetailsDrawer onClose={() => setSelectedOperationId(null)} operationId={selectedOperationId} />
      {createOpen ? <CreateOperationDrawer onClose={() => setCreateOpen(false)} onCreated={(operation) => { setCreateOpen(false); setSuccess("Operation criada com sucesso."); setSelectedOperationId(operation.id); }} /> : null}
    </section>
  );
}

function valueOrUndefined(value: string) {
  return value.trim() || undefined;
}
