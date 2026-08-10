import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import { customer360QueryKey } from "./useCustomer360";

describe("useCustomer360", () => {
  it("usa a factory centralizada obrigatória", () => expect(customer360QueryKey(123)).toEqual(["customers", 123, "360"]));
  it("faz somente a consulta agregada, sem polling", () => {
    const source = readFileSync(fileURLToPath(new URL("./useCustomer360.ts", import.meta.url)), "utf8");
    expect(source).toContain("getCustomer360(customerId)");
    expect(source).not.toContain("refetchInterval");
    for (const hook of ["useCustomerSummary", "useCustomerTimeline", "useCustomerNextActions", "useOperations", "useReceivables"]) expect(source).not.toContain(hook);
  });
});
