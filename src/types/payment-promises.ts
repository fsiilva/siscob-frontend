export type PaymentPromiseStatus = "PENDING" | "FULFILLED" | "BROKEN" | "CANCELLED";
export type PaymentPromiseCommand = "fulfill" | "break" | "cancel";

export interface PaymentPromise {
  id: string;
  customerId: string;
  receivableId: string | null;
  operationId: string;
  interactionId: string | null;
  promisedAmount: number;
  promisedDate: string;
  status: PaymentPromiseStatus;
  notes: string | null;
  createdByUserId: string;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePaymentPromiseRequest {
  receivableId?: string;
  promisedAmount: number;
  promisedDate: string;
  notes?: string;
}
