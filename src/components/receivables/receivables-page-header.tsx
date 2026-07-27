import { WalletCards } from "lucide-react";

export function ReceivablesPageHeader() {
  return (
    <div className="flex min-w-0 flex-col items-start gap-3 sm:flex-row sm:gap-4">
      <span className="rounded-xl bg-blue-100 p-3 text-blue-700">
        <WalletCards aria-hidden="true" className="size-6" />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">
          Operação
        </p>
        <h2 className="mt-1 break-words text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
          Carteira de Recebíveis
        </h2>
        <p className="mt-2 break-words text-sm leading-6 text-slate-600">
          Consulte e acompanhe os títulos da carteira do SisCob.
        </p>
      </div>
    </div>
  );
}
