"use client";

import { AlertTriangle, Banknote, BriefcaseBusiness, CircleDollarSign, FileWarning, Inbox, RefreshCw, ShieldAlert, Users } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { DashboardContainer } from "@/components/layout/DashboardContainer";
import { Badge, Button, Card, CardContent, Select, StatCard, Table, TableBody, TableCell, TableContainer, TableHead, TableHeader, TableRow } from "@/components/ui";
import { useAuth } from "@/hooks/useAuth";
import { useCollectionPortfolioDashboard } from "@/hooks/useCollectionPortfolioDashboard";
import { useCompanies } from "@/hooks/useCompanies";
import type { CollectionPortfolioDashboard as DashboardData } from "@/types/collection-portfolio-dashboard";

import { getCollectionPortfolioErrorMessage } from "./collection-portfolio-dashboard.error";
import { collectionPortfolioCurrency as currency, collectionPortfolioNumber as number, collectionPortfolioPercentage as percentage, coveragePercentage, isCollectionPortfolioEmpty } from "./collection-portfolio-dashboard.presenter";

export function CollectionPortfolioDashboard() {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  if (!isAdmin) return <DashboardState icon={ShieldAlert} title="Acesso restrito"><p className="text-sm text-slate-600">Este painel está disponível apenas para administradores.</p></DashboardState>;
  return <CollectionPortfolioAdminDashboard />;
}

function CollectionPortfolioAdminDashboard() {
  const [companyId, setCompanyId] = useState("");
  const filters = companyId ? { companyId } : {};
  const companiesQuery = useCompanies({ active: true });
  const query = useCollectionPortfolioDashboard(filters);

  return <DashboardContainer>
    <header>
      <p className="text-sm font-semibold text-blue-700">Gestão</p>
      <h1 className="text-2xl font-bold text-slate-950">Carteira de Cobrança</h1>
      <p className="mt-1 text-sm text-slate-600">Visão financeira, cobertura operacional, aging e exposição por cliente.</p>
    </header>

    <section aria-label="Filtros da carteira" className="rounded-xl border border-slate-200 bg-white p-4">
      <label className="block max-w-md text-sm font-medium text-slate-700">Empresa
        <Select className="mt-1.5" disabled={companiesQuery.isLoading} onChange={(event) => setCompanyId(event.target.value)} value={companyId}>
          <option value="">{companiesQuery.isLoading ? "Carregando empresas..." : "Todas as empresas"}</option>
          {companiesQuery.data?.data.map((company) => <option key={company.id} value={company.id}>{company.name}{company.code ? ` (${company.code})` : ""}</option>)}
        </Select>
      </label>
      {companiesQuery.isError ? <div className="mt-3 flex flex-col items-start justify-between gap-3 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900 sm:flex-row sm:items-center" role="alert"><span>Não foi possível carregar o catálogo de empresas. A consulta de todas as empresas continua disponível.</span><Button onClick={() => void companiesQuery.refetch()} variant="secondary"><RefreshCw aria-hidden className="size-4" />Tentar novamente</Button></div> : null}
    </section>

    {query.isLoading ? <CollectionPortfolioLoading /> : null}
    {query.isError ? <DashboardState icon={AlertTriangle} title="Não foi possível carregar a carteira"><p className="text-sm text-slate-600">{getCollectionPortfolioErrorMessage(query.error)}</p><Button onClick={() => void query.refetch()}><RefreshCw aria-hidden className="size-4" />Tentar novamente</Button></DashboardState> : null}
    {query.data && isCollectionPortfolioEmpty(query.data) ? <DashboardState icon={Inbox} title="Carteira vazia"><p className="text-sm text-slate-600">Nenhum recebível em aberto para os filtros selecionados.</p></DashboardState> : null}
    {query.data && !isCollectionPortfolioEmpty(query.data) ? <CollectionPortfolioContent data={query.data} /> : null}
  </DashboardContainer>;
}

