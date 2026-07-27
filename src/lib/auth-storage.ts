import type { AuthTokens } from "@/types/auth";

const ACCESS_TOKEN_KEY = "siscob.accessToken";
const REFRESH_TOKEN_KEY = "siscob.refreshToken";

function hasLocalStorage() {
  return typeof window !== "undefined";
}

export function saveAuthTokens(tokens: AuthTokens) {
  if (!hasLocalStorage()) return;

  localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
}

export function getAuthTokens(): AuthTokens | null {
  if (!hasLocalStorage()) return null;

  const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

  if (!accessToken || !refreshToken) return null;

  return { accessToken, refreshToken };
}

export function clearAuthTokens() {
  if (!hasLocalStorage()) return;

  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}
