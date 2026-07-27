"use client";

import { LogOut, Menu, UserRound } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";

interface AppHeaderProps {
  onOpenMobileMenu: () => void;
  title: string;
}

const roleLabels = {
  ADMIN: "Administrador",
  USER: "Usuário",
} as const;

export function AppHeader({ onOpenMobileMenu, title }: AppHeaderProps) {
  const { user, logout } = useAuth();
  const userName = user?.name ?? "Usuário";
  const role = user?.role ? roleLabels[user.role] : null;

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between gap-4 border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <button
          aria-label="Abrir menu lateral"
          className="rounded-lg border border-slate-200 p-2.5 text-slate-700 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 md:hidden"
          onClick={onOpenMobileMenu}
          type="button"
        >
          <Menu aria-hidden="true" className="size-5" />
        </button>
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
            SisCob
          </p>
          <h1 className="truncate text-lg font-semibold text-slate-950 sm:text-xl">
            {title}
          </h1>
        </div>
      </div>

      <details className="group relative shrink-0">
        <summary className="flex cursor-pointer list-none items-center gap-3 rounded-xl border border-transparent px-2 py-1.5 transition hover:border-slate-200 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 [&::-webkit-details-marker]:hidden">
          <span className="hidden text-right sm:block">
            <span className="block max-w-44 truncate text-sm font-semibold text-slate-900">
              {userName}
            </span>
            {role ? (
              <span className="block text-xs text-slate-500">{role}</span>
            ) : null}
          </span>
          <span className="flex size-10 items-center justify-center rounded-full bg-blue-100 text-blue-800">
            <UserRound aria-hidden="true" className="size-5" />
          </span>
          <span className="sr-only">Abrir menu do usuário</span>
        </summary>

        <div className="absolute right-0 mt-2 w-64 rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
          <div className="border-b border-slate-100 px-3 py-2 sm:hidden">
            <p className="truncate text-sm font-semibold text-slate-900">{userName}</p>
            {role ? <p className="text-xs text-slate-500">{role}</p> : null}
          </div>
          <button
            aria-label="Sair da conta"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-700 transition hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700"
            onClick={() => void logout()}
            type="button"
          >
            <LogOut aria-hidden="true" className="size-4" />
            Sair da conta
          </button>
        </div>
      </details>
    </header>
  );
}
