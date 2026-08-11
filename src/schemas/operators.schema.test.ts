import { describe, expect, it } from "vitest";

import { operatorsResponseSchema } from "./operators.schema";

export const operatorsFixture = {
  items: [{ id: "3d6f0a06-5c9d-45bb-83ee-b128760af855", name: "Ana Operadora", email: "ana@example.com" }],
};

describe("operators schema", () => {
  it("valida integralmente o catálogo", () => expect(operatorsResponseSchema.parse(operatorsFixture)).toEqual(operatorsFixture));
  it("rejeita id, e-mail e campos extras inválidos", () => {
    expect(operatorsResponseSchema.safeParse({ items: [{ id: "texto", name: "Ana", email: "inválido" }] }).success).toBe(false);
    expect(operatorsResponseSchema.safeParse({ ...operatorsFixture, extra: true }).success).toBe(false);
  });
});
