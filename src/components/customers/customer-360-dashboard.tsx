"use client";

import { AlertTriangle, CalendarClock, CircleDollarSign, FileClock, Files, Inbox, Mail, Phone, RefreshCw, UserRound } from "lucide-react";
import { useState } from "react";

import { NextActionCard } from "@/components/next-actions";
import { OperationDetailsDrawer } from "@/components/operation/operation-details-drawer";
import { operationPriorityLabels, operationStatusLabels } from "@/components/operation/operation-presenter";
import { TimelineEmpty, TimelineItem, presentTimelineEvent } from "@/components/timeline";
import { Badge, Button, Card, CardContent, EmptyState, LoadingState, PageHeader, Section, Skeleton, StatCard, Table, TableBody, TableCell, TableContainer, TableHead, TableHeader, TableRow } from "@/components/ui";
import { useCustomer360 } from "@/hooks/useCustomer360";
import { ApiRequestError } from "@/services/api";
import type { Customer360 } from "@/types/customer-360";

import { customer360Currency, formatCustomer360Date, formatCustomer360DateTime, friendlyCustomerValue } from "./customer-360.presenter";
import { getCustomer360ErrorMessage } from "./customer-360.error";

const number = new Intl.NumberFormat("pt-BR");

export function Customer360Dashboard({ customerId }: { customerId: number }) {
  const query = useCustomer360(customerId);
  const [operationId, setOperationId] = useState<string | null>(null);
  const invalidId = !Number.isInteger(customerId) || customerId <= 0;
  const status = query.error instanceof ApiRequestError ? query.error.status : null;

  if (invalidId || status === 404) return <CustomerPageState title="Cliente não encontrado." description="O cliente solicitado não existe ou não está disponível para consulta." />;
  if (status === 403) return <CustomerPageState title="Você não possui acesso a este cliente." description="Solicite acesso a um administrador caso necessário." />;

  return <div className="mx-auto flex min-w-0 w-full max-w-[1600px] flex-1 flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
    <PageHeader description="Visão operacional, financeira e histórica consolidada do cliente." eyebrow="Clientes" icon={UserRound} title="Customer 360" />
    {query.isLoading ? <Customer360Loading /> : null}
    {query.isError ? <EmptyState action={status !== 401 ? <Button onClick={() => void query.refetch()}><RefreshCw aria-hidden className="size-4" />Tentar novamente</Button> : undefined} description={getCustomer360ErrorMessage(query.error)} icon={AlertTriangle} title="Não foi possível carregar o cliente" /> : null}
    {query.data ? <Customer360Content data={query.data} onOpenOperation={setOperationId} /> : null}
    <OperationDetailsDrawer onClose={() => setOperationId(null)} operationId={operationId} />
  </div>;
}

function Customer360Content({ data, onOpenOperation }: { data: Customer360; onOpenOperation(id: string): void }) {
  return <><CustomerHeader data={data} /><FinancialSummary data={data} /><ReceivablesSection data={data} /><OperationsSection data={data} onOpen={onOpenOperation} /><NextActionsSection data={data} /><InteractionsSection data={data} /><CustomerTimelineSection data={data} /></>;
}

function CustomerHeader({ data }: { data: Customer360 }) {
  return <Card><CardContent><div className="flex items-start gap-3"><UserRound aria-hidden className="mt-1 size-6 text-blue-700" /><div><p className="text-xs font-semibold uppercase tracking-wide text-blue-700">Cliente</p><h1 className="mt-1 text-2xl font-bold text-slate-950">{data.customer.name}</h1></div></div><dl className="mt-5 grid gap-4 sm:grid-cols-3"><HeaderField label="Documento" value={friendlyCustomerValue(data.customer.document)} /><HeaderField icon={Phone} label="Telefone" value={friendlyCustomerValue(data.customer.phone)} /><HeaderField icon={Mail} label="E-mail" value={friendlyCustomerValue(data.customer.email)} /></dl></CardContent></Card>;
}

function HeaderField({ icon: Icon, label, value }: { icon?: typeof Phone; label: string; value: string }) {
  return <div><dt className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-500">{Icon ? <Icon aria-hidden className="size-4" /> : null}{label}</dt><dd className="mt-1 break-words text-sm font-medium text-slate-900">{value}</dd></div>;
}

function FinancialSummary({ data }: { data: Customer360 }) {
  const cards = [["Total em aberto", customer360Currency.format(data.financial.totalOpen), CircleDollarSign], ["Total vencido", customer360Currency.format(data.financial.totalOverdue), CalendarClock], ["Quantidade de títulos", number.format(data.financial.receivablesCount), Files], ["Títulos vencidos", number.format(data.financial.overdueCount), FileClock], ["Título mais antigo", formatCustomer360Date(data.financial.oldestDueDate), CalendarClock]] as const;
  return <Section title="Resumo financeiro"><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">{cards.map(([label, value, icon]) => <StatCard icon={icon} key={label} label={label} value={value} />)}</div></Section>;
}

