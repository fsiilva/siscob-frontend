import MockAdapter from "axios-mock-adapter";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { api } from "./api";
import { createInteraction } from "./interactions.service";

describe("interactions.service", () => {
  const apiMock = new MockAdapter(api);
  const payload = {
    channel: "phone" as const,
    outcome: "promise_to_pay" as const,
    notes: "Cliente prometeu pagar.",
    receivableId: "84510",
    operationId: "8ee00be1-7a09-4c4a-8af1-13562e503c1f",
  };

  beforeEach(() => {
    apiMock.reset();
    vi.spyOn(console, "error").mockImplementation(() => undefined);
  });

  afterEach(() => vi.restoreAllMocks());

  it("envia o contrato real e retorna a interação criada", async () => {
    apiMock.onPost("/customers/123/interactions", payload).reply(201, {
      id: "interaction-1",
      customerId: "123",
      receivableId: "84510",
      userId: "authenticated-user",
      channel: "phone",
      outcome: "promise_to_pay",
      notes: payload.notes,
      createdAt: "2026-07-30T12:00:00.000Z",
      updatedAt: "2026-07-30T12:00:00.000Z",
    });

    const response = await createInteraction(123, payload);

    expect(response.id).toBe("interaction-1");
    expect(apiMock.history.post).toHaveLength(1);
    expect(JSON.parse(apiMock.history.post[0].data as string)).toEqual(payload);
  });

  it("propaga o erro e permite retry explícito", async () => {
    apiMock
      .onPost("/customers/123/interactions")
      .replyOnce(500, { message: "Serviço indisponível" })
      .onPost("/customers/123/interactions")
      .reply(201, { id: "interaction-2" });

    await expect(createInteraction(123, payload)).rejects.toThrow("Serviço indisponível");
    await expect(createInteraction(123, payload)).resolves.toMatchObject({ id: "interaction-2" });
    expect(apiMock.history.post).toHaveLength(2);
  });
});
