"use client";

import { AlertTriangle, Inbox, RefreshCw } from "lucide-react";
import { useState } from "react";

import { CreateOperationDrawer, type CreateOperationContext } from "@/components/operation/create-operation-drawer";
import { operationPriorityLabels } from "@/components/operation/operation-presenter";
import { Badge, Button, Card, CardContent, EmptyState, LoadingState, Section, Skeleton } from "@/components/ui";
import { useCollectionOpportunities } from "@/hooks/useCollectionOpportunities";
import type { CollectionOpportunity } from "@/types/collection-opportunities";

import { customer360Currency, formatCustomer360Company, formatCustomer360Date } from "./customer-360.presenter";
import { getCollectionOpportunitiesErrorMessage } from "./collection-opportunities.error";

const number = new Intl.NumberFormat("pt-BR");

export function CollectionOpportunitiesSection({ customerId, customerName, onOpenOperation }: { customerId: number; customerName: string; onOpenOperation(id: string): void }) {
  const query = useCollectionOpportunities(customerId);
  const [createContext, setCreateContext] = useState<CreateOperationContext | null>(null);

  return <Section title={`Oportunidades de cobrança${query.data ? ` (${number.format(query.data.items.length)})` : ""}`}>
    {query.isLoading ? <LoadingState className="mt-3 grid gap-4 md:grid-cols-2" label="Carregando oportunidades de cobrança"><Skeleton className="h-64" /><Skeleton className="h-64" /></LoadingState> : null}
    {query.isError ? <div className="mt-3"><EmptyState action={<Button onClick={() => void query.refetch()}><RefreshCw aria-hidden className="size-4" />Tentar novamente</Button>} description={getCollectionOpportunitiesErrorMessage(query.error)} icon={AlertTriangle} title="Não foi possível carregar as oportunidades" /></div> : null}
    {query.data?.items.length === 0 ? <div className="mt-3"><EmptyState description="Nenhuma oportunidade de cobrança disponível para este cliente." icon={Inbox} title="Sem oportunidades" /></div> : null}
    {query.data?.items.length ? <div className="mt-3 grid gap-4 xl:grid-cols-2">{query.data.items.map((item) => <OpportunityCard customerId={customerId} customerName={customerName} item={item} key={item.receivableId} onCreate={setCreateContext} onOpenOperation={onOpenOperation} />)}</div> : null}
    {createContext ? <CreateOperationDrawer context={createContext} onClose={() => setCreateContext(null)} onCreated={() => setCreateContext(null)} /> : null}
  </Section>;
}

function OpportunityCard({ customerId, customerName, item, onCreate, onOpenOperation }: { customerId: number; customerName: string; item: CollectionOpportunity; onCreate(context: CreateOperationContext): void; onOpenOperation(id: string): void }) {
  const context: CreateOperationContext = { customerId, customerName, companyId: item.company.id, companyName: formatCustomer360Company(item.company), receivableId: item.receivableId, suggestedPriority: item.suggestedPriority };
  return <Card><CardContent className="space-y-4">
    <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs font-medium uppercase tracking-wide text-slate-500">Empresa</p><h3 className="mt-1 font-semibold text-slate-950">{formatCustomer360Company(item.company)}</h3></div><div className="flex flex-wrap items-center gap-2"><span className="text-xs font-medium text-slate-500">Prioridade sugerida</span><Badge variant={item.suggestedPriority === "HIGH" || item.suggestedPriority === "URGENT" ? "danger" : "open"}>{operationPriorityLabels[item.suggestedPriority]}</Badge><Badge>Score {number.format(item.score)}</Badge></div></div>
    <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm sm:grid-cols-4"><OpportunityField label="Vencimento" value={formatCustomer360Date(item.dueDate)} /><OpportunityField label="Valor original" value={customer360Currency.format(item.amount)} /><OpportunityField label="Saldo em aberto" value={customer360Currency.format(item.balance)} /><OpportunityField label="Dias de atraso" value={number.format(item.daysOverdue)} /></dl>
    {item.reasons.length ? <div><p className="text-xs font-medium uppercase tracking-wide text-slate-500">Motivos</p><ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">{item.reasons.map((reason, index) => <li key={`${item.receivableId}-${index}`}>{reason}</li>)}</ul></div> : null}
    <div className="flex justify-end">{item.hasActiveOperation ? item.activeOperationId ? <Button onClick={() => onOpenOperation(item.activeOperationId as string)} variant="secondary">Abrir Operation</Button> : <Badge>Operation ativa</Badge> : <Button onClick={() => onCreate(context)}>Criar Operation</Button>}</div>
  </CardContent></Card>;
}

function OpportunityField({ label, value }: { label: string; value: string }) {
  return <div><dt className="text-xs text-slate-500">{label}</dt><dd className="mt-1 break-words font-medium text-slate-900">{value}</dd></div>;
}
