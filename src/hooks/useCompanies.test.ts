import { describe, expect, it } from "vitest";

import { getCompanies } from "@/services/companies.service";

import { companyKeys } from "./useCompanies";

describe("companies hook contract", () => {
  it("usa a query key oficial com filtros estáveis", () => {
    expect(companyKeys.list({ active: true, search: "Magna" })).toEqual([
      "companies",
      { active: true, search: "Magna" },
    ]);
    expect(getCompanies).toBeTypeOf("function");
  });
});
