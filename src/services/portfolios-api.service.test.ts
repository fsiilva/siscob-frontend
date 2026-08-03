import MockAdapter from "axios-mock-adapter";
import { afterEach, describe, expect, it } from "vitest";
import { api } from "./api";
import { createPortfolio, getPortfolio, getPortfolios, updatePortfolio, updatePortfolioStatus } from "./portfolios-api.service";

const portfolio = { id: "03b61183-701d-49c3-ad67-a360cf24e780", code: "NORTH", name: "Carteira Norte", companyId: "1", active: true, createdAt: "2026-01-01T00:00:00Z", updatedAt: "2026-01-01T00:00:00Z" };
const mock = new MockAdapter(api);
afterEach(() => mock.reset());

describe("portfolios API", () => {
  it("loads filtered portfolios", async () => {
    mock.onGet("/portfolios", { params: { company: "1", active: true } }).reply(200, [portfolio]);
    await expect(getPortfolios({ company: "1", active: true })).resolves.toEqual([portfolio]);
  });

  it("loads portfolio detail", async () => {
    mock.onGet(`/portfolios/${portfolio.id}`).reply(200, portfolio);
    await expect(getPortfolio(portfolio.id)).resolves.toEqual(portfolio);
  });

  it("creates, edits and changes portfolio status", async () => {
    mock.onPost("/portfolios").reply(201, portfolio);
    mock.onPatch(`/portfolios/${portfolio.id}`).reply(200, portfolio);
    mock.onPatch(`/portfolios/${portfolio.id}/status`).reply(200, { ...portfolio, active: false });
    await expect(createPortfolio({ code: "NORTH", name: "Carteira Norte", companyId: "1" })).resolves.toEqual(portfolio);
    await expect(updatePortfolio(portfolio.id, { name: "Carteira Norte" })).resolves.toEqual(portfolio);
    await expect(updatePortfolioStatus(portfolio.id, false)).resolves.toMatchObject({ active: false });
  });
});
