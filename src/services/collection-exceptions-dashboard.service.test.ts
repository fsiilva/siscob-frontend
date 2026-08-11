import MockAdapter from "axios-mock-adapter";
import { afterEach, describe, expect, it } from "vitest";

import { collectionExceptionsFixture } from "@/schemas/collection-exceptions-dashboard.schema.test";
import type { CollectionExceptionsFilters } from "@/types/collection-exceptions-dashboard";
import { api } from "./api";
import { getCollectionExceptionsDashboard } from "./collection-exceptions-dashboard.service";

const mock = new MockAdapter(api);
afterEach(() => mock.reset());

describe("collection exceptions dashboard service", () => {
  it("faz uma chamada com apenas os filtros suportados", async () => {
    const filters: CollectionExceptionsFilters = { companyId: "2", customerId: "10", severity: "CRITICAL", alertType: "CRITICAL_WITHOUT_FOLLOW_UP", page: 2, pageSize: 20 };
    mock.onGet("/dashboard/collection-exceptions", { params: filters }).reply(200, collectionExceptionsFixture);
    await expect(getCollectionExceptionsDashboard(filters)).resolves.toEqual(collectionExceptionsFixture);
    expect(mock.history.get).toHaveLength(1);
    expect(mock.history.get[0].params).toEqual(filters);
  });
  it("propaga ZodError para resposta inválida", async () => { mock.onGet("/dashboard/collection-exceptions").reply(200, { summary: {} }); await expect(getCollectionExceptionsDashboard({ page: 1, pageSize: 20 })).rejects.toMatchObject({ name: "ZodError" }); });
});
