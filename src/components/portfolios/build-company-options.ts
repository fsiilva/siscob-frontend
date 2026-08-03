import type { Company } from "@/context/company";
import type { CompanyApiResponse } from "@/types/companies-api";

export interface CompanyOption {
  id: string;
  code: string | null;
  name: string;
}

export function buildCompanyOptions(
  contextCompanies: readonly Company[],
  officialCompanies: readonly CompanyApiResponse[],
): CompanyOption[] {
  const companiesById = new Map<string, CompanyOption>();

  for (const company of contextCompanies) {
    const id = String(company.id);
    companiesById.set(id, { id, code: company.code, name: company.name });
  }

  for (const company of officialCompanies) {
    companiesById.set(company.id, {
      id: company.id,
      code: company.code,
      name: company.name,
    });
  }

  return [...companiesById.values()].sort((left, right) =>
    left.name.localeCompare(right.name, "pt-BR"),
  );
}
