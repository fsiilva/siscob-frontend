import { CircleCheckBig } from "lucide-react";

interface DashboardHeaderProps {
  lastSync?: string | null;
}

const syncDateFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
});

function formatLastSync(lastSync?: string | null) {
  if (!lastSync) return "Sincronização indisponível";

  const date = new Date(lastSync);
  return Number.isNaN(date.getTime())
    ? "Sincronização indisponível"
    : `Atualizado em ${syncDateFormatter.format(date)}`;
}

export function DashboardHeader({ lastSync }: DashboardHeaderProps) {
  return (
    <header className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">
          Visão executiva
        </p>
        <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
          Dashboard executivo
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
          Acompanhamento consolidado da carteira e da operação de cobrança.
        </p>
      </div>

      <div className="flex items-center gap-2 self-start rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-800 sm:self-auto">
        <CircleCheckBig aria-hidden="true" className="size-4" />
        <span>{formatLastSync(lastSync)}</span>
      </div>
    </header>
  );
}
