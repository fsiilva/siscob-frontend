"use client";

import { useEffect, useState, type PropsWithChildren } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useAuth } from "@/hooks/useAuth";

import { AppHeader } from "./app-header";
import { AppSidebar } from "./app-sidebar";

interface ApplicationShellProps extends PropsWithChildren {
  title?: string;
}

export function ApplicationShell({
  children,
  title,
}: ApplicationShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pageTitle =
    title ??
    (pathname.startsWith("/customers")
      ? "Customer 360"
      : pathname.startsWith("/receivables")
        ? "Carteira de Recebíveis"
        : pathname.startsWith("/operations") || pathname.startsWith("/operation")
          ? "Minha Operação"
        : "Dashboard Executivo");

  useEffect(() => {
    if (!isLoading && !user) router.replace("/login");
  }, [isLoading, router, user]);

  if (isLoading || !user) {
    return <div aria-live="polite" className="flex min-h-screen items-center justify-center bg-slate-100 text-sm text-slate-600" role="status">Verificando autenticação...</div>;
  }

  return (
    <div className="flex min-h-screen w-full overflow-x-hidden bg-slate-100 text-slate-950">
      <AppSidebar
        collapsed={sidebarCollapsed}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
        onToggleCollapsed={() => setSidebarCollapsed((current) => !current)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <AppHeader
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          title={pageTitle}
        />
        <main className="flex min-w-0 max-w-full flex-1 overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
