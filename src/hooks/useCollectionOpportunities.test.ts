import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import { collectionOpportunitiesQueryKey } from "./useCollectionOpportunities";

describe("useCollectionOpportunities", () => {
  it("usa a query key centralizada", () => expect(collectionOpportunitiesQueryKey(10)).toEqual(["customers", 10, "collection-opportunities"]));
  it("consulta apenas o endpoint agregado e não usa polling", () => {
    const source = readFileSync(fileURLToPath(new URL("./useCollectionOpportunities.ts", import.meta.url)), "utf8");
    expect(source).toContain("getCollectionOpportunities(customerId)");
    expect(source).not.toContain("refetchInterval");
    expect(source).not.toContain("useReceivables");
  });
});
