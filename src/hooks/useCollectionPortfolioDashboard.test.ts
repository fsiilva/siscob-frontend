import { describe, expect, it } from "vitest";

import { collectionPortfolioDashboardQueryKeys } from "./useCollectionPortfolioDashboard";

describe("collection portfolio dashboard hook", () => {
  it("centraliza a query key e inclui companyId", () => {
    expect(collectionPortfolioDashboardQueryKeys.all).toEqual(["dashboard", "collection-portfolio"]);
    expect(collectionPortfolioDashboardQueryKeys.filtered({ companyId: "7" })).toEqual(["dashboard", "collection-portfolio", { companyId: "7" }]);
  });
});
