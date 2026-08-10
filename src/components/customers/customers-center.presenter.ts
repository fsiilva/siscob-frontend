import type { Customer } from "@/types/customers";

export function customerDisplayName(customer: Customer) {
  return presentCustomerField(customer.tradeName, "") || customer.name;
}

export function customerDocument(customer: Customer) {
  return presentCustomerField(customer.cnpj ?? customer.cpf, "Documento não informado");
}

export function customerPhone(customer: Customer) {
  return presentCustomerField(customer.mobilePhone ?? customer.phone, "Telefone não informado");
}

export function customerEmail(customer: Customer) {
  return presentCustomerField(customer.email, "E-mail não informado");
}

export function presentCustomerField(value: string | null | undefined, fallback: string) {
  const normalized = value?.trim();
  return normalized && normalized !== "." ? normalized : fallback;
}
