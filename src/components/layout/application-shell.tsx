"use client";

import { useState, type PropsWithChildren } from "react";

import { AppHeader } from "./app-header";
import { AppSidebar } from "./app-sidebar";

interface ApplicationShellProps extends PropsWithChildren {
  title?: string;
}

export function ApplicationShell({
  children,
  title = "Dashboard Executivo",
}: ApplicationShellProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
          title={title}
        />
        <main className="flex min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
