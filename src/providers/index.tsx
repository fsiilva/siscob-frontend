"use client";

import type { PropsWithChildren } from "react";

import { AuthProvider } from "@/contexts/auth-context";

import { QueryProvider } from "./query-provider";

export function Providers({ children }: PropsWithChildren) {
  return (
    <QueryProvider>
      <AuthProvider>{children}</AuthProvider>
    </QueryProvider>
  );
}
