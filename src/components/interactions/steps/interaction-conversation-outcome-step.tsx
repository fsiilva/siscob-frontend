import { Option, type InteractionContactAttemptOutcome } from "./interaction-contact-outcome-step";

export const conversationOutcomes = [
  { value: "payment_promised", label: "Prometeu pagamento" },
  { value: "payment_completed", label: "Pagamento realizado" },
  { value: "callback_requested", label: "Solicitou retorno" },
  { value: "negotiation_started", label: "Negociação iniciada" },
  { value: "charge_disputed", label: "Contestou cobrança" },
  { value: "talk_to_responsible", label: "Falar com responsável" },
  { value: "not_interested", label: "Sem interesse" },
  { value: "other", label: "Outro" },
] as const;

export type InteractionConversationOutcome = (typeof conversationOutcomes)[number]["value"];

const successfulAttemptOutcomes: readonly InteractionContactAttemptOutcome[] = [
  "answered",
  "replied",
  "customer_found",
];

const unsuccessfulConversationOutcomes: readonly InteractionConversationOutcome[] = [
  "callback_requested",
  "talk_to_responsible",
  "other",
];

interface InteractionConversationOutcomeStepProps {
  contactAttemptOutcome: InteractionContactAttemptOutcome;
  value: InteractionConversationOutcome | null;
  onChange: (outcome: InteractionConversationOutcome) => void;
}

export function getConversationOutcomes(contactAttemptOutcome: InteractionContactAttemptOutcome) {
  if (successfulAttemptOutcomes.includes(contactAttemptOutcome)) return conversationOutcomes;
  return conversationOutcomes.filter((outcome) => unsuccessfulConversationOutcomes.includes(outcome.value));
}

export function InteractionConversationOutcomeStep({
  contactAttemptOutcome,
  value,
  onChange,
}: InteractionConversationOutcomeStepProps) {
  const availableOutcomes = getConversationOutcomes(contactAttemptOutcome);

  return (
    <fieldset>
      <legend className="text-base font-semibold text-slate-950">Qual foi o resultado da conversa?</legend>
      <p className="mt-1 text-sm text-slate-600">Selecione a opção que melhor descreve o atendimento.</p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {availableOutcomes.map((outcome) => (
          <Option
            checked={value === outcome.value}
            key={outcome.value}
            label={outcome.label}
            name="interaction-conversation-outcome"
            onChange={() => onChange(outcome.value)}
            value={outcome.value}
          />
        ))}
      </div>
    </fieldset>
  );
}
