import { Eye } from "lucide-react";
import Link from "next/link";

import {
  Badge,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  type BadgeVariant,
} from "@/components/ui";
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

const statusVariants: Record<ReceivableStatus, BadgeVariant> = {
  OPEN: "open",
  PAID: "paid",
  CANCELED: "canceled",
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
      <TableContainer>
        <Table className="min-w-[960px]">
          <TableHeader>
            <tr>
              <TableHead>Cliente</TableHead>
              <TableHead>Empresa</TableHead>
              <TableHead>Documento</TableHead>
              <TableHead>Vencimento</TableHead>
              <TableHead className="text-right">Dias atraso</TableHead>
              <TableHead className="text-right">Saldo</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center">Ações</TableHead>
            </tr>
          </TableHeader>
          <TableBody>
            {data.map((receivable) => (
              <TableRow key={receivable.id}>
                <TableCell>
                  <Link className="block max-w-64 truncate font-semibold text-blue-700 hover:underline" href={`/customers/${receivable.customer.id}`} title={receivable.customer.tradeName ?? receivable.customer.name}>
                    {receivable.customer.tradeName ?? receivable.customer.name}
                  </Link>
                  {receivable.customer.document ? (
                    <p className="mt-0.5 text-xs text-slate-500">{receivable.customer.document}</p>
                  ) : null}
                </TableCell>
                <TableCell className="text-slate-700">{receivable.company.name}</TableCell>
                <TableCell className="font-medium text-slate-800">{receivable.document ?? "—"}</TableCell>
                <TableCell className="whitespace-nowrap text-slate-700">{formatDate(receivable.dueDate)}</TableCell>
                <TableCell className={`text-right font-semibold ${receivable.daysOverdue > 0 ? "text-red-700" : "text-slate-700"}`}>
                  {Math.trunc(receivable.daysOverdue)}
                </TableCell>
                <TableCell className="whitespace-nowrap text-right font-semibold text-slate-900">
                  {currencyFormatter.format(receivable.balance)}
                </TableCell>
                <TableCell>
                  <Badge variant={statusVariants[receivable.status]}>
                    {statusLabels[receivable.status]}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
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
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
