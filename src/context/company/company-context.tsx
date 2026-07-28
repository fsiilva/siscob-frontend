"use client";

import {
  createContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";

import type { Company, CompanyContextValue, CompanyScope } from "./types";

const SELECTED_COMPANY_KEY = "siscob.selectedCompany";
const COMPANY_SCOPE_KEY = "siscob.companyScope";
const DEFAULT_SCOPE: CompanyScope = "ASSIGNED";

export const CompanyContext = createContext<CompanyContextValue | null>(null);

function isCompany(value: unknown): value is Company {
  if (typeof value !== "object" || value === null) return false;

  return (
    "id" in value &&
    typeof value.id === "number" &&
    Number.isInteger(value.id) &&
    "code" in value &&
    typeof value.code === "string" &&
    "name" in value &&
    typeof value.name === "string"
  );
}

function isCompanyScope(value: unknown): value is CompanyScope {
  return value === "ASSIGNED" || value === "ALL" || value === "SINGLE";
}

function restoreSelectedCompany() {
  const storedValue = window.localStorage.getItem(SELECTED_COMPANY_KEY);

  if (!storedValue) return null;

  try {
    const parsedValue: unknown = JSON.parse(storedValue);
    return isCompany(parsedValue) ? parsedValue : null;
  } catch {
    return null;
  }
}

function restoreScope() {
  const storedValue: unknown = window.localStorage.getItem(COMPANY_SCOPE_KEY);
  return isCompanyScope(storedValue) ? storedValue : DEFAULT_SCOPE;
}

export function CompanyProvider({ children }: PropsWithChildren) {
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [assignedCompanies, setAssignedCompanies] = useState<Company[]>([]);
  const [availableCompanies, setAvailableCompanies] = useState<Company[]>([]);
  const [scope, setScope] = useState<CompanyScope>(DEFAULT_SCOPE);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setSelectedCompany(restoreSelectedCompany());
    setScope(restoreScope());
    setLoading(false);
  }, []);

  useEffect(() => {
    if (loading) return;

    try {
      window.localStorage.setItem(
        SELECTED_COMPANY_KEY,
        JSON.stringify(selectedCompany),
      );
      window.localStorage.setItem(COMPANY_SCOPE_KEY, scope);
    } catch {
      // O contexto continua funcional quando o storage estiver indisponível.
    }
  }, [loading, scope, selectedCompany]);

  const value = useMemo<CompanyContextValue>(
    () => ({
      selectedCompany,
      assignedCompanies,
      availableCompanies,
      scope,
      loading,
      setSelectedCompany,
      setAssignedCompanies,
      setAvailableCompanies,
      setScope,
    }),
    [
      assignedCompanies,
      availableCompanies,
      loading,
      scope,
      selectedCompany,
    ],
  );

  return <CompanyContext.Provider value={value}>{children}</CompanyContext.Provider>;
}
