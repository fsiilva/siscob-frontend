import { Button } from "@/components/ui";

interface InteractionFooterProps {
  onCancel: () => void;
  onContinue: () => void;
  onBack?: () => void;
  continueDisabled?: boolean;
  continueLoading?: boolean;
  primaryLabel?: string;
  showCancel?: boolean;
}

export function InteractionFooter({
  onCancel,
  onContinue,
  onBack,
  continueDisabled = false,
  continueLoading = false,
  primaryLabel = "Continuar",
  showCancel = true,
}: InteractionFooterProps) {
  return (
    <footer className="flex shrink-0 flex-col-reverse gap-2 border-t border-slate-200 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
      {showCancel ? <Button onClick={onCancel} variant="secondary">Cancelar</Button> : null}
      {onBack ? <Button disabled={continueLoading} onClick={onBack} variant="secondary">Voltar</Button> : null}
      <Button disabled={continueDisabled} loading={continueLoading} onClick={onContinue}>{primaryLabel}</Button>
    </footer>
  );
}
