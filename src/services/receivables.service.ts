import type {
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
