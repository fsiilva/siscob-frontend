import type { InteractionFlow } from "@/components/interactions";
import type { CustomerNextAction, NextAction } from "@/types/next-action";

const actionDetails: Record<InteractionFlow["nextAction"], {
  type: NextAction["type"];
  title: string;
  priority: NextAction["priority"];
}> = {
  call_again: { type: "call", title: "Ligar novamente", priority: "high" },
  send_whatsapp: { type: "whatsapp", title: "Enviar WhatsApp", priority: "medium" },
  send_email: { type: "email", title: "Enviar e-mail", priority: "medium" },
  check_payment: { type: "verify_payment", title: "Conferir pagamento", priority: "high" },
  update_registration: { type: "update_registration", title: "Atualizar cadastro", priority: "medium" },
  send_invoice: { type: "send_invoice", title: "Enviar boleto", priority: "medium" },
  close_service: { type: "close", title: "Encerrar atendimento", priority: "low" },
};

interface CreateNextActionInput {
  interaction: InteractionFlow;
  customerId: number;
  customerName: string;
}

export function createNextAction({ interaction, customerId, customerName }: CreateNextActionInput): CustomerNextAction {
  const details = actionDetails[interaction.nextAction];
  const interactionId = crypto.randomUUID();

  return {
    id: crypto.randomUUID(),
    ...details,
    description: interaction.notes || `Gerada pelo atendimento ${interactionId}.`,
    dueAt: interaction.scheduledAt ? new Date(interaction.scheduledAt) : undefined,
    status: "pending",
    interactionId,
    customerId,
    customerName,
  };
}
