import AxiosMockAdapter from "axios-mock-adapter";
import { afterEach, describe, expect, it } from "vitest";
import { paymentPromiseFixture } from "@/schemas/payment-promises.schema.test";
import { api } from "./api";
import { createPaymentPromise, getPaymentPromises, transitionPaymentPromise } from "./payment-promises.service";

const mock = new AxiosMockAdapter(api);
afterEach(() => mock.reset());
describe("payment promises service", () => {
  it("lista pelo endpoint sem ser usado como segunda carga do details", async () => {
    mock.onGet("/operations/op-1/payment-promises").reply(200, { items: [paymentPromiseFixture] });
    await expect(getPaymentPromises("op-1")).resolves.toEqual({ items: [paymentPromiseFixture] });
  });
  it("cria com payload explícito e sem campos proibidos", async () => {
    const payload = { receivableId: "title-1", promisedAmount: 1500.25, promisedDate: "2026-08-20", notes: "Pagamento combinado" };
    mock.onPost("/operations/op-1/payment-promises", payload).reply(201, { ...paymentPromiseFixture, receivableId: "title-1", notes: payload.notes });
    await createPaymentPromise("op-1", payload);
    expect(JSON.parse(mock.history.post[0].data as string)).toEqual(payload);
  });
  it.each(["fulfill", "break", "cancel"] as const)("envia somente expectedVersion em %s", async (command) => {
    mock.onPost(`/payment-promises/${paymentPromiseFixture.id}/${command}`, { expectedVersion: 3 }).reply(200, { ...paymentPromiseFixture, version: 4 });
    await transitionPaymentPromise(paymentPromiseFixture.id, command, 3);
    expect(JSON.parse(mock.history.post[0].data as string)).toEqual({ expectedVersion: 3 });
  });
});
