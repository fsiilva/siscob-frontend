import { AlertCircle, CircleDollarSign, Files, LockOpen } from "lucide-react";

import type { Receivable } from "@/types/receivables";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function ReceivablesKpis({ data }: { data: Receivable[] }) {
  const total = data.reduce((sum, receivable) => sum + receivable.balance, 0);
  const open = data.filter(({ status }) => status === "OPEN").length;
  const overdue = data.filter(
    ({ daysOverdue, status }) => status === "OPEN" && daysOverdue > 0,
  ).length;
  const cards = [
    { label: "Títulos nesta página", value: data.length, icon: Files },
    {
      label: "Valor nesta página",
      value: currencyFormatter.format(total),
      icon: CircleDollarSign,
    },
    { label: "Em aberto", value: open, icon: LockOpen },
    { label: "Vencidos", value: overdue, icon: AlertCircle },
  ];

  return (
    <section aria-label="Indicadores da página atual" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map(({ label, value, icon: Icon }) => (
        <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm" key={label}>
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-medium text-slate-600">{label}</p>
            <Icon aria-hidden="true" className="size-5 text-blue-700" />
          </div>
          <p className="mt-3 text-2xl font-bold tracking-tight text-slate-950">{value}</p>
        </article>
      ))}
    </section>
  );
}
