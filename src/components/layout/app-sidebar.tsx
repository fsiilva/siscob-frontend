"use client";

import {
  BarChart3,
  BriefcaseBusiness,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  LayoutDashboard,
  ShieldCheck,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";

interface NavigationItem {
  label: string;
  icon: LucideIcon;
  href?: string;
}

const navigationItems: NavigationItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/" },
  { label: "Carteira", icon: BriefcaseBusiness },
  { label: "Clientes", icon: Users },
  { label: "Cobranças", icon: CircleDollarSign },
  { label: "Analytics", icon: BarChart3 },
  { label: "Administração", icon: ShieldCheck },
];

interface AppSidebarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  onToggleCollapsed: () => void;
}

function Navigation({ collapsed, onNavigate }: { collapsed: boolean; onNavigate?: () => void }) {
  return (
    <nav aria-label="Navegação principal" className="flex-1 space-y-1 px-3 py-6">
      {navigationItems.map(({ label, icon: Icon, href }) => {
        const content = (
          <>
            <Icon aria-hidden="true" className="size-5 shrink-0" />
            <span className={collapsed ? "sr-only" : "truncate"}>{label}</span>
          </>
        );
        const className = `flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
          href
            ? "bg-blue-700 text-white shadow-sm hover:bg-blue-600"
            : "cursor-not-allowed text-slate-400"
        } ${collapsed ? "justify-center" : ""}`;

        return href ? (
          <Link
            aria-current="page"
            className={className}
            href={href}
            key={label}
            onClick={onNavigate}
            title={collapsed ? label : undefined}
          >
            {content}
          </Link>
        ) : (
          <button
            aria-disabled="true"
            className={className}
            disabled
            key={label}
            title={`${label} — em breve`}
            type="button"
          >
            {content}
          </button>
        );
      })}
    </nav>
  );
}

function SidebarContent({
  collapsed,
  mobile,
  onCloseMobile,
  onToggleCollapsed,
}: {
  collapsed: boolean;
  mobile?: boolean;
  onCloseMobile: () => void;
  onToggleCollapsed: () => void;
}) {
  return (
    <>
      <div className="flex h-20 items-center justify-between border-b border-slate-800 px-4">
        <div className={`flex items-center gap-3 ${collapsed ? "mx-auto" : ""}`}>
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-sm font-bold text-white shadow-lg shadow-blue-950/30">
            SC
          </span>
          {collapsed ? null : (
            <div>
              <p className="font-bold tracking-tight text-white">SisCob</p>
              <p className="text-xs text-slate-400">Gestão de cobrança</p>
            </div>
          )}
        </div>

        {mobile ? (
          <button
            aria-label="Fechar menu"
            className="rounded-lg p-2 text-slate-300 hover:bg-slate-800 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            onClick={onCloseMobile}
            type="button"
          >
            <X aria-hidden="true" className="size-5" />
          </button>
        ) : null}
      </div>

      <Navigation
        collapsed={collapsed}
        onNavigate={mobile ? onCloseMobile : undefined}
      />

      {mobile ? null : (
        <div className="border-t border-slate-800 p-3">
          <button
            aria-label={collapsed ? "Expandir menu lateral" : "Recolher menu lateral"}
            className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            onClick={onToggleCollapsed}
            type="button"
          >
            {collapsed ? (
              <ChevronRight aria-hidden="true" className="size-5" />
            ) : (
              <>
                <ChevronLeft aria-hidden="true" className="size-5" />
                <span>Recolher menu</span>
              </>
            )}
          </button>
        </div>
      )}
    </>
  );
}

export function AppSidebar({
  collapsed,
  mobileOpen,
  onCloseMobile,
  onToggleCollapsed,
}: AppSidebarProps) {
  return (
    <>
      <aside
        className={`sticky top-0 hidden h-screen shrink-0 flex-col bg-slate-950 transition-[width] duration-200 md:flex ${
          collapsed ? "w-20" : "w-64"
        }`}
      >
        <SidebarContent
          collapsed={collapsed}
          onCloseMobile={onCloseMobile}
          onToggleCollapsed={onToggleCollapsed}
        />
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            aria-label="Fechar menu lateral"
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            onClick={onCloseMobile}
            type="button"
          />
          <aside
            aria-label="Menu lateral"
            className="relative flex h-full w-[min(19rem,85vw)] flex-col bg-slate-950 shadow-2xl"
          >
            <SidebarContent
              collapsed={false}
              mobile
              onCloseMobile={onCloseMobile}
              onToggleCollapsed={onToggleCollapsed}
            />
          </aside>
        </div>
      ) : null}
    </>
  );
}
