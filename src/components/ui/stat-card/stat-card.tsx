import type { LucideIcon } from "lucide-react";
import type { HTMLAttributes, ReactNode } from "react";

import { Card } from "../card";
import { cn } from "../utils";

/** Props do card de indicador numérico. */
export interface StatCardProps extends HTMLAttributes<HTMLElement> {
  label: string;
  value: ReactNode;
  icon?: LucideIcon;
}

export function StatCard({ label, value, icon: Icon, className, ...props }: StatCardProps) {
  return (
    <Card className={cn("p-5", className)} data-slot="stat-card" {...props}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-slate-600">{label}</p>
        {Icon ? <Icon aria-hidden="true" className="size-5 text-blue-700" /> : null}
      </div>
      <p className="mt-3 text-2xl font-bold tracking-tight text-slate-950">{value}</p>
    </Card>
  );
}
