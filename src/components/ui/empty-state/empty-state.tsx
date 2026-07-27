import { Inbox, type LucideIcon } from "lucide-react";
import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "../utils";

/** Props do estado vazio. `action` recebe uma ação opcional já construída. */
export interface EmptyStateProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  icon?: LucideIcon;
  action?: ReactNode;
}

export function EmptyState({ title, description, icon: Icon = Inbox, action, className, ...props }: EmptyStateProps) {
  return (
    <div className={cn("flex min-h-64 flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white px-6 text-center", className)} {...props}>
      <span className="rounded-full bg-slate-100 p-3 text-slate-600"><Icon aria-hidden="true" className="size-6" /></span>
      <h3 className="mt-4 text-lg font-semibold text-slate-950">{title}</h3>
      {description ? <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">{description}</p> : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
