import MockAdapter from "axios-mock-adapter";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { api } from "./api";
import { getCustomerTimeline } from "./timeline.service";

describe("timeline.service", () => {
  const apiMock = new MockAdapter(api);

  beforeEach(() => {
    apiMock.reset();
    vi.spyOn(console, "error").mockImplementation(() => undefined);
  });
  afterEach(() => vi.restoreAllMocks());

  it("lista a primeira página do cliente", async () => {
    const response = { items: [{ id: "event-2" }, { id: "event-1" }], nextCursor: "event-1", hasMore: true };
    apiMock.onGet("/customers/123/timeline", { params: { limit: 20 } }).reply(200, response);
    await expect(getCustomerTimeline(123)).resolves.toEqual(response);
  });

  it("envia exclusivamente o cursor retornado para a página seguinte", async () => {
    const response = { items: [{ id: "event-0" }], nextCursor: null, hasMore: false };
    apiMock.onGet("/customers/123/timeline", { params: { limit: 20, cursor: "server-cursor" } }).reply(200, response);
    await expect(getCustomerTimeline(123, { cursor: "server-cursor" })).resolves.toEqual(response);
    expect(apiMock.history.get[0].params).toEqual({ limit: 20, cursor: "server-cursor" });
  });

  it("propaga erro de cursor inválido", async () => {
    apiMock.onGet("/customers/123/timeline").reply(400, { message: "Invalid timeline cursor" });
    await expect(getCustomerTimeline(123, { cursor: "invalid" })).rejects.toThrow("Invalid timeline cursor");
  });
});
