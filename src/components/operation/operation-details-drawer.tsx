"use client";

import { AlertTriangle, CalendarClock, MessageSquareText } from "lucide-react";
import { useState } from "react";

import { Badge, Button, Card, CardContent, Drawer, EmptyState, LoadingState, Skeleton } from "@/components/ui";
import { useOperationDetails } from "@/hooks/useOperations";
import { ApiRequestError } from "@/services/api";

import { OperationActions } from "./operation-actions";
import { formatOperationDate, operationPriorityLabels, operationStatusLabels } from "./operation-presenter";
import { OperationTimeline } from "./operation-timeline";

export function OperationDetailsDrawer({ operationId, onClose }: { operationId: string | null; onClose(): void }) {
  const query = useOperationDetails(operationId);
  const [openActionId, setOpenActionId] = useState<string | null>(null);
  const status = query.error instanceof ApiRequestError ? query.error.status : null;
  const details = query.data;
  const operation = details?.operation;

  return (
    <Drawer className="sm:w-[760px]" contentClassName="pb-0" onClose={onClose} open={Boolean(operationId)} title="Operation">
      <div className="flex min-h-full flex-col">
        <div className="flex-1 space-y-6 py-5">
          {query.isLoading ? <LoadingState label="Carregando Operation"><Skeleton className="h-96" /></LoadingState> : null}
          {query.isError ? <EmptyState action={status !== 403 && status !== 404 ? <Button onClick={() => void query.refetch()}>Tentar novamente</Button> : undefined} description={status === 403 ? "Você não tem acesso a esta Operation." : status === 404 ? "A Operation não foi encontrada." : "Não foi possível consultar a Operation."} icon={AlertTriangle} title={status === 403 ? "Acesso negado" : status === 404 ? "Operation não encontrada" : "Erro ao carregar"} /> : null}
          {operation && details ? (
            <>
              <section aria-labelledby="operation-header">
                <div className="flex flex-wrap gap-2"><Badge>{operationStatusLabels[operation.status]}</Badge><Badge variant={operation.priority === "URGENT" || operation.priority === "HIGH" ? "danger" : "open"}>{operationPriorityLabels[operation.priority]}</Badge></div>
                <h3 className="mt-3 text-lg font-semibold text-slate-950" id="operation-header">{operation.objective}</h3>
                <dl className="mt-4 grid gap-4 rounded-xl border border-slate-200 bg-white p-4 sm:grid-cols-2">
                  <Detail label="Empresa" value={operation.companyId} /><Detail label="Carteira" value={operation.portfolioId} />
                  <Detail label="Cliente" value={operation.customerId} /><Detail label="Recebível" value={operation.receivableId ?? "Não vinculado"} />
                </dl>
              </section>

              <Block title="Resumo">
                <dl className="grid gap-4 sm:grid-cols-2">
                  <Detail label="Operador responsável" value={operation.assignedOperator?.name ?? "Não atribuído"} />
                  <Detail label="Version" value={String(operation.version)} />
                  <Detail label="Criada em" value={formatOperationDate(operation.createdAt)} /><Detail label="Atualizada em" value={formatOperationDate(operation.updatedAt)} />
                  <Detail label="Waiting" value={operation.waitingReason ?? "—"} /><Detail label="Blocked" value={operation.blockedReason ?? "—"} />
                  <Detail label="Completion" value={operation.completedReason ?? "—"} /><Detail label="Cancelamento" value={operation.cancelledReason ?? "—"} />
                </dl>
              </Block>

              <Block title="Próximas ações">
                {details.nextActions.length ? <ul className="space-y-3">{details.nextActions.map((action) => (
                  <li className="rounded-lg border border-slate-200 p-4" key={action.id}>
                    <div className="flex flex-wrap items-start justify-between gap-3"><div><Badge>{action.status}</Badge><p className="mt-2 font-medium text-slate-950">{action.description}</p><p className="mt-1 text-xs text-slate-500">Vencimento: {formatOperationDate(action.dueAt)}</p></div><Button onClick={() => setOpenActionId((current) => current === action.id ? null : action.id)} variant="secondary">Abrir Next Action</Button></div>
                    {openActionId === action.id ? <dl className="mt-3 grid gap-3 border-t border-slate-200 pt-3 sm:grid-cols-2"><Detail label="Tipo" value={action.type} /><Detail label="Título" value={action.title} /><Detail label="Criada em" value={formatOperationDate(action.createdAt)} /></dl> : null}
                  </li>
                ))}</ul> : <EmptyState description="Nenhuma próxima ação registrada." icon={CalendarClock} title="Sem próximas ações" />}
              </Block>

              <Block title="Timeline"><OperationTimeline items={details.timeline} operation={operation} /></Block>

              <Block title="Interactions">
                {details.interactions.length ? <ul className="space-y-3">{details.interactions.map((interaction) => <li className="rounded-lg border border-slate-200 p-4" key={interaction.id}><div className="flex flex-wrap justify-between gap-2"><Badge>{interaction.channel}</Badge><time className="text-xs text-slate-500" dateTime={interaction.createdAt}>{formatOperationDate(interaction.createdAt)}</time></div><p className="mt-2 text-sm text-slate-700">{interaction.notes}</p><p className="mt-1 text-xs text-slate-500">{interaction.outcome}</p></li>)}</ul> : <EmptyState description="Nenhuma interação registrada." icon={MessageSquareText} title="Sem interactions" />}
              </Block>
            </>
          ) : null}
        </div>
        {operation ? <footer className="sticky bottom-0 -mx-5 mt-6 border-t border-slate-200 bg-white px-5 py-4 sm:-mx-6 sm:px-6"><p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Workflow</p><OperationActions operation={operation} /></footer> : null}
      </div>
    </Drawer>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="space-y-3"><h3 className="font-semibold text-slate-950">{title}</h3><Card><CardContent>{children}</CardContent></Card></section>;
}

function Detail({ label, value }: { label: string; value: string }) {
  return <div className="min-w-0"><dt className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</dt><dd className="mt-1 break-words text-sm text-slate-900">{value}</dd></div>;
}
