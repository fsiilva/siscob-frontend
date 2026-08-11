import AxiosMockAdapter from "axios-mock-adapter";
import { afterEach, describe, expect, it } from "vitest";

import { collectionPortfolioFixture } from "@/schemas/collection-portfolio-dashboard.schema.test";
import { api } from "./api";
import { getCollectionPortfolioDashboard } from "./collection-portfolio-dashboard.service";

const mock = new AxiosMockAdapter(api);
afterEach(() => mock.reset());

describe("collection portfolio dashboard service", () => {
  it("envia somente companyId quando selecionado", async () => { mock.onGet("/dashboard/collection-portfolio", { params: { companyId: "12" } }).reply(200, collectionPortfolioFixture); await expect(getCollectionPortfolioDashboard({ companyId: "12" })).resolves.toMatchObject(collectionPortfolioFixture); expect(mock.history.get).toHaveLength(1); });
  it("não envia filtros quando consulta todas as empresas", async () => { mock.onGet("/dashboard/collection-portfolio").reply(200, collectionPortfolioFixture); await getCollectionPortfolioDashboard({}); expect(mock.history.get[0].params).toBeUndefined(); });
  it("propaga ZodError para resposta inválida", async () => { mock.onGet("/dashboard/collection-portfolio").reply(200, { summary: {} }); await expect(getCollectionPortfolioDashboard()).rejects.toMatchObject({ name: "ZodError" }); });
});
