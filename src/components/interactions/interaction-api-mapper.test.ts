import { describe, expect, it } from "vitest";

import type { InteractionFlow } from "./interaction-drawer";
import { buildInteractionPayload, mapInteractionChannel, mapInteractionOutcome } from "./interaction-api-mapper";

const flow: InteractionFlow = {
  contactType: "whatsapp",
  contactAttemptOutcome: "replied",
  conversationOutcome: "payment_promised",
  nextAction: "check_payment",
  scheduledAt: "2026-08-01T10:30",
  notes: "  Cliente pagará amanhã.  ",
};

describe("mapeamento da Interaction API", () => {
  it.each([
    ["phone", "phone"],
    ["whatsapp", "whatsapp"],
    ["email", "email"],
    ["in_person", "visit"],
  ] as const)("mapeia o canal %s para %s", (frontend, backend) => {
    expect(mapInteractionChannel(frontend)).toBe(backend);
  });

  it.each([
    ["no_answer", "other", "no_answer"],
    ["busy", "other", "no_answer"],
    ["invalid_number", "other", "wrong_contact"],
    ["answered", "payment_promised", "promise_to_pay"],
    ["answered", "payment_completed", "completed"],
    ["answered", "not_interested", "refused"],
    ["answered", "callback_requested", "follow_up"],
    ["answered", "negotiation_started", "contact_made"],
  ] as const)("mapeia outcome de tentativa e conversa", (attempt, conversation, backend) => {
    expect(mapInteractionOutcome(attempt, conversation)).toBe(backend);
  });

  it("monta somente os campos aceitos e preserva o formulário original", () => {
    const original = structuredClone(flow);

    expect(buildInteractionPayload(flow, "84510")).toEqual({
      channel: "whatsapp",
      outcome: "promise_to_pay",
      notes: "Cliente pagará amanhã.",
      receivableId: "84510",
    });
    expect(flow).toEqual(original);
    expect(buildInteractionPayload(flow)).not.toHaveProperty("userId");
    expect(buildInteractionPayload(flow)).not.toHaveProperty("nextAction");
  });
});
