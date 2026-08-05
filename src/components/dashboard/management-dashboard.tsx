"use client";

import { AlertTriangle, BriefcaseBusiness, Building2, Inbox, ListChecks, RefreshCw, ShieldAlert } from "lucide-react";

import { DashboardContainer } from "@/components/layout/DashboardContainer";
import {
  Button,
  Card,
  CardContent,
  StatCard,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui";
import { useManagementDashboard } from "@/hooks/useManagementDashboard";
import { useAuth } from "@/hooks/useAuth";
import type { ManagementCount, ManagementDashboard as ManagementDashboardData, ManagementEntityCount } from "@/types/management-dashboard";

import { isManagementDashboardEmpty, managementLabel } from "./management-dashboard.presenter";

const number = new Intl.NumberFormat("pt-BR");

export function ManagementDashboard() {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";
  const query = useManagementDashboard(isAdmin);

  if (!isAdmin) {
    return <DashboardState icon={ShieldAlert} title="Acesso restrito"><p className="text-sm text-slate-600">O Dashboard Gerencial está disponível apenas para administradores.</p></DashboardState>;
  }
  if (query.isLoading) return <ManagementDashboardLoading />;
  if (query.isError) return <DashboardState icon={AlertTriangle} title="Não foi possível carregar o Dashboard Gerencial"><Button onClick={() => void query.refetch()}><RefreshCw aria-hidden className="size-4" />Tentar novamente</Button></DashboardState>;
  if (!query.data || isManagementDashboardEmpty(query.data)) return <DashboardState icon={Inbox} title="Nenhum dado gerencial disponível"><p className="text-sm text-slate-600">Ainda não existem indicadores gerenciais para exibir.</p></DashboardState>;

  return <ManagementDashboardContent data={query.data} />;
}

export function ManagementDashboardContent({ data }: { data: ManagementDashboardData }) {
  return (
    <DashboardContainer>
      <header>
        <p className="text-sm font-semibold text-blue-700">Gestão</p>
        <h1 className="text-2xl font-bold text-slate-950">Dashboard Gerencial</h1>
        <p className="mt-1 text-sm text-slate-600">Visão consolidada de Operations, operadores, empresas e carteiras.</p>
      </header>

      <section aria-label="Resumo gerencial de Operations" className="grid gap-4 lg:grid-cols-3">
        <StatCard icon={ListChecks} label="Total de Operations" value={number.format(data.operations.total)} />
        <GroupedCard rows={data.operations.byStatus} title="Por Status" />
        <GroupedCard rows={data.operations.byPriority} title="Por Prioridade" />
      </section>

      <section aria-labelledby="operators-title">
        <h2 className="mb-3 text-lg font-semibold text-slate-950" id="operators-title">Operadores</h2>
        <Card className="overflow-hidden">
          <TableContainer>
            <Table>
              <TableHeader><TableRow><TableHead>Operador</TableHead><TableHead>Atribuídas</TableHead><TableHead>Em andamento</TableHead><TableHead>Concluídas hoje</TableHead><TableHead>Ações vencidas</TableHead></TableRow></TableHeader>
              <TableBody>{data.operators.map((operator) => <TableRow key={operator.id}><TableCell className="font-medium text-slate-950">{operator.name}</TableCell><TableCell>{number.format(operator.assigned)}</TableCell><TableCell>{number.format(operator.inProgress)}</TableCell><TableCell>{number.format(operator.completedToday)}</TableCell><TableCell>{number.format(operator.overdueNextActions)}</TableCell></TableRow>)}</TableBody>
            </Table>
          </TableContainer>
        </Card>
      </section>

      <EntityCards icon={Building2} items={data.companies} title="Empresas" />
      <EntityCards icon={BriefcaseBusiness} items={data.portfolios} title="Carteiras" />
    </DashboardContainer>
  );
}

function GroupedCard({ rows, title }: { rows: ManagementCount[]; title: string }) {
  return <Card><CardContent><h2 className="font-semibold text-slate-950">{title}</h2><dl className="mt-4 space-y-2">{rows.map((row) => <div className="flex justify-between gap-4 text-sm" key={row.value}><dt className="text-slate-600">{managementLabel(row.value)}</dt><dd className="font-semibold text-slate-950">{number.format(row.count)}</dd></div>)}</dl></CardContent></Card>;
}

function EntityCards({ icon: Icon, items, title }: { icon: typeof Building2; items: ManagementEntityCount[]; title: string }) {
  return <section aria-labelledby={`${title}-title`}><h2 className="mb-3 text-lg font-semibold text-slate-950" id={`${title}-title`}>{title}</h2><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{items.map((item) => <StatCard icon={Icon} key={item.id} label={item.name} value={`${number.format(item.operations)} Operations`} />)}</div></section>;
}

function ManagementDashboardLoading() {
  return <DashboardContainer><div aria-label="Carregando Dashboard Gerencial" className="grid gap-4 lg:grid-cols-3" role="status">{Array.from({ length: 7 }, (_, index) => <div className="h-32 animate-pulse rounded-xl border bg-white" key={index} />)}</div></DashboardContainer>;
}

function DashboardState({ children, icon: Icon, title }: { children: React.ReactNode; icon: typeof Inbox; title: string }) {
  return <DashboardContainer><div className="flex min-h-80 flex-col items-center justify-center gap-4 rounded-xl border border-dashed bg-white p-8 text-center"><Icon aria-hidden className="size-7 text-slate-500" /><h1 className="text-lg font-semibold text-slate-950">{title}</h1>{children}</div></DashboardContainer>;
}
