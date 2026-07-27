import type { PropsWithChildren } from "react";

export function MainLayout({ children }: PropsWithChildren) {
  return (
    <main className="flex min-h-screen bg-slate-100 text-slate-950">
      {children}
    </main>
  );
}
