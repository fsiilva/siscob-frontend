import { Option } from "./interaction-contact-outcome-step";

export const interactionNextActions = [
  { value: "call_again", label: "Ligar novamente", requiresSchedule: true },
  { value: "send_whatsapp", label: "Enviar WhatsApp", requiresSchedule: true },
  { value: "send_email", label: "Enviar Email", requiresSchedule: true },
  { value: "check_payment", label: "Conferir pagamento", requiresSchedule: true },
  { value: "update_registration", label: "Atualizar cadastro", requiresSchedule: false },
  { value: "send_invoice", label: "Enviar boleto", requiresSchedule: false },
  { value: "close_service", label: "Encerrar atendimento", requiresSchedule: false },
] as const;

export type InteractionNextAction = (typeof interactionNextActions)[number]["value"];

export function nextActionRequiresSchedule(nextAction: InteractionNextAction) {
  return interactionNextActions.find((action) => action.value === nextAction)?.requiresSchedule ?? false;
}

interface InteractionNextActionStepProps {
  value: InteractionNextAction | null;
  onChange: (nextAction: InteractionNextAction) => void;
}

export function InteractionNextActionStep({ value, onChange }: InteractionNextActionStepProps) {
  return (
    <fieldset>
      <legend className="text-base font-semibold text-slate-950">Qual é a próxima ação?</legend>
      <p className="mt-1 text-sm text-slate-600">Defina o próximo passo deste atendimento.</p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {interactionNextActions.map((action) => (
          <Option
            checked={value === action.value}
            key={action.value}
            label={action.label}
            name="interaction-next-action"
            onChange={() => onChange(action.value)}
            value={action.value}
          />
        ))}
      </div>
    </fieldset>
  );
}
