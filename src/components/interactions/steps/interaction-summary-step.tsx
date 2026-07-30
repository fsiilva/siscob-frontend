import type { InteractionFlow } from "../interaction-drawer";
import { interactionContactOutcomes } from "./interaction-contact-outcome-step";
import { conversationOutcomes } from "./interaction-conversation-outcome-step";
import { interactionContactTypes } from "./interaction-contact-type-step";
import { interactionNextActions } from "./interaction-next-action-step";

interface InteractionSummaryStepProps {
  interaction: InteractionFlow;
}

export function InteractionSummaryStep({ interaction }: InteractionSummaryStepProps) {
  const contactType = interactionContactTypes.find((item) => item.value === interaction.contactType);
  const attemptOutcome = contactType && interaction.contactAttemptOutcome
    ? interactionContactOutcomes[contactType.value].find((item) => item.value === interaction.contactAttemptOutcome)
    : null;
  const conversationOutcome = conversationOutcomes.find((item) => item.value === interaction.conversationOutcome);
  const nextAction = interactionNextActions.find((item) => item.value === interaction.nextAction);

  const rows = [
    ["Tipo de contato", contactType?.label],
    ["Resultado da tentativa", attemptOutcome?.label],
    ["Resultado da conversa", conversationOutcome?.label],
    ["Próxima ação", nextAction?.label],
    ["Agendamento", formatSchedule(interaction.scheduledAt)],
    ["Observação", interaction.notes || "Sem observação"],
  ];

  return (
    <section aria-labelledby="interaction-summary-title">
      <h4 className="text-base font-semibold text-slate-950" id="interaction-summary-title">Resumo do atendimento</h4>
      <p className="mt-1 text-sm text-slate-600">Confira as informações antes de salvar.</p>
      <dl className="mt-5 divide-y divide-slate-200 rounded-xl border border-slate-200">
        {rows.map(([label, value]) => (
          <div className="px-4 py-3" key={label}>
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</dt>
            <dd className="mt-1 whitespace-pre-wrap break-words text-sm text-slate-900">{value ?? "—"}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function formatSchedule(scheduledAt: string | null) {
  if (!scheduledAt) return "Não necessário";
  const [date, time] = scheduledAt.split("T");
  if (!date || !time) return "—";
  return `${date.split("-").reverse().join("/")} às ${time}`;
}
