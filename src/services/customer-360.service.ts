import { customer360Schema } from "@/schemas/customer-360.schema";
import type { Customer360 } from "@/types/customer-360";

import { api } from "./api";

export async function getCustomer360(customerId: number): Promise<Customer360> {
  const { data } = await api.get(`/customers/${customerId}/360`);
  return customer360Schema.parse(data);
}
