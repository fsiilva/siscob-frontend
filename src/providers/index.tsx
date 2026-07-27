"use client";

import type { PropsWithChildren } from "react";

import { QueryProvider } from "./query-provider";

export function Providers({ children }: PropsWithChildren) {
  return <QueryProvider>{children}</QueryProvider>;
}
