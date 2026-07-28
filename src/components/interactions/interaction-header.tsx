interface InteractionHeaderProps {
  customerName: string;
}

export function InteractionHeader({ customerName }: InteractionHeaderProps) {
  return (
    <header className="shrink-0 border-b border-slate-200 px-5 py-4 sm:px-6">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Cliente</p>
      <h3 className="mt-1 break-words text-base font-semibold text-slate-950">{customerName}</h3>
    </header>
  );
}
