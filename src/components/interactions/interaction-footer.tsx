import { Button } from "@/components/ui";

interface InteractionFooterProps {
  onCancel: () => void;
}

export function InteractionFooter({ onCancel }: InteractionFooterProps) {
  return (
    <footer className="flex shrink-0 flex-col-reverse gap-2 border-t border-slate-200 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
      <Button onClick={onCancel} variant="secondary">Cancelar</Button>
      <Button disabled>Continuar</Button>
    </footer>
  );
}
