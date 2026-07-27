"use client";

import { AlertTriangle, LoaderCircle } from "lucide-react";

import { Drawer } from "@/components/ui";
import { useReceivableDetails } from "@/hooks/useReceivableDetails";
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

function formatDate(value: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : dateFormatter.format(date);
}

function DetailItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs font-medium uppercase tracking-wider text-slate-500">{label}</dt>
      <dd className="mt-1 break-words text-sm font-medium text-slate-900">{value}</dd>
    </div>
  );
}

function DetailSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-b border-slate-200 py-5 last:border-0">
      <h3 className="text-sm font-semibold text-slate-950">{title}</h3>
      <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-5">{children}</dl>
    </section>
  );
}

function ReceivableDetails({ receivable }: { receivable: Receivable }) {
  const customerName = receivable.customer.tradeName ?? receivable.customer.name;

  return (
    <div>
      <DetailSection title="Resumo">
        <DetailItem label="Documento" value={receivable.document ?? "—"} />
        <DetailItem label="Tipo de cobrança" value={receivable.collectionType.description ?? "—"} />
        <DetailItem label="Saldo" value={currencyFormatter.format(receivable.balance)} />
        <DetailItem label="Status" value={statusLabels[receivable.status]} />
      </DetailSection>

      <DetailSection title="Cliente e empresa">
        <DetailItem label="Cliente" value={customerName} />
        <DetailItem label="Documento do cliente" value={receivable.customer.document ?? "—"} />
        <DetailItem label="Empresa" value={receivable.company.name} />
        <DetailItem label="Código da empresa" value={receivable.company.id} />
      </DetailSection>

      <DetailSection title="Valores">
        <DetailItem label="Valor" value={currencyFormatter.format(receivable.amount)} />
        <DetailItem label="Juros" value={currencyFormatter.format(receivable.interest)} />
        <DetailItem label="Multa" value={currencyFormatter.format(receivable.penalty)} />
        <DetailItem label="Desconto" value={currencyFormatter.format(receivable.discount)} />
        <DetailItem label="Saldo" value={currencyFormatter.format(receivable.balance)} />
      </DetailSection>

      <DetailSection title="Datas">
        <DetailItem label="Emissão" value={formatDate(receivable.issueDate)} />
        <DetailItem label="Vencimento" value={formatDate(receivable.dueDate)} />
        <DetailItem label="Pagamento" value={formatDate(receivable.paymentDate)} />
      </DetailSection>

      <DetailSection title="Situação">
        <DetailItem label="Status" value={statusLabels[receivable.status]} />
        <DetailItem label="Dias de atraso" value={Math.trunc(receivable.daysOverdue)} />
      </DetailSection>
    </div>
  );
}

interface ReceivableDetailsDrawerProps {
  receivableId: number | null;
  onClose: () => void;
}

export function ReceivableDetailsDrawer({
  receivableId,
  onClose,
}: ReceivableDetailsDrawerProps) {
  const { data, isLoading, isError, refetch } = useReceivableDetails(receivableId);

  return (
    <Drawer
      closeLabel="Fechar drawer de detalhes"
      eyebrow="Recebível"
      onClose={onClose}
      open={receivableId !== null}
      title="Detalhes do título"
    >
          {isLoading ? (
            <div className="flex min-h-64 items-center justify-center gap-3 text-sm text-slate-600" role="status">
              <LoaderCircle aria-hidden="true" className="size-5 animate-spin text-blue-700" />
              Carregando detalhes...
            </div>
          ) : null}
          {isError ? (
            <div className="flex min-h-64 flex-col items-center justify-center px-4 text-center">
              <AlertTriangle aria-hidden="true" className="size-7 text-amber-600" />
              <h3 className="mt-3 font-semibold text-slate-950">Não foi possível carregar os detalhes</h3>
              <p className="mt-2 text-sm text-slate-600">Tente novamente em alguns instantes.</p>
              <button className="mt-5 rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700" onClick={() => void refetch()} type="button">
                Tentar novamente
              </button>
            </div>
          ) : null}
          {data ? <ReceivableDetails receivable={data} /> : null}
    </Drawer>
  );
}
