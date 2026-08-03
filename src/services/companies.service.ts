import { companyListResponseSchema } from "@/schemas/company.schemas";
import type { CompanyListParams } from "@/types/companies-api";

import { api } from "./api";

export async function getCompanies(params: CompanyListParams = {}) {
  const { data } = await api.get("/companies", { params });
  return companyListResponseSchema.parse(data);
}
