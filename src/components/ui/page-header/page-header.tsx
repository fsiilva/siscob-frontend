import type { LucideIcon } from "lucide-react";
import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "../utils";

/** Props do cabeçalho padrão de página. */
export interface PageHeaderProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  eyebrow?: string;
  icon?: LucideIcon;
  actions?: ReactNode;
}

export function PageHeader({ title, description, eyebrow, icon: Icon, actions, className, ...props }: PageHeaderProps) {
  return (
    <div className={cn("flex min-w-0 items-start justify-between gap-4", className)} {...props}>
      <div className="flex min-w-0 flex-col items-start gap-3 sm:flex-row sm:gap-4">
        {Icon ? <span className="rounded-xl bg-blue-100 p-3 text-blue-700"><Icon aria-hidden="true" className="size-6" /></span> : null}
        <div className="min-w-0">
          {eyebrow ? <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">{eyebrow}</p> : null}
          <h1 className="mt-1 break-words text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">{title}</h1>
          {description ? <p className="mt-2 break-words text-sm leading-6 text-slate-600">{description}</p> : null}
        </div>
      </div>
      {actions ? <div className="shrink-0">{actions}</div> : null}
    </div>
  );
}
