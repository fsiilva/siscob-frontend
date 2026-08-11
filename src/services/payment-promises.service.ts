import { createPaymentPromiseRequestSchema, paymentPromiseSchema, paymentPromisesResponseSchema, transitionPaymentPromiseRequestSchema } from "@/schemas/payment-promises.schema";
import type { CreatePaymentPromiseRequest, PaymentPromiseCommand } from "@/types/payment-promises";

import { api } from "./api";

export async function createPaymentPromise(operationId: string, request: CreatePaymentPromiseRequest) {
  const payload = createPaymentPromiseRequestSchema.parse(request);
  const { data } = await api.post(`/operations/${operationId}/payment-promises`, compact(payload));
  return paymentPromiseSchema.parse(data);
}

export async function getPaymentPromises(operationId: string) {
  const { data } = await api.get(`/operations/${operationId}/payment-promises`);
  return paymentPromisesResponseSchema.parse(data);
}

export async function transitionPaymentPromise(id: string, command: PaymentPromiseCommand, expectedVersion: number) {
  const payload = transitionPaymentPromiseRequestSchema.parse({ expectedVersion });
  const { data } = await api.post(`/payment-promises/${id}/${command}`, payload);
  return paymentPromiseSchema.parse(data);
}

function compact<T extends object>(value: T) {
  return Object.fromEntries(Object.entries(value).filter(([, entry]) => entry !== undefined && entry !== ""));
}
