import { Eye } from "lucide-react";

import type { Receivable, ReceivableStatus } from "@/types/receivables";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const dateFormatter = new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" });

const statusLabels: Record<ReceivableStatus, string> = {
  OPEN: "Em aberto",
  PAID: "Pago",
  CANCELED: "Cancelado",
};

const statusClasses: Record<ReceivableStatus, string> = {
  OPEN: "bg-amber-50 text-amber-800 ring-amber-200",
  PAID: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  CANCELED: "bg-slate-100 text-slate-700 ring-slate-200",
};

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : dateFormatter.format(date);
}

interface ReceivablesTableProps {
  data: Receivable[];
  onViewDetails: (id: number, trigger: HTMLButtonElement) => void;
}

export function ReceivablesTable({
  data,
  onViewDetails,
}: ReceivablesTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="max-w-full overflow-x-auto">
        <table className="w-full min-w-[960px] border-collapse text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-600">
            <tr>
              <th className="px-5 py-4 font-semibold" scope="col">Cliente</th>
              <th className="px-5 py-4 font-semibold" scope="col">Empresa</th>
              <th className="px-5 py-4 font-semibold" scope="col">Documento</th>
              <th className="px-5 py-4 font-semibold" scope="col">Vencimento</th>
              <th className="px-5 py-4 text-right font-semibold" scope="col">Dias atraso</th>
              <th className="px-5 py-4 text-right font-semibold" scope="col">Saldo</th>
              <th className="px-5 py-4 font-semibold" scope="col">Status</th>
              <th className="px-5 py-4 text-center font-semibold" scope="col">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((receivable) => (
              <tr className="transition hover:bg-slate-50/80" key={receivable.id}>
                <td className="px-5 py-4">
                  <p className="max-w-64 truncate font-semibold text-slate-900" title={receivable.customer.tradeName ?? receivable.customer.name}>
                    {receivable.customer.tradeName ?? receivable.customer.name}
                  </p>
                  {receivable.customer.document ? (
                    <p className="mt-0.5 text-xs text-slate-500">{receivable.customer.document}</p>
                  ) : null}
                </td>
                <td className="px-5 py-4 text-slate-700">{receivable.company.name}</td>
                <td className="px-5 py-4 font-medium text-slate-800">{receivable.document ?? "—"}</td>
                <td className="whitespace-nowrap px-5 py-4 text-slate-700">{formatDate(receivable.dueDate)}</td>
                <td className={`px-5 py-4 text-right font-semibold ${receivable.daysOverdue > 0 ? "text-red-700" : "text-slate-700"}`}>
                  {Math.trunc(receivable.daysOverdue)}
                </td>
                <td className="whitespace-nowrap px-5 py-4 text-right font-semibold text-slate-900">
                  {currencyFormatter.format(receivable.balance)}
                </td>
                <td className="px-5 py-4">
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${statusClasses[receivable.status]}`}>
                    {statusLabels[receivable.status]}
                  </span>
                </td>
                <td className="px-5 py-4 text-center">
                  <button
                    aria-label={`Ver detalhes do título ${receivable.document ?? receivable.id}`}
                    className="rounded-lg p-2 text-blue-700 transition hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                    onClick={(event) =>
                      onViewDetails(receivable.id, event.currentTarget)
                    }
                    title="Ver detalhes"
                    type="button"
                  >
                    <Eye aria-hidden="true" className="size-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
