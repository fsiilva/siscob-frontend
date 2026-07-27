import {
  Banknote,
  CalendarClock,
  CircleDollarSign,
  ReceiptText,
  TriangleAlert,
  WalletCards,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import type { PortfolioKpis } from "@/types/executive";

interface KpiCardsProps {
  kpis: PortfolioKpis;
}

interface KpiCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  emphasis?: "default" | "warning";
}

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const numberFormatter = new Intl.NumberFormat("pt-BR");

function KpiCard({
  label,
  value,
  icon: Icon,
  emphasis = "default",
}: KpiCardProps) {
  const warning = emphasis === "warning";

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-3 text-2xl font-bold tracking-tight text-slate-950">
            {value}
          </p>
        </div>
        <span
          className={`rounded-xl p-2.5 ${warning ? "bg-amber-50 text-amber-700" : "bg-blue-50 text-blue-700"}`}
        >
          <Icon aria-hidden="true" className="size-5" />
        </span>
      </div>
    </article>
  );
}

export function KpiCards({ kpis }: KpiCardsProps) {
  const cards: KpiCardProps[] = [
    {
      label: "Títulos na carteira",
      value: numberFormatter.format(kpis.totalReceivables),
      icon: ReceiptText,
    },
    {
      label: "Valor total",
      value: currencyFormatter.format(kpis.totalAmount),
      icon: CircleDollarSign,
    },
    {
      label: "Títulos vencidos",
      value: numberFormatter.format(kpis.overdueReceivables),
      icon: TriangleAlert,
      emphasis: "warning",
    },
    {
      label: "Valor vencido",
      value: currencyFormatter.format(kpis.overdueAmount),
      icon: Banknote,
      emphasis: "warning",
    },
    {
      label: "Ticket médio",
      value: currencyFormatter.format(kpis.averageTicket),
      icon: WalletCards,
    },
    {
      label: "Atraso médio",
      value: `${numberFormatter.format(kpis.averageDelayDays)} dias`,
      icon: CalendarClock,
    },
  ];

  return (
    <section aria-labelledby="portfolio-kpis-title">
      <h2
        id="portfolio-kpis-title"
        className="mb-4 text-lg font-semibold text-slate-950"
      >
        Indicadores da carteira
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <KpiCard key={card.label} {...card} />
        ))}
      </div>
    </section>
  );
}
