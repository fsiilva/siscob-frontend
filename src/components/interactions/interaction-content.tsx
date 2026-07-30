import type { ReactNode } from "react";

interface InteractionContentProps {
  children: ReactNode;
}

export function InteractionContent({ children }: InteractionContentProps) {
  return (
    <div
      aria-label="Área reservada para as etapas do registro de cobrança"
      className="min-h-64 flex-1 px-5 py-6 sm:px-6"
    >
      {children}
    </div>
  );
}
