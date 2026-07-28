"use client";

import type { PropsWithChildren } from "react";

import { CompanyProvider } from "@/context/company";
import { AuthProvider } from "@/contexts/auth-context";

import { QueryProvider } from "./query-provider";

export function Providers({ children }: PropsWithChildren) {
  return (
    <QueryProvider>
      <AuthProvider>
        <CompanyProvider>{children}</CompanyProvider>
      </AuthProvider>
    </QueryProvider>
  );
}