function ReceivablesSection({ data }: { data: Customer360 }) {
  return <Section title="Recebíveis">{data.receivables.length === 0 ? <SectionEmpty title="Cliente sem recebíveis" description="Nenhum título foi retornado para este cliente." /> : <Card className="overflow-hidden"><TableContainer><Table><TableHeader><TableRow><TableHead>Empresa</TableHead><TableHead>Vencimento</TableHead><TableHead>Valor</TableHead><TableHead>Saldo</TableHead><TableHead>Dias de atraso</TableHead><TableHead>Status</TableHead></TableRow></TableHeader><TableBody>{data.receivables.map((item) => <TableRow key={item.id}><TableCell>{item.company}</TableCell><TableCell>{formatCustomer360Date(item.dueDate)}</TableCell><TableCell>{customer360Currency.format(item.amount)}</TableCell><TableCell className="font-semibold">{customer360Currency.format(item.balance)}</TableCell><TableCell>{number.format(item.daysOverdue)}</TableCell><TableCell><Badge>{item.status}</Badge></TableCell></TableRow>)}</TableBody></Table></TableContainer></Card>}</Section>;
}

function OperationsSection({ data, onOpen }: { data: Customer360; onOpen(id: string): void }) {
  return <Section title="Operations">{data.operations.length === 0 ? <SectionEmpty title="Cliente sem Operations" description="Nenhuma Operation foi encontrada para este cliente." /> : <div className="grid gap-4 lg:grid-cols-2">{data.operations.map((item) => <Card key={item.id}><CardContent className="space-y-4"><div className="flex flex-wrap gap-2"><Badge>{operationStatusLabels[item.status]}</Badge><Badge variant={item.priority === "HIGH" || item.priority === "URGENT" ? "danger" : "open"}>{operationPriorityLabels[item.priority]}</Badge></div><div><h3 className="font-semibold text-slate-950">{item.objective}</h3><p className="mt-1 text-sm text-slate-600">{item.company ?? item.companyId ?? "Empresa não informada"} · {item.portfolio ?? item.portfolioId ?? "Carteira não informada"}</p><p className="mt-2 text-xs text-slate-500">Atualizada em {formatCustomer360DateTime(item.updatedAt)}</p></div><div className="flex justify-end"><Button onClick={() => onOpen(item.id)} variant="secondary">Abrir Operation</Button></div></CardContent></Card>)}</div>}</Section>;
}

function NextActionsSection({ data }: { data: Customer360 }) {
  return <Section title="Próximas ações">{data.nextActions.length === 0 ? <SectionEmpty title="Sem Next Actions" description="Nenhuma próxima ação foi retornada para este cliente." /> : <div className="grid gap-4 xl:grid-cols-2">{data.nextActions.map((item) => <NextActionCard action={item} key={item.id} />)}</div>}</Section>;
}

function InteractionsSection({ data }: { data: Customer360 }) {
  return <Section title="Interações">{data.interactions.length === 0 ? <SectionEmpty title="Sem Interactions" description="Nenhuma interação foi registrada para este cliente." /> : <div className="space-y-3">{data.interactions.map((item) => <Card key={item.id}><CardContent className="p-4"><div className="flex flex-wrap items-center justify-between gap-2"><div className="flex gap-2"><Badge>{item.channel}</Badge><Badge>{item.outcome}</Badge></div><time className="text-xs text-slate-500" dateTime={item.createdAt}>{formatCustomer360DateTime(item.createdAt)}</time></div><p className="mt-3 whitespace-pre-wrap text-sm text-slate-700">{item.notes || "Sem observação."}</p></CardContent></Card>)}</div>}</Section>;
}

function CustomerTimelineSection({ data }: { data: Customer360 }) {
  return <Section title="Timeline">{data.timeline.length === 0 ? <TimelineEmpty /> : <ol className="space-y-3">{data.timeline.map((item) => <TimelineItem event={presentTimelineEvent(item)} key={item.id} />)}</ol>}</Section>;
}

function SectionEmpty({ description, title }: { description: string; title: string }) { return <EmptyState description={description} icon={Inbox} title={title} />; }
function Customer360Loading() { return <LoadingState className="space-y-4" label="Carregando Customer 360"><Skeleton className="h-44" /><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">{Array.from({ length: 5 }, (_, index) => <Skeleton className="h-32" key={index} />)}</div><Skeleton className="h-72" /></LoadingState>; }
function CustomerPageState({ description, title }: { description: string; title: string }) { return <div className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col px-4 py-6 sm:px-6 sm:py-8 lg:px-8"><EmptyState description={description} title={title} /></div>; }
