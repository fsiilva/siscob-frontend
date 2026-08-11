import { describe, expect, it } from "vitest";

import { collectionExceptionsQueryKeys } from "./useCollectionExceptionsDashboard";

describe("collection exceptions dashboard hook", () => {
  it("centraliza a query key com filtros e paginação", () => { const filters = { page: 2, pageSize: 20, severity: "WARNING" as const }; expect(collectionExceptionsQueryKeys.all).toEqual(["dashboard", "collection-exceptions"]); expect(collectionExceptionsQueryKeys.filtered(filters)).toEqual(["dashboard", "collection-exceptions", filters]); });
});
