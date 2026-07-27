"use client";

import { X } from "lucide-react";
import { useEffect, useId, useRef, type KeyboardEvent, type ReactNode } from "react";

import { cn } from "../utils";

/** Props do drawer modal. O componente gerencia ESC, backdrop, foco e scroll externo. */
export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  eyebrow?: string;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  closeLabel?: string;
}

export function Drawer({
  open,
  onClose,
  title,
  eyebrow,
  children,
  className,
  contentClassName,
  closeLabel = "Fechar painel",
}: DrawerProps) {
  const titleId = useId();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    function handleEscape(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose, open]);

  if (!open) return null;

  function trapFocus(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "Tab" || !panelRef.current) return;
    const focusable = Array.from(
      panelRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      ),
    );
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  return (
    <div className="fixed inset-0 z-50">
      <button aria-label={closeLabel} className="absolute inset-0 bg-slate-950/50 backdrop-blur-[1px]" onClick={onClose} tabIndex={-1} type="button" />
      <div
        aria-labelledby={titleId}
        aria-modal="true"
        className={cn("absolute inset-y-0 right-0 flex w-full flex-col bg-white shadow-2xl sm:w-[480px]", className)}
        onKeyDown={trapFocus}
        ref={panelRef}
        role="dialog"
      >
        <header className="flex shrink-0 items-start justify-between gap-4 border-b border-slate-200 px-5 py-5 sm:px-6">
          <div className="min-w-0">
            {eyebrow ? <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">{eyebrow}</p> : null}
            <h2 className="mt-1 truncate text-xl font-bold text-slate-950" id={titleId}>{title}</h2>
          </div>
          <button aria-label={closeLabel} className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700" onClick={onClose} ref={closeButtonRef} type="button">
            <X aria-hidden="true" className="size-5" />
          </button>
        </header>
        <div className={cn("min-h-0 flex-1 overflow-y-auto px-5 sm:px-6", contentClassName)}>{children}</div>
      </div>
    </div>
  );
}
