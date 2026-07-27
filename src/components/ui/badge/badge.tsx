import { forwardRef, type HTMLAttributes } from "react";

import { cn } from "../utils";

export type BadgeVariant = "open" | "paid" | "canceled" | "warning" | "success" | "danger";

/** Props do badge semântico. */
export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variants: Record<BadgeVariant, string> = {
  open: "bg-amber-50 text-amber-800 ring-amber-200",
  paid: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  canceled: "bg-slate-100 text-slate-700 ring-slate-200",
  warning: "bg-amber-50 text-amber-800 ring-amber-200",
  success: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  danger: "bg-red-50 text-red-800 ring-red-200",
};

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(({ className, variant = "open", ...props }, ref) => (
  <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset", variants[variant], className)} ref={ref} {...props} />
));
Badge.displayName = "Badge";
