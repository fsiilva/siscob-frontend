import AxiosMockAdapter from "axios-mock-adapter";
import { afterEach, describe, expect, it } from "vitest";

import { operatorsFixture } from "@/schemas/operators.schema.test";

import { api } from "./api";
import { getOperators } from "./operators.service";

const mock = new AxiosMockAdapter(api);
afterEach(() => mock.reset());

describe("operators service", () => {
  it("consulta o catálogo sem filtro vazio", async () => {
    mock.onGet("/operators").reply(200, operatorsFixture);
    await expect(getOperators({ search: "" })).resolves.toEqual(operatorsFixture);
  });
  it("envia apenas search quando informado", async () => {
    mock.onGet("/operators", { params: { search: "Ana" } }).reply(200, operatorsFixture);
    await expect(getOperators({ search: " Ana " })).resolves.toEqual(operatorsFixture);
  });
  it("rejeita resposta fora do contrato", async () => {
    mock.onGet("/operators").reply(200, { items: [{ id: 1 }] });
    await expect(getOperators({ search: "" })).rejects.toThrow();
  });
});
