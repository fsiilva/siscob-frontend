export interface Company {
  id: number;
  code: string;
  name: string;
}

export type CompanyScope = "ASSIGNED" | "ALL" | "SINGLE";

export interface CompanyContextValue {
  selectedCompany: Company | null;
  assignedCompanies: Company[];
  availableCompanies: Company[];
  scope: CompanyScope;
  loading: boolean;
  setSelectedCompany: (company: Company | null) => void;
  setAssignedCompanies: (companies: Company[]) => void;
  setAvailableCompanies: (companies: Company[]) => void;
  setScope: (scope: CompanyScope) => void;
}
