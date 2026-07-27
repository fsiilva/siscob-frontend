import axios, {
  AxiosHeaders,
  type InternalAxiosRequestConfig,
} from "axios";

import {
  clearAuthTokens,
  getAuthTokens,
  saveAuthTokens,
} from "@/lib/auth-storage";
import type { LoginResponse } from "@/types/auth";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export interface ApiErrorDetails {
  status: number | null;
  message: string;
  url: string;
}

export class ApiRequestError extends Error {
  readonly status: number | null;
  readonly url: string;

  constructor({ status, message, url }: ApiErrorDetails) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
    this.url = url;
  }
}

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

type SessionExpiredHandler = () => void;

let refreshPromise: Promise<string> | null = null;
let sessionExpiredHandler: SessionExpiredHandler | null = null;

function getResponseMessage(data: unknown, fallback: string) {
  if (typeof data === "object" && data !== null && "message" in data) {
    const { message } = data;

    if (typeof message === "string") return message;
    if (Array.isArray(message)) return message.join(", ");
  }

  return fallback;
}

function getRequestUrl(requestBaseUrl?: string, requestPath?: string) {
  if (!requestBaseUrl) return requestPath ?? "URL indisponível";

  try {
    return new URL(requestPath ?? "", requestBaseUrl).toString();
  } catch {
    return `${requestBaseUrl}${requestPath ?? ""}`;
  }
}

export const api = axios.create({
  baseURL,
  timeout: 15_000,
  headers: {
    Accept: "application/json",
  },
});

export const refreshApi = axios.create({
  baseURL,
  timeout: 15_000,
  headers: {
    Accept: "application/json",
  },
});

export function setAuthorization(accessToken: string) {
  api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
}

export function clearAuthorization() {
  delete api.defaults.headers.common.Authorization;
}

export function clearAuthSession() {
  clearAuthTokens();
  clearAuthorization();
}

export function setSessionExpiredHandler(
  handler: SessionExpiredHandler | null,
) {
  sessionExpiredHandler = handler;
}

function expireSession() {
  clearAuthSession();
  sessionExpiredHandler?.();
}

function isRefreshRequest(config: RetryableRequestConfig) {
  return config.url?.split("?")[0].endsWith("/auth/refresh") ?? false;
}

function refreshAccessToken() {
  if (refreshPromise) return refreshPromise;

  const tokens = getAuthTokens();

  if (!tokens) {
    expireSession();
    return Promise.reject(new Error("Sessão expirada"));
  }

  refreshPromise = refreshApi
    .post<LoginResponse>("/auth/refresh", {
      refreshToken: tokens.refreshToken,
    })
    .then(({ data }) => {
      saveAuthTokens(data);
      setAuthorization(data.accessToken);

      return data.accessToken;
    })
    .catch((error: unknown) => {
      expireSession();
      throw error;
    })
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
}

api.interceptors.response.use(undefined, async (error: unknown) => {
  if (!axios.isAxiosError(error) || error.response?.status !== 401) {
    return Promise.reject(error);
  }

  const config = error.config as RetryableRequestConfig | undefined;

  if (!config || config._retry || isRefreshRequest(config)) {
    return Promise.reject(error);
  }

  config._retry = true;
  const accessToken = await refreshAccessToken();
  config.headers = AxiosHeaders.from(config.headers);
  config.headers.set("Authorization", `Bearer ${accessToken}`);

  return api(config);
});

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (!axios.isAxiosError(error)) return Promise.reject(error);

    const details: ApiErrorDetails = {
      status: error.response?.status ?? null,
      message: getResponseMessage(error.response?.data, error.message),
      url: getRequestUrl(error.config?.baseURL, error.config?.url),
    };

    console.error("Falha na requisição à API", details);

    return Promise.reject(new ApiRequestError(details));
  },
);
