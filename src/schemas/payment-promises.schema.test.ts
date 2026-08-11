import { describe, expect, it } from "vitest";
import { createPaymentPromiseRequestSchema, paymentPromiseSchema } from "./payment-promises.schema";

export const paymentPromiseFixture = {
  id: "aa950f5b-a7fb-4bdd-a07a-46868f47db9f", customerId: "customer-1", receivableId: null,
  operationId: "0042565c-9530-42a5-b704-dc72031534a8", interactionId: null, promisedAmount: 1500.25,
  promisedDate: "2026-08-20", status: "PENDING" as const, notes: null,
  createdByUserId: "29ef5cb9-fd91-41ab-b30d-e52c6fdac7ec", version: 0,
  createdAt: "2026-08-11T12:00:00.000Z", updatedAt: "2026-08-11T12:00:00.000Z",
};

describe("payment promise schema", () => {
  it.each(["PENDING", "FULFILLED", "BROKEN", "CANCELLED"] as const)("aceita status %s", (status) => expect(paymentPromiseSchema.parse({ ...paymentPromiseFixture, status }).status).toBe(status));
  it("aceita campos nullable", () => expect(paymentPromiseSchema.parse(paymentPromiseFixture)).toEqual(paymentPromiseFixture));
  it("rejeita status, valor, data e version inválidos", () => {
    expect(paymentPromiseSchema.safeParse({ ...paymentPromiseFixture, status: "OPEN" }).success).toBe(false);
    expect(paymentPromiseSchema.safeParse({ ...paymentPromiseFixture, promisedAmount: 0 }).success).toBe(false);
    expect(paymentPromiseSchema.safeParse({ ...paymentPromiseFixture, promisedDate: "2026-02-30" }).success).toBe(false);
    expect(paymentPromiseSchema.safeParse({ ...paymentPromiseFixture, version: -1 }).success).toBe(false);
  });
  it("valida o payload mínimo de criação", () => expect(createPaymentPromiseRequestSchema.parse({ promisedAmount: 10.5, promisedDate: "2026-08-20" })).toEqual({ promisedAmount: 10.5, promisedDate: "2026-08-20" }));
});
