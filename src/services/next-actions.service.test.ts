import MockAdapter from "axios-mock-adapter";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { api } from "./api";
import {
  cancelNextAction,
  completeNextAction,
  getCustomerNextActions,
  getMyNextActions,
  rescheduleNextAction,
} from "./next-actions.service";

describe("next-actions.service", () => {
  const apiMock = new MockAdapter(api);

  beforeEach(() => {
    apiMock.reset();
    vi.spyOn(console, "error").mockImplementation(() => undefined);
  });
  afterEach(() => vi.restoreAllMocks());

  it("lista as ações do usuário autenticado respeitando a resposta", async () => {
    const response = { data: [{ id: "action-1" }], pagination: { page: 1, pageSize: 100, total: 1, totalPages: 1 } };
    apiMock.onGet("/me/next-actions", { params: { page: 1, pageSize: 100 } }).reply(200, response);
    await expect(getMyNextActions()).resolves.toEqual(response);
  });

  it("lista as ações por cliente", async () => {
    const response = { data: [{ id: "action-2", customerId: "123" }], pagination: { page: 1, pageSize: 100, total: 1, totalPages: 1 } };
    apiMock.onGet("/customers/123/next-actions", { params: { page: 1, pageSize: 100 } }).reply(200, response);
    await expect(getCustomerNextActions(123)).resolves.toEqual(response);
  });

  it("conclui sem enviar atualização otimista ou body", async () => {
    apiMock.onPatch("/next-actions/action-1/complete").reply(200, { id: "action-1", status: "COMPLETED" });
    await expect(completeNextAction("action-1")).resolves.toMatchObject({ status: "COMPLETED" });
    expect(apiMock.history.patch[0].data).toBeUndefined();
  });

  it("cancela enviando o motivo obrigatório", async () => {
    apiMock.onPatch("/next-actions/action-1/cancel", { reason: "Cliente solicitou." }).reply(200, { id: "action-1", status: "CANCELLED" });
    await expect(cancelNextAction("action-1", { reason: "Cliente solicitou." })).resolves.toMatchObject({ status: "CANCELLED" });
    expect(JSON.parse(apiMock.history.patch[0].data as string)).toEqual({ reason: "Cliente solicitou." });
  });

  it("reagenda enviando dueAt e descrição opcional", async () => {
    const request = { dueAt: "2026-08-05T14:00:00.000Z", description: "Novo prazo." };
    apiMock.onPatch("/next-actions/action-1/reschedule", request).reply(200, { id: "action-1", status: "PENDING", ...request });
    await expect(rescheduleNextAction("action-1", request)).resolves.toMatchObject({ status: "PENDING", ...request });
  });
});
