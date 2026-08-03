import MockAdapter from "axios-mock-adapter";
import { afterEach, describe, expect, it } from "vitest";

import { api } from "./api";
import { getCompanies } from "./companies.service";

const mock = new MockAdapter(api);

afterEach(() => mock.reset());

describe("companies service", () => {
  it("consulta /companies com filtros e valida a resposta", async () => {
    const response = {
      data: [{ id: "4", code: null, name: "MAGNA LOCAÇÕES", active: true }],
    };
    mock.onGet("/companies", { params: { active: true, search: "Magna" } }).reply(200, response);

    await expect(getCompanies({ active: true, search: "Magna" })).resolves.toEqual(response);
  });

  it("propaga erros HTTP sem expor detalhes na camada de interface", async () => {
    mock.onGet("/companies", { params: { active: true } }).reply(400, { message: "invalid" });
    await expect(getCompanies({ active: true })).rejects.toMatchObject({ status: 400 });

    mock.reset();
    mock.onGet("/companies", { params: {} }).reply(401, { message: "unauthorized" });
    await expect(getCompanies()).rejects.toThrow("Sessão expirada");

    mock.reset();
    mock.onGet("/companies", { params: {} }).networkError();
    await expect(getCompanies()).rejects.toMatchObject({ status: null });
  });

  it("rejeita uma resposta 200 com contrato inválido", async () => {
    mock.onGet("/companies", { params: {} }).reply(200, { items: [] });
    await expect(getCompanies()).rejects.toThrow();
  });
});
