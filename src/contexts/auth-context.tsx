"use client";

import { useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";

import {
  clearAuthTokens,
  getAuthTokens,
  saveAuthTokens,
} from "@/lib/auth-storage";
import {
  clearAuthorization,
  getCurrentUser,
  login as requestLogin,
  logout as requestLogout,
  setAuthorization,
} from "@/services/auth.service";
import type {
  AuthContextValue,
  AuthUser,
  LoginCredentials,
} from "@/types/auth";

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const clearSession = useCallback(() => {
    clearAuthTokens();
    clearAuthorization();
    setUser(null);
  }, []);

  useEffect(() => {
    const tokens = getAuthTokens();

    if (!tokens) {
      clearSession();
      setIsLoading(false);
      return;
    }

    setAuthorization(tokens.accessToken);

    getCurrentUser()
      .then(setUser)
      .catch(clearSession)
      .finally(() => setIsLoading(false));
  }, [clearSession]);

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      const tokens = await requestLogin(credentials);

      saveAuthTokens(tokens);
      setAuthorization(tokens.accessToken);

      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        router.push("/");
      } catch (error) {
        clearSession();
        throw error;
      }
    },
    [clearSession, router],
  );

  const logout = useCallback(async () => {
    const tokens = getAuthTokens();

    try {
      if (tokens) await requestLogout(tokens.refreshToken);
    } finally {
      clearSession();
      router.push("/login");
    }
  }, [clearSession, router]);

  const value = useMemo(
    () => ({ user, isLoading, login, logout }),
    [isLoading, login, logout, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
