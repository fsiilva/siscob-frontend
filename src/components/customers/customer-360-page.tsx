"use client";

import {
  AlertTriangle,
  Building2,
  CalendarClock,
  CircleDollarSign,
  Clock3,
  ClockAlert,
  FileClock,
  Files,
  Mail,
  MapPin,
  Phone,
  Smartphone,
  UserRound,
} from "lucide-react";

import { Badge, Button, Card, CardContent, EmptyState, LoadingState, PageHeader, Section, Skeleton, StatCard } from "@/components/ui";
import { CustomerNextAction } from "@/components/next-actions";
import { TimelineList } from "@/components/timeline";
import { useCustomer } from "@/hooks/useCustomer";
import { useCustomerSummary } from "@/hooks/useCustomerSummary";
import { ApiRequestError } from "@/services/api";
import type { Customer, CustomerReceivablesSummary } from "@/types/customers";

const currencyFormatter = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const dateFormatter = new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" });

function formatDocument(customer: Customer) {
  return customer.cnpj ?? customer.cpf ?? "Documento não informado";
}

function formatLocation(customer: Customer) {
  if (customer.city && customer.state) return `${customer.city} / ${customer.state}`;
  return customer.city ?? customer.state ?? "Cidade / UF não informada";
}

function CustomerHeader({ customer }: { customer: Customer }) {
  const details = [
    { icon: Building2, label: "Nome fantasia", value: customer.tradeName ?? "Não informado" },
    { icon: UserRound, label: "CPF/CNPJ", value: formatDocument(customer) },
    { icon: MapPin, label: "Cidade / UF", value: formatLocation(customer) },
    { icon: Mail, label: "E-mail", value: customer.email ?? "Não informado" },
    { icon: Phone, label: "Telefone", value: customer.phone ?? "Não informado" },
    { icon: Smartphone, label: "Celular", value: customer.mobilePhone ?? "Não informado" },
  ];

  return (
    <Card>
      <CardContent>
        <div className="flex min-w-0 flex-col gap-3 border-b border-slate-200 pb-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">Cliente</p>
            <h2 className="mt-1 break-words text-xl font-bold tracking-tight text-slate-950 sm:text-2xl">{customer.name}</h2>
          </div>
          <Badge className="w-fit" variant={customer.active ? "success" : "canceled"}>
            {customer.active ? "Ativo" : "Inativo"}
          </Badge>
        </div>
        <dl className="mt-5 grid min-w-0 grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2 xl:grid-cols-3">
          {details.map(({ icon: Icon, label, value }) => (
            <div className="flex min-w-0 gap-3" key={label}>
              <Icon aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-blue-700" />
              <div className="min-w-0">
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</dt>
                <dd className="mt-1 break-words text-sm font-medium text-slate-950">{value}</dd>
              </div>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  );
}

function HeaderLoading() {
  return (
    <LoadingState label="Carregando dados do cliente">
      <Card><CardContent className="space-y-3">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-9 w-full max-w-md" />
        <Skeleton className="h-5 w-full max-w-2xl" />
      </CardContent></Card>
    </LoadingState>
  );
}

function KpisLoading() {
  return (
    <LoadingState className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3" label="Carregando indicadores do cliente">
      {Array.from({ length: 7 }, (_, index) => <Skeleton className="h-32" key={index} />)}
    </LoadingState>
  );
}

function CustomerKpis({ summary }: { summary: CustomerReceivablesSummary }) {
  const nextDueDate = summary.nextDueDate ? dateFormatter.format(new Date(summary.nextDueDate)) : "Sem vencimento";

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <StatCard icon={Files} label="Títulos em aberto" value={summary.openCount.toLocaleString("pt-BR")} />
      <StatCard icon={FileClock} label="Títulos vencidos" value={summary.overdueCount.toLocaleString("pt-BR")} />
      <StatCard icon={CircleDollarSign} label="Valor em aberto" value={currencyFormatter.format(summary.openAmount)} />
      <StatCard icon={ClockAlert} label="Valor vencido" value={currencyFormatter.format(summary.overdueAmount)} />
      <StatCard icon={Clock3} label="Média de atraso" value={`${summary.averageDelayDays.toLocaleString("pt-BR")} dias`} />
      <StatCard icon={ClockAlert} label="Maior atraso" value={`${summary.oldestDelayDays.toLocaleString("pt-BR")} dias`} />
      <StatCard icon={CalendarClock} label="Próximo vencimento" value={nextDueDate} />
    </div>
  );
}

const futureModules = ["Recebíveis", "Contratos", "CRM", "IA", "Observações"];

function FutureModules() {
  return (
    <Section className="space-y-4" title="Próximos módulos">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {futureModules.map((module) => (
          <Card className="border-dashed" key={module}>
            <CardContent className="flex min-h-28 items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold text-slate-950">{module}</h3>
                <p className="mt-1 text-sm text-slate-500">Em breve</p>
              </div>
              <Clock3 aria-hidden="true" className="size-5 shrink-0 text-slate-400" />
            </CardContent>
          </Card>
        ))}
      </div>
    </Section>
  );
}

function ErrorState({ title, onRetry }: { title: string; onRetry: () => void }) {
  return (
    <EmptyState
      action={<Button onClick={onRetry}>Tentar novamente</Button>}
      description="Verifique sua conexão e tente novamente."
      icon={AlertTriangle}
      title={title}
    />
  );
}

export function Customer360Page({ customerId }: { customerId: number }) {
  const customerQuery = useCustomer(customerId);
  const summaryQuery = useCustomerSummary(customerId);
  const invalidId = !Number.isInteger(customerId) || customerId <= 0;
  const notFound = customerQuery.error instanceof ApiRequestError && customerQuery.error.status === 404;

  if (invalidId || notFound) {
    return (
      <div className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <EmptyState description="O cliente solicitado não existe ou não está disponível para consulta." title="Cliente não encontrado" />
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-w-0 w-full max-w-[1600px] flex-1 flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <PageHeader
        description="Visão consolidada dos dados cadastrais e financeiros do cliente."
        eyebrow="Clientes"
        icon={UserRound}
        title="Customer 360"
      />

      {customerQuery.isLoading ? <HeaderLoading /> : null}
      {customerQuery.isError ? <ErrorState onRetry={() => void customerQuery.refetch()} title="Não foi possível carregar o cliente" /> : null}
      {customerQuery.data ? <CustomerHeader customer={customerQuery.data} /> : null}

      <Section className="space-y-4" title="Resumo financeiro">
        {summaryQuery.isLoading ? <KpisLoading /> : null}
        {summaryQuery.isError ? <ErrorState onRetry={() => void summaryQuery.refetch()} title="Não foi possível carregar os indicadores" /> : null}
        {summaryQuery.data ? <CustomerKpis summary={summaryQuery.data.receivables} /> : null}
      </Section>

      {customerQuery.data ? <CustomerNextAction customerId={customerId} /> : null}

      {customerQuery.data ? (
        <Section className="space-y-4" title="Timeline">
          <TimelineList customerId={customerId} />
        </Section>
      ) : null}

      {customerQuery.data ? <FutureModules /> : null}
    </div>
  );
}
