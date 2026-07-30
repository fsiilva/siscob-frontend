import type { InteractionContactType } from "./interaction-contact-type-step";

export const interactionContactOutcomes = {
  phone: [
    { value: "answered", label: "Atendeu" },
    { value: "no_answer", label: "Não atendeu" },
    { value: "busy", label: "Ocupado" },
    { value: "voicemail", label: "Caixa postal" },
    { value: "invalid_number", label: "Número inválido" },
  ],
  whatsapp: [
    { value: "replied", label: "Respondeu" },
    { value: "no_reply", label: "Não respondeu" },
    { value: "invalid_number", label: "Número inválido" },
  ],
  email: [
    { value: "replied", label: "Respondido" },
    { value: "no_reply", label: "Sem resposta" },
    { value: "invalid_email", label: "E-mail inválido" },
  ],
  in_person: [
    { value: "customer_found", label: "Cliente localizado" },
    { value: "customer_absent", label: "Cliente ausente" },
  ],
} as const satisfies Record<InteractionContactType, readonly { value: string; label: string }[]>;

export type InteractionContactOutcome =
  (typeof interactionContactOutcomes)[InteractionContactType][number]["value"];

interface InteractionContactOutcomeStepProps {
  contactType: InteractionContactType;
  value: InteractionContactOutcome | null;
  onChange: (contactOutcome: InteractionContactOutcome) => void;
}

export function InteractionContactOutcomeStep({
  contactType,
  value,
  onChange,
}: InteractionContactOutcomeStepProps) {
  return (
    <fieldset>
      <legend className="text-base font-semibold text-slate-950">Como terminou a tentativa de contato?</legend>
      <p className="mt-1 text-sm text-slate-600">Selecione o resultado para continuar.</p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {interactionContactOutcomes[contactType].map((outcome) => (
          <label key={outcome.value}>
            <input
              checked={value === outcome.value}
              className="peer sr-only"
              name="interaction-contact-outcome"
              onChange={() => onChange(outcome.value)}
              type="radio"
              value={outcome.value}
            />
            <span className="flex min-h-14 cursor-pointer items-center rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-blue-400 hover:bg-blue-50 peer-checked:border-blue-700 peer-checked:bg-blue-50 peer-checked:text-blue-800 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-blue-700">
              {outcome.label}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
