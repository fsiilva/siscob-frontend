"use client";

import { AlertTriangle } from "lucide-react";

import { Badge, Button, Card, CardContent, Drawer, EmptyState, LoadingState, Skeleton } from "@/components/ui";
import { useOperation } from "@/hooks/useOperations";
import { ApiRequestError } from "@/services/api";

import { OperationActions } from "./operation-actions";
import { formatOperationDate, operationPriorityLabels, operationStatusLabels } from "./operation-presenter";
import { OperationTimeline } from "./operation-timeline";

export function OperationDetailsDrawer({ operationId, onClose }: { operationId: string | null; onClose(): void }) {
  const query = useOperation(operationId);
  const status = query.error instanceof ApiRequestError ? query.error.status : null;

  return (
    <Drawer className="sm:w-[680px]" onClose={onClose} open={Boolean(operationId)} title="Detalhes da Operation">
      <div className="space-y-6 py-5">
        {query.isLoading ? <LoadingState label="Carregando Operation"><Skeleton className="h-80" /></LoadingState> : null}
        {query.isError ? <EmptyState action={status !== 403 && status !== 404 ? <Button onClick={() => void query.refetch()}>Tentar novamente</Button> : undefined} description={status === 403 ? "Você não tem acesso a esta Operation." : status === 404 ? "A Operation não foi encontrada." : "Não foi possível consultar a Operation."} icon={AlertTriangle} title={status === 403 ? "Acesso negado" : status === 404 ? "Operation não encontrada" : "Erro ao carregar"} /> : null}
        {query.data ? (
          <>
            <Card><CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2"><Badge>{operationStatusLabels[query.data.status]}</Badge><Badge variant={query.data.priority === "URGENT" || query.data.priority === "HIGH" ? "danger" : "open"}>{operationPriorityLabels[query.data.priority]}</Badge></div>
              <dl className="grid gap-4 sm:grid-cols-2">
                <Detail label="ID" value={query.data.id} /><Detail label="Objetivo" value={query.data.objective} />
                <Detail label="Cliente" value={query.data.customerId} /><Detail label="Receivable" value={query.data.receivableId ?? "Não vinculado"} />
                <Detail label="Empresa" value={query.data.companyId} /><Detail label="Carteira" value={query.data.portfolioId} />
                <Detail label="Operador responsável" value={query.data.assignedOperatorId ?? "Não atribuído"} /><Detail label="Versão atual" value={String(query.data.version)} />
                <Detail label="Em espera" value={query.data.waitingReason ?? "—"} /><Detail label="Revisão" value={formatOperationDate(query.data.reviewAt)} />
                <Detail label="Bloqueio" value={query.data.blockedReason ?? "—"} /><Detail label="Conclusão" value={query.data.completionResult ?? "—"} />
                <Detail label="Cancelamento" value={query.data.cancellationReason ?? "—"} /><Detail label="Estado alterado" value={formatOperationDate(query.data.statusChangedAt)} />
                <Detail label="Iniciada" value={formatOperationDate(query.data.startedAt)} /><Detail label="Concluída" value={formatOperationDate(query.data.completedAt)} />
                <Detail label="Cancelada" value={formatOperationDate(query.data.cancelledAt)} /><Detail label="Criada" value={formatOperationDate(query.data.createdAt)} />
                <Detail label="Última atualização" value={formatOperationDate(query.data.updatedAt)} />
              </dl>
            </CardContent></Card>
            <section className="space-y-3"><h3 className="font-semibold text-slate-950">Ações</h3><OperationActions operation={query.data} /></section>
            <section className="space-y-3"><h3 className="font-semibold text-slate-950">Timeline relacionada</h3><OperationTimeline operation={query.data} /></section>
          </>
        ) : null}
      </div>
    </Drawer>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return <div className="min-w-0"><dt className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</dt><dd className="mt-1 break-words text-sm text-slate-900">{value}</dd></div>;
}