export function CollectionPortfolioContent({ data }: { data: DashboardData }) {
  const valueCoverage = coveragePercentage(data.summary.amountWithActiveOperation, data.summary.totalOverdue);
  const titleCoverage = coveragePercentage(data.summary.overdueWithActiveOperation, data.summary.overdueReceivables);
  const financialCards = [
    ["Total em aberto", currency.format(data.summary.totalOpen), CircleDollarSign],
    ["Total vencido", currency.format(data.summary.totalOverdue), FileWarning],
    ["Clientes com dívida", number.format(data.summary.customersWithOpenDebt), Users],
    ["Clientes com dívida vencida", number.format(data.summary.customersWithOverdueDebt), Users],
    ["Títulos em aberto", number.format(data.summary.openReceivables), BriefcaseBusiness],
    ["Títulos vencidos", number.format(data.summary.overdueReceivables), FileWarning],
  ] as const;

  return <div className="space-y-8">
    <section aria-labelledby="financial-summary-title"><h2 className="mb-3 text-lg font-semibold text-slate-950" id="financial-summary-title">Resumo financeiro</h2><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{financialCards.map(([label, value, Icon]) => <StatCard icon={Icon} key={label} label={label} value={value} />)}</div></section>

    <section aria-labelledby="coverage-title"><h2 className="mb-1 text-lg font-semibold text-slate-950" id="coverage-title">Cobertura operacional</h2><p className="mb-3 text-sm text-slate-600">Cobertura dos títulos vencidos por Operations ativas.</p><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <StatCard label="Títulos vencidos com Operation ativa" value={number.format(data.summary.overdueWithActiveOperation)} />
      <StatCard label="Títulos vencidos sem Operation ativa" value={number.format(data.summary.overdueWithoutActiveOperation)} />
      <StatCard icon={Banknote} label="Valor vencido com cobertura" value={currency.format(data.summary.amountWithActiveOperation)} />
      <StatCard icon={Banknote} label="Valor vencido sem cobertura" value={currency.format(data.summary.amountWithoutActiveOperation)} />
      <CoverageCard description="Valor coberto ÷ total vencido" label="Cobertura por valor" value={valueCoverage} />
      <CoverageCard description="Títulos cobertos ÷ títulos vencidos" label="Cobertura por títulos" value={titleCoverage} />
    </div></section>

    <section aria-labelledby="aging-title"><h2 className="mb-3 text-lg font-semibold text-slate-950" id="aging-title">Aging</h2>{data.aging.length === 0 ? <InlineEmpty message="Nenhuma faixa de aging retornada para os filtros selecionados." /> : <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{data.aging.map((item) => <Card key={item.range}><CardContent><h3 className="font-semibold text-slate-950">{item.label}</h3><p className="mt-3 text-xl font-bold text-slate-950">{currency.format(item.balance)}</p><dl className="mt-3 space-y-1 text-sm"><div className="flex justify-between gap-4"><dt className="text-slate-600">Títulos</dt><dd className="font-medium">{number.format(item.receivables)}</dd></div><div className="flex justify-between gap-4"><dt className="text-slate-600">Clientes</dt><dd className="font-medium">{number.format(item.customers)}</dd></div></dl></CardContent></Card>)}</div>}</section>

    <section aria-labelledby="customers-ranking-title"><h2 className="mb-3 text-lg font-semibold text-slate-950" id="customers-ranking-title">Clientes com maior exposição</h2>{data.customers.length === 0 ? <InlineEmpty message="Nenhum cliente retornado no ranking para os filtros selecionados." /> : <Card className="overflow-hidden"><TableContainer><Table className="min-w-[1100px] table-fixed"><TableHeader><TableRow><TableHead className="w-56">Cliente</TableHead><TableHead>Total em aberto</TableHead><TableHead>Total vencido</TableHead><TableHead>Quantidade de títulos</TableHead><TableHead>Títulos vencidos</TableHead><TableHead>Maior atraso</TableHead><TableHead>Operations ativas</TableHead><TableHead className="w-52">Oportunidade</TableHead></TableRow></TableHeader><TableBody>{data.customers.map((customer) => <TableRow key={customer.customerId}><TableCell><Link className="block truncate font-semibold text-blue-700 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2" href={`/customers/${customer.customerId}`} prefetch={false} title={customer.customerName}>{customer.customerName}</Link></TableCell><TableCell>{currency.format(customer.totalOpen)}</TableCell><TableCell>{currency.format(customer.totalOverdue)}</TableCell><TableCell>{number.format(customer.receivablesCount)}</TableCell><TableCell>{number.format(customer.overdueCount)}</TableCell><TableCell>{number.format(customer.maxDaysOverdue)} dias</TableCell><TableCell>{number.format(customer.activeOperations)}</TableCell><TableCell>{customer.hasCollectionOpportunity ? <Badge variant="success">Oportunidade disponível</Badge> : <span className="text-sm text-slate-500">Não disponível</span>}</TableCell></TableRow>)}</TableBody></Table></TableContainer></Card>}</section>
  </div>;
}

function CoverageCard({ description, label, value }: { description: string; label: string; value: number }) { return <Card><CardContent><p className="text-sm text-slate-600">{label}</p><p className="mt-2 text-3xl font-bold text-slate-950">{percentage.format(value)}%</p><p className="mt-2 text-xs text-slate-500">{description}</p></CardContent></Card>; }
function InlineEmpty({ message }: { message: string }) { return <div className="rounded-xl border border-dashed bg-white p-6 text-center text-sm text-slate-600">{message}</div>; }
function CollectionPortfolioLoading() { return <div aria-label="Carregando carteira de cobrança" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3" role="status">{Array.from({ length: 6 }, (_, index) => <div className="h-32 animate-pulse rounded-xl border bg-white" key={index} />)}</div>; }
function DashboardState({ children, icon: Icon, title }: { children: React.ReactNode; icon: typeof Inbox; title: string }) { return <div className="flex min-h-72 flex-col items-center justify-center gap-4 rounded-xl border border-dashed bg-white p-8 text-center"><Icon aria-hidden className="size-7 text-slate-500" /><h2 className="text-lg font-semibold text-slate-950">{title}</h2>{children}</div>; }
