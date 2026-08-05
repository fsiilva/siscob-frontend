interface InteractionHeaderProps {
  customerName: string;
  context?: {
    company: string;
    portfolio: string;
    receivable?: string;
    objective: string;
  };
}

export function InteractionHeader({ customerName, context }: InteractionHeaderProps) {
  return (
    <header className="shrink-0 border-b border-slate-200 px-5 py-4 sm:px-6">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Cliente</p>
      <h3 className="mt-1 break-words text-base font-semibold text-slate-950">{customerName}</h3>
      {context ? (
        <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
          <ContextItem label="Empresa" value={context.company} />
          <ContextItem label="Carteira" value={context.portfolio} />
          {context.receivable ? <ContextItem label="Recebível" value={context.receivable} /> : null}
          <ContextItem label="Objetivo" value={context.objective} />
        </dl>
      ) : null}
    </header>
  );
}

function ContextItem({ label, value }: { label: string; value: string }) {
  return <div><dt className="text-xs text-slate-500">{label}</dt><dd className="font-medium text-slate-800">{value}</dd></div>;
}
