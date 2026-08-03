import type { Company } from "@/context/company";

export interface CompanyOption {
  id: number;
  name: string;
}

interface CompanyReference {
  id: number;
  name: string;
}

export function buildCompanyOptions(
  contextCompanies: readonly Company[],
  receivableCompanies: readonly CompanyReference[],
): CompanyOption[] {
  const companiesById = new Map<number, CompanyOption>();

  for (const company of [...contextCompanies, ...receivableCompanies]) {
    companiesById.set(company.id, { id: company.id, name: company.name });
  }

  return [...companiesById.values()].sort((left, right) =>
    left.name.localeCompare(right.name, "pt-BR"),
  );
}
