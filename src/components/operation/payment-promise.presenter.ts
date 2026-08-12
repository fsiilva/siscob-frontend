import type { PaymentPromiseStatus } from "@/types/payment-promises";

const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const date = new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" });

export const paymentPromiseStatusLabels: Record<PaymentPromiseStatus, string> = {
  PENDING: "Pendente",
  FULFILLED: "Cumprida",
  BROKEN: "Quebrada",
  CANCELLED: "Cancelada",
};

export function formatPaymentPromiseAmount(value: number) {
  return currency.format(value);
}

export function formatPaymentPromiseDate(value: string) {
  return date.format(new Date(`${value}T00:00:00Z`));
}
