import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import { customersQueryKey } from "./useCustomers";

describe("useCustomers", () => {
  it("centraliza search e paginação na query key", () => {
    const filters = { search: "Cliente", page: 2, pageSize: 20 };
    expect(customersQueryKey(filters)).toEqual(["customers", "search", filters]);
  });
  it("reutiliza o service, suporta estado inicial desabilitado e não faz polling", () => {
    const source = readFileSync(fileURLToPath(new URL("./useCustomers.ts", import.meta.url)), "utf8");
    expect(source).toContain("getCustomers(query)");
    expect(source).toContain("enabled");
    expect(source).not.toContain("refetchInterval");
  });
});
