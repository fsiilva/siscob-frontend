import type { Customer, CustomersQuery, CustomersResponse, CustomerSummary } from "@/types/customers";

import { api } from "./api";

export async function getCustomerById(id: number): Promise<Customer> {
  const { data } = await api.get<Customer>(`/customers/${id}`);
  return data;
}

export async function getCustomerSummary(id: number): Promise<CustomerSummary> {
  const { data } = await api.get<CustomerSummary>(`/customers/${id}/summary`);
  return data;
}

export async function getCustomers(query: CustomersQuery): Promise<CustomersResponse> {
  const { data } = await api.get<CustomersResponse>("/sisloc/customers", {
    params: { page: query.page, pageSize: query.pageSize, ...(query.search.trim() ? { search: query.search.trim() } : {}) },
  });
  return data;
}
