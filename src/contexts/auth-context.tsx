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
  getAuthTokens,
  saveAuthTokens,
} from "@/lib/auth-storage";
import {
  getCurrentUser,
  login as requestLogin,
  logout as requestLogout,
} from "@/services/auth.service";
import {
  clearAuthSession,
  setAuthorization,
  setSessionExpiredHandler,
} from "@/services/api";
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
    clearAuthSession();
    setUser(null);
  }, []);

  useEffect(() => {
    setSessionExpiredHandler(() => {
      setUser(null);
      setIsLoading(false);
      router.replace("/login");
    });

    const tokens = getAuthTokens();

    if (!tokens) {
      clearSession();
      setIsLoading(false);
      return () => setSessionExpiredHandler(null);
    }

    setAuthorization(tokens.accessToken);

    getCurrentUser()
      .then(setUser)
      .catch(clearSession)
      .finally(() => setIsLoading(false));

    return () => setSessionExpiredHandler(null);
  }, [clearSession, router]);

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
