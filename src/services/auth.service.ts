import type {
  AuthUser,
  LoginCredentials,
  LoginResponse,
} from "@/types/auth";

import { api } from "./api";

export function setAuthorization(accessToken: string) {
  api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
}

export function clearAuthorization() {
  delete api.defaults.headers.common.Authorization;
}

export async function login(
  credentials: LoginCredentials,
): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>("/auth/login", credentials);

  return data;
}

export async function getCurrentUser(): Promise<AuthUser> {
  const { data } = await api.get<AuthUser>("/auth/me");

  return data;
}

export async function logout(refreshToken: string): Promise<void> {
  await api.post("/auth/logout", { refreshToken });
}
