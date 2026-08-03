import MockAdapter from "axios-mock-adapter";
import { beforeEach, describe, expect, it } from "vitest";

import { api } from "./api";
import { getCustomers } from "./customers.service";

describe("customers.service selection source", () => {
  const mock = new MockAdapter(api);
  beforeEach(() => mock.reset());

  it("pesquisa Customers pela API Sisloc sem fabricar IDs", async () => {
    const response = { data: [{ id: 123, name: "Cliente Teste", tradeName: null, personType: null, cpf: null, cnpj: null, email: null, mobilePhone: null, phone: null, city: null, state: null, active: true }], pagination: { page: 1, pageSize: 50, total: 1, totalPages: 1 } };
    mock.onGet("/sisloc/customers", { params: { page: 1, pageSize: 50, search: "Cliente" } }).reply(200, response);
    await expect(getCustomers(" Cliente ")).resolves.toEqual(response);
  });
});
