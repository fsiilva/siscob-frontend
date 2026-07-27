import type {
  Receivable,
  ReceivablesQuery,
  ReceivablesResponse,
} from "@/types/receivables";

import { api } from "./api";

export async function getReceivables(
  query: ReceivablesQuery,
): Promise<ReceivablesResponse> {
  const { data } = await api.get<ReceivablesResponse>("/receivables", {
    params: query,
  });

  return data;
}

export async function getReceivableById(id: number): Promise<Receivable> {
  const { data } = await api.get<Receivable>(`/receivables/${id}`);

  return data;
}
