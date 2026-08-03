import { describe, expect, it } from "vitest";

import { companyListResponseSchema } from "./company.schemas";

describe("company API schemas", () => {
  it("aceita o contrato oficial com code null", () => {
    expect(companyListResponseSchema.parse({
      data: [{ id: "4", code: null, name: "MAGNA LOCAÇÕES", active: true }],
    })).toEqual({
      data: [{ id: "4", code: null, name: "MAGNA LOCAÇÕES", active: true }],
    });
  });

  it("rejeita respostas inválidas", () => {
    expect(() => companyListResponseSchema.parse({ items: [] })).toThrow();
    expect(() => companyListResponseSchema.parse({
      data: [{ id: 4, code: null, name: "Empresa", active: true }],
    })).toThrow();
  });
});
