import { AlertCircle, CalendarDays, Clock3, ShieldAlert } from "lucide-react";

import { AgingChart } from "@/components/charts/AgingChart";
import type {
  CollectionSummary,
  ExecutiveAlerts,
  PortfolioAging,
} from "@/types/executive";

interface ExecutiveGridProps {
  aging: PortfolioAging;
  collection: CollectionSummary;
  alerts: ExecutiveAlerts;
}

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const numberFormatter = new Intl.NumberFormat("pt-BR");

export function ExecutiveGrid({
  aging,
  collection,
  alerts,
}: ExecutiveGridProps) {
  const collectionItems = [
    ["Recebido hoje", currencyFormatter.format(collection.receivedToday)],
    [
      "Recebido no mês",
      currencyFormatter.format(collection.receivedThisMonth),
    ],
    [
      "Recebíveis pendentes",
      currencyFormatter.format(collection.pendingReceivables),
    ],
    [
      "Recebíveis vencidos",
      currencyFormatter.format(collection.overdueReceivables),
    ],
  ];

  const alertItems = [
    {
      label: "Clientes com atraso crítico",
      value: alerts.criticalOverdueCustomers,
      icon: AlertCircle,
    },
    {
      label: "Contratos vencendo em 30 dias",
      value: alerts.contractsExpiringNext30Days,
      icon: CalendarDays,
    },
    {
      label: "Recebíveis de alto risco",
      value: alerts.highRiskReceivables,
      icon: ShieldAlert,
    },
  ];

  return (
    <div className="grid gap-6 xl:grid-cols-5">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-3">
        <div className="mb-5 flex items-center gap-3">
          <span className="rounded-xl bg-blue-50 p-2.5 text-blue-700">
            <Clock3 aria-hidden="true" className="size-5" />
          </span>
          <div>
            <h2 className="font-semibold text-slate-950">Aging da carteira</h2>
            <p className="text-sm text-slate-500">Distribuição por faixa de atraso</p>
          </div>
        </div>

        <AgingChart portfolioAging={aging} />
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2">
        <h2 className="font-semibold text-slate-950">Resumo de recebimentos</h2>
        <div className="mt-4 divide-y divide-slate-100">
          {collectionItems.map(([label, value]) => (
            <div key={label} className="flex items-center justify-between gap-4 py-3">
              <span className="text-sm text-slate-600">{label}</span>
              <strong className="text-right text-sm text-slate-950">{value}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-amber-200 bg-amber-50/60 p-5 xl:col-span-5">
        <h2 className="font-semibold text-slate-950">Alertas executivos</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {alertItems.map(({ label, value, icon: Icon }) => (
            <article
              key={label}
              className="flex items-center gap-4 rounded-xl border border-amber-100 bg-white p-4"
            >
              <span className="rounded-lg bg-amber-100 p-2 text-amber-800">
                <Icon aria-hidden="true" className="size-5" />
              </span>
              <div>
                <p className="text-xl font-bold text-slate-950">
                  {numberFormatter.format(value)}
                </p>
                <p className="text-sm text-slate-600">{label}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
