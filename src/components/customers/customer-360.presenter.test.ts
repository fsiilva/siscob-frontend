import { describe, expect, it } from "vitest";

import { customer360Currency, formatCustomer360Company, formatCustomer360Date, friendlyCustomerValue } from "./customer-360.presenter";

describe("customer 360 presenter", () => {
  it("formata valores em BRL", () => expect(customer360Currency.format(1234.56)).toContain("1.234,56"));
  it("formata datas em pt-BR", () => expect(formatCustomer360Date("2026-08-10")).toBe("10/08/2026"));
  it("não exibe null ou string vazia", () => {
    expect(friendlyCustomerValue(null)).toBe("Não informado");
    expect(friendlyCustomerValue("  ")).toBe("Não informado");
  });
  it("exibe o nome da empresa quando disponível", () => expect(formatCustomer360Company({ id: 4, name: "Empresa Fortaleza" })).toBe("Empresa Fortaleza"));
  it("usa o identificador como fallback quando company.name é null", () => expect(formatCustomer360Company({ id: 4, name: null })).toBe("Empresa #4"));
});
