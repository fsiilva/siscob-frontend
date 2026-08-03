import { describe, expect, it } from "vitest";

import { buildCompanyOptions } from "./build-company-options";

const contextCompany = { id: 2, code: "BETA", name: "Beta" };

describe("buildCompanyOptions", () => {
  it("usa empresas de receivables quando o contexto está vazio", () => {
    expect(buildCompanyOptions([], [{ id: 1, name: "Alfa" }])).toEqual([
      { id: 1, name: "Alfa" },
    ]);
  });

  it("mantém empresas vindas do contexto", () => {
    expect(buildCompanyOptions([contextCompany], [])).toEqual([
      { id: 2, name: "Beta" },
    ]);
  });

  it("deduplica por ID e ordena pelo nome", () => {
    expect(buildCompanyOptions(
      [contextCompany],
      [{ id: 2, name: "Beta atualizada" }, { id: 1, name: "Alfa" }],
    )).toEqual([
      { id: 1, name: "Alfa" },
      { id: 2, name: "Beta atualizada" },
    ]);
  });
});
