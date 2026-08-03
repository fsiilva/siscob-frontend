import { describe, expect, it } from "vitest";

import { buildCompanyOptions } from "./build-company-options";

const contextCompany = { id: 2, code: "BETA", name: "Beta" };
const officialCompany = { id: "1", code: null, name: "Alfa", active: true };

describe("buildCompanyOptions", () => {
  it("usa empresas oficiais quando o contexto está vazio e preserva code null", () => {
    expect(buildCompanyOptions([], [officialCompany])).toEqual([
      { id: "1", code: null, name: "Alfa" },
    ]);
  });

  it("mantém empresas vindas do contexto", () => {
    expect(buildCompanyOptions([contextCompany], [])).toEqual([
      { id: "2", code: "BETA", name: "Beta" },
    ]);
  });

  it("deduplica por ID, prioriza a API oficial e ordena pelo nome", () => {
    expect(buildCompanyOptions(
      [contextCompany],
      [
        { id: "2", code: null, name: "Beta atualizada", active: true },
        officialCompany,
      ],
    )).toEqual([
      { id: "1", code: null, name: "Alfa" },
      { id: "2", code: null, name: "Beta atualizada" },
    ]);
  });
});
