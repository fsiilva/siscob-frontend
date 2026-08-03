"use client";

import type { PropsWithChildren } from "react";
import { Toaster } from "sonner";

import { CompanyProvider } from "@/context/company";
import { AuthProvider } from "@/contexts/auth-context";
import { NextActionsProvider } from "@/contexts/next-actions-context";
import { TimelineProvider } from "@/contexts/timeline-context";

import { QueryProvider } from "./query-provider";

export function Providers({ children }: PropsWithChildren) {
  return (
    <QueryProvider>
      <AuthProvider>
        <CompanyProvider>
          <TimelineProvider>
            <NextActionsProvider>{children}</NextActionsProvider>
            <Toaster position="top-right" richColors />
          </TimelineProvider>
        </CompanyProvider>
      </AuthProvider>
    </QueryProvider>
  );
}
