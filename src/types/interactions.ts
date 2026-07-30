export type InteractionChannel = "phone" | "whatsapp" | "email" | "visit" | "system";

export type InteractionOutcome =
  | "contact_made"
  | "no_answer"
  | "promise_to_pay"
  | "refused"
  | "wrong_contact"
  | "follow_up"
  | "completed";

export interface CreateInteractionRequest {
  channel: InteractionChannel;
  outcome: InteractionOutcome;
  notes: string;
  receivableId?: string;
}

export interface InteractionResponse {
  id: string;
  customerId: string;
  receivableId: string | null;
  userId: string;
  channel: InteractionChannel;
  outcome: InteractionOutcome;
  notes: string;
  createdAt: string;
  updatedAt: string;
}
