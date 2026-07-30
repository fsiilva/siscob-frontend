import type { InteractionFlow } from "./interaction-drawer";
import type { InteractionContactAttemptOutcome } from "./steps/interaction-contact-outcome-step";
import type { InteractionConversationOutcome } from "./steps/interaction-conversation-outcome-step";
import type { InteractionContactType } from "./steps/interaction-contact-type-step";
import type { CreateInteractionRequest, InteractionChannel, InteractionOutcome } from "@/types/interactions";

const channelMap: Record<InteractionContactType, InteractionChannel> = {
  phone: "phone",
  whatsapp: "whatsapp",
  email: "email",
  in_person: "visit",
};

const attemptOutcomeMap: Partial<Record<InteractionContactAttemptOutcome, InteractionOutcome>> = {
  no_answer: "no_answer",
  busy: "no_answer",
  voicemail: "no_answer",
  no_reply: "no_answer",
  customer_absent: "no_answer",
  invalid_number: "wrong_contact",
  invalid_email: "wrong_contact",
};

const conversationOutcomeMap: Record<InteractionConversationOutcome, InteractionOutcome> = {
  payment_promised: "promise_to_pay",
  payment_completed: "completed",
  callback_requested: "follow_up",
  negotiation_started: "contact_made",
  charge_disputed: "refused",
  talk_to_responsible: "follow_up",
  not_interested: "refused",
  other: "contact_made",
};

export function mapInteractionChannel(contactType: InteractionContactType) {
  return channelMap[contactType];
}

export function mapInteractionOutcome(
  contactAttemptOutcome: InteractionContactAttemptOutcome,
  conversationOutcome: InteractionConversationOutcome,
) {
  return attemptOutcomeMap[contactAttemptOutcome] ?? conversationOutcomeMap[conversationOutcome];
}

export function buildInteractionPayload(
  interaction: InteractionFlow,
  receivableId?: string,
): CreateInteractionRequest {
  return {
    channel: mapInteractionChannel(interaction.contactType),
    outcome: mapInteractionOutcome(interaction.contactAttemptOutcome, interaction.conversationOutcome),
    notes: interaction.notes.trim(),
    ...(receivableId ? { receivableId } : {}),
  };
}
