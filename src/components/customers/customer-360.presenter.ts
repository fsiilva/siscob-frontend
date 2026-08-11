import type { Customer360Receivable } from "@/types/customer-360";

export const customer360Currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const date = new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" });
const dateTime = new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" });

export function formatCustomer360Date(value: string | null) {
  if (!value) return "Não informado";
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? "Não informado" : date.format(parsed);
}

export function formatCustomer360DateTime(value: string) {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? "Data indisponível" : dateTime.format(parsed);
}

export function friendlyCustomerValue(value: string | null) {
  return value?.trim() || "Não informado";
}

export function formatCustomer360Company(company: Pick<Customer360Receivable["company"], "name"> & { id: number | string }) {
  const name = company.name?.trim();
  return name && name !== "." ? name : `Empresa #${company.id}`;
}
