import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import type { ManagementDashboard } from "@/types/management-dashboard";

import { isManagementDashboardEmpty, managementLabel } from "./management-dashboard.presenter";

const source = readFileSync(fileURLToPath(new URL("./management-dashboard.tsx", import.meta.url)), "utf8");

describe("management dashboard", () => {
  it("renders the required cards and operator table columns", () => {
    for (const text of [
      "Total de Operations",
      "Por Status",
      "Por Prioridade",
      "Operador",
      "Atribuídas",
      "Em andamento",
      "Concluídas hoje",
      "Ações vencidas",
      "Empresas",
      "Carteiras",
    ]) expect(source).toContain(text);
  });

  it("implements loading, error, retry and empty states", () => {
    expect(source).toContain("query.isLoading");
    expect(source).toContain("query.isError");
    expect(source).toContain("query.refetch()");
    expect(source).toContain("Tentar novamente");
    expect(source).toContain("Nenhum dado gerencial disponível");
  });

  it("presents grouped labels and detects empty data", () => {
    const empty: ManagementDashboard = {
      operations: { total: 0, byStatus: [], byPriority: [] },
      operators: [],
      companies: [],
      portfolios: [],
    };
    expect(managementLabel("IN_PROGRESS")).toBe("Em andamento");
    expect(isManagementDashboardEmpty(empty)).toBe(true);
  });
});
