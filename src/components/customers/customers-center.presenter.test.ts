import { describe, expect, it } from "vitest";
import type { Customer } from "@/types/customers";
import { customerDisplayName, customerDocument, customerEmail, customerPhone, presentCustomerField } from "./customers-center.presenter";

const customer = { id: 52, name: "Razão Social", tradeName: "Nome Fantasia", cpf: null, cnpj: "41416983000129", mobilePhone: null, phone: "(85) 3276-1546", email: "cliente@example.com" } as Customer;

describe("customers center presenter", () => {
  it("apresenta os campos cadastrais reais", () => {
    expect(customerDisplayName(customer)).toBe("Nome Fantasia");
    expect(customerDocument(customer)).toBe("41416983000129");
    expect(customerPhone(customer)).toBe("(85) 3276-1546");
    expect(customerEmail(customer)).toBe("cliente@example.com");
  });
  it("preserva e-mail curto e múltiplos e-mails sem modificar o valor", () => {
    expect(customerEmail(customer)).toBe("cliente@example.com");
    expect(customerEmail({ ...customer, email: "um@example.com; dois@example.com; tres@example.com" })).toBe("um@example.com; dois@example.com; tres@example.com");
  });
  it.each([null, undefined, "", "   ", ".", " . "])("trata %s como ausência apenas na apresentação", (value) => expect(presentCustomerField(value, "Não informado")).toBe("Não informado"));
  it("usa mensagens específicas para campos ausentes", () => {
    const missing = { ...customer, cpf: null, cnpj: null, phone: null, mobilePhone: null, email: "." };
    expect(customerDocument(missing)).toBe("Documento não informado");
    expect(customerPhone(missing)).toBe("Telefone não informado");
    expect(customerEmail(missing)).toBe("E-mail não informado");
  });
});
