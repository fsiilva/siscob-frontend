import { AlertTriangle, Inbox } from "lucide-react";

export function ReceivablesLoading() {
  return (
    <div aria-label="Carregando recebíveis" className="space-y-3" role="status">
      <span className="sr-only">Carregando recebíveis...</span>
      <div className="h-14 animate-pulse rounded-xl bg-white" />
      {Array.from({ length: 6 }, (_, index) => (
        <div className="h-16 animate-pulse rounded-xl bg-white" key={index} />
      ))}
    </div>
  );
}

export function ReceivablesMessage({
  type,
  onRetry,
}: {
  type: "error" | "empty";
  onRetry?: () => void;
}) {
  const isError = type === "error";
  const Icon = isError ? AlertTriangle : Inbox;

  return (
    <div className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white px-6 text-center">
      <span className="rounded-full bg-slate-100 p-3 text-slate-600">
        <Icon aria-hidden="true" className="size-6" />
      </span>
      <h3 className="mt-4 text-lg font-semibold text-slate-950">
        {isError ? "Não foi possível carregar a carteira" : "Nenhum recebível encontrado"}
      </h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">
        {isError
          ? "Verifique sua conexão e tente novamente."
          : "Altere os filtros para realizar uma nova consulta."}
      </p>
      {isError && onRetry ? (
        <button className="mt-5 rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700" onClick={onRetry} type="button">
          Tentar novamente
        </button>
      ) : null}
    </div>
  );
}
