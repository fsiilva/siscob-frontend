import MockAdapter from "axios-mock-adapter";
import { afterEach, describe, expect, it } from "vitest";

import { collectionOpportunitiesResponse } from "@/schemas/collection-opportunities.schema.test";

import { api } from "./api";
import { getCollectionOpportunities } from "./collection-opportunities.service";

const mock = new MockAdapter(api);
afterEach(() => mock.reset());

describe("collection opportunities service", () => {
  it("faz uma única chamada ao endpoint agregado", async () => {
    mock.onGet("/customers/10/collection-opportunities").reply(200, collectionOpportunitiesResponse);
    await expect(getCollectionOpportunities(10)).resolves.toEqual(collectionOpportunitiesResponse);
    expect(mock.history.get).toHaveLength(1);
    expect(mock.history.get[0].url).toBe("/customers/10/collection-opportunities");
  });
  it("rejeita resposta inválida", async () => {
    mock.onGet("/customers/10/collection-opportunities").reply(200, { customerId: 10, items: [{ receivableId: 123 }] });
    await expect(getCollectionOpportunities(10)).rejects.toThrow();
  });
});
