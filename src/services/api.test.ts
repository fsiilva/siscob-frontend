import MockAdapter from "axios-mock-adapter";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { getAuthTokens, saveAuthTokens } from "@/lib/auth-storage";

import {
  api,
  clearAuthSession,
  refreshApi,
  setAuthorization,
  setSessionExpiredHandler,
} from "./api";

class LocalStorageMock implements Storage {
  private store = new Map<string, string>();

  get length() {
    return this.store.size;
  }

  clear() {
    this.store.clear();
  }

  getItem(key: string) {
    return this.store.get(key) ?? null;
  }

  key(index: number) {
    return [...this.store.keys()][index] ?? null;
  }

  removeItem(key: string) {
    this.store.delete(key);
  }

  setItem(key: string, value: string) {
    this.store.set(key, value);
  }
}

describe("interceptor de renovação da sessão", () => {
  const apiMock = new MockAdapter(api);
  const refreshMock = new MockAdapter(refreshApi);
  const localStorage = new LocalStorageMock();

  beforeEach(() => {
    vi.stubGlobal("window", { localStorage });
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    apiMock.reset();
    refreshMock.reset();
    localStorage.clear();
    clearAuthSession();
    setSessionExpiredHandler(null);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("mantém uma requisição normal com access token válido", async () => {
    setAuthorization("valid-access");
    apiMock.onGet("/protected").reply((config) => [
      200,
      { authorization: config.headers?.Authorization },
    ]);

    const { data } = await api.get<{ authorization: string }>("/protected");

    expect(data.authorization).toBe("Bearer valid-access");
    expect(refreshMock.history.post).toHaveLength(0);
  });

  it("renova tokens e repete uma única vez a requisição original", async () => {
    saveAuthTokens({ accessToken: "expired-access", refreshToken: "refresh-1" });
    setAuthorization("expired-access");
    refreshMock.onPost("/auth/refresh", { refreshToken: "refresh-1" }).reply(200, {
      accessToken: "access-2",
      refreshToken: "refresh-2",
      expiresIn: 900,
    });
    apiMock
      .onGet("/protected")
      .replyOnce(401)
      .onGet("/protected")
      .reply((config) => [200, { authorization: config.headers?.Authorization }]);

    const { data } = await api.get<{ authorization: string }>("/protected");

    expect(data.authorization).toBe("Bearer access-2");
    expect(apiMock.history.get).toHaveLength(2);
    expect(refreshMock.history.post).toHaveLength(1);
    expect(getAuthTokens()).toEqual({
      accessToken: "access-2",
      refreshToken: "refresh-2",
    });
    expect(api.defaults.headers.common.Authorization).toBe("Bearer access-2");
  });

  it("compartilha um único refresh entre múltiplos 401 simultâneos", async () => {
    saveAuthTokens({ accessToken: "expired-access", refreshToken: "refresh-1" });
    setAuthorization("expired-access");
    refreshMock.onPost("/auth/refresh").reply(
      () =>
        new Promise((resolve) => {
          setTimeout(
            () =>
              resolve([
                200,
                {
                  accessToken: "access-2",
                  refreshToken: "refresh-2",
                  expiresIn: 900,
                },
              ]),
            10,
          );
        }),
    );
    apiMock.onGet(/\/resource\/[12]/).reply((config) => {
      return config.headers?.Authorization === "Bearer access-2"
        ? [200, { ok: true }]
        : [401];
    });

    const responses = await Promise.all([
      api.get("/resource/1"),
      api.get("/resource/2"),
    ]);

    expect(responses.every(({ data }) => data.ok)).toBe(true);
    expect(refreshMock.history.post).toHaveLength(1);
    expect(apiMock.history.get).toHaveLength(4);
  });

  it.each([
    ["expirado", 401],
    ["revogado", 401],
  ])("encerra a sessão quando o refresh está %s", async (_scenario, status) => {
    const onExpired = vi.fn();
    saveAuthTokens({ accessToken: "expired-access", refreshToken: "invalid-refresh" });
    setAuthorization("expired-access");
    setSessionExpiredHandler(onExpired);
    apiMock.onGet("/protected").reply(401);
    refreshMock.onPost("/auth/refresh").reply(status);

    await expect(api.get("/protected")).rejects.toBeDefined();

    expect(getAuthTokens()).toBeNull();
    expect(api.defaults.headers.common.Authorization).toBeUndefined();
    expect(onExpired).toHaveBeenCalledOnce();
    expect(apiMock.history.get).toHaveLength(1);
  });

  it("encerra a sessão quando não existe refresh token", async () => {
    const onExpired = vi.fn();
    setAuthorization("expired-access");
    setSessionExpiredHandler(onExpired);
    apiMock.onGet("/protected").reply(401);

    await expect(api.get("/protected")).rejects.toBeDefined();

    expect(refreshMock.history.post).toHaveLength(0);
    expect(api.defaults.headers.common.Authorization).toBeUndefined();
    expect(onExpired).toHaveBeenCalledOnce();
  });

  it("não entra em loop quando a requisição repetida também recebe 401", async () => {
    saveAuthTokens({ accessToken: "expired-access", refreshToken: "refresh-1" });
    setAuthorization("expired-access");
    refreshMock.onPost("/auth/refresh").reply(200, {
      accessToken: "access-2",
      refreshToken: "refresh-2",
      expiresIn: 900,
    });
    apiMock.onGet("/always-unauthorized").reply(401);

    await expect(api.get("/always-unauthorized")).rejects.toBeDefined();

    expect(refreshMock.history.post).toHaveLength(1);
    expect(apiMock.history.get).toHaveLength(2);
  });

  it("não tenta renovar recursivamente uma chamada ao próprio refresh", async () => {
    saveAuthTokens({ accessToken: "expired-access", refreshToken: "refresh-1" });
    apiMock.onPost("/auth/refresh").reply(401);

    await expect(
      api.post("/auth/refresh", { refreshToken: "refresh-1" }),
    ).rejects.toBeDefined();

    expect(refreshMock.history.post).toHaveLength(0);
    expect(apiMock.history.post).toHaveLength(1);
  });
});
