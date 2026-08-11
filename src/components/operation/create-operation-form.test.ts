import { describe, expect, it } from "vitest";

import { ApiRequestError } from "@/services/api";
import type { AuthUser } from "@/types/auth";

import { buildCreateOperationRequest, canCreateOperation, changeCreateOperationCompany, changeCreateOperationCustomer, createOperationErrorMessage, initialCreateOperationValues, isCreateOperationValid } from "./create-operation-form";

const admin = { id: "admin", role: "ADMIN" } as AuthUser;
const operator = { id: "operator", role: "USER" } as AuthUser;
const valid = { companyId: " 1 ", portfolioId: " north ", customerId: " 123 ", receivableId: " 456 ", objective: " Cobrar títulos ", priority: "HIGH" as const };

describe("create Operation form", () => {
  it("inicia com prioridade NORMAL e campos vazios", () => {
    expect(initialCreateOperationValues).toMatchObject({ priority: "NORMAL", receivableId: "" });
    expect(isCreateOperationValid(initialCreateOperationValues)).toBe(false);
  });

  it("exige empresa, carteira, Customer, objetivo e prioridade", () => {
    expect(isCreateOperationValid(valid)).toBe(true);
    for (const field of ["companyId", "portfolioId", "customerId", "objective"] as const) {
      expect(isCreateOperationValid({ ...valid, [field]: "" })).toBe(false);
    }
  });

  it("limpa Receivable quando o Customer muda", () => {
    expect(changeCreateOperationCustomer(valid, "999")).toMatchObject({ customerId: "999", receivableId: "" });
  });

  it("limpa carteira e Receivable quando a empresa muda", () => {
    expect(changeCreateOperationCompany(valid, "2")).toMatchObject({ companyId: "2", portfolioId: "", receivableId: "" });
  });

  it("envia IDs corretos e omite Receivable quando não selecionado", () => {
    expect(buildCreateOperationRequest(valid)).toEqual({ companyId: "1", portfolioId: "north", customerId: "123", receivableId: "456", objective: "Cobrar títulos", priority: "HIGH" });
    expect(buildCreateOperationRequest({ ...valid, receivableId: "" })).not.toHaveProperty("receivableId");
  });

  it.each(["HIGH", "URGENT"] as const)("preserva prioridade sugerida %s sem enviar score", (priority) => {
    const request = buildCreateOperationRequest({ ...valid, priority });
    expect(request).toMatchObject({ companyId: "1", receivableId: "456", priority });
    expect(request).not.toHaveProperty("score");
  });

  it("autoriza visualmente somente ADMIN", () => {
    expect(canCreateOperation(admin)).toBe(true);
    expect(canCreateOperation(operator)).toBe(false);
    expect(canCreateOperation(null)).toBe(false);
  });

  it.each([[400, "campos obrigatórios"], [401, "sessão expirou"], [403, "permissão"], [404, "não foi encontrado"], [409, "conflitante"], [422, "regras atuais"]])("traduz erro HTTP %s", (status, expected) => {
    expect(createOperationErrorMessage(new ApiRequestError({ status, message: "detalhe técnico", url: "/operations" }))).toContain(expected);
  });

  it("traduz erro de rede", () => {
    expect(createOperationErrorMessage(new Error("ECONNRESET"))).toContain("Falha de rede");
  });
});
