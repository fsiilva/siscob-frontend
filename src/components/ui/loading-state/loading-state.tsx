import { forwardRef, type HTMLAttributes } from "react";

import { cn } from "../utils";

/** Props do skeleton reutilizável. Inclua um `aria-label` no LoadingState pai. */
export type SkeletonProps = HTMLAttributes<HTMLDivElement>;

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(({ className, ...props }, ref) => (
  <div aria-hidden="true" className={cn("animate-pulse rounded-xl bg-slate-200", className)} ref={ref} {...props} />
));
Skeleton.displayName = "Skeleton";

/** Agrupa skeletons e anuncia o estado de carregamento. */
export interface LoadingStateProps extends HTMLAttributes<HTMLDivElement> {
  label?: string;
}

export function LoadingState({ children, className, label = "Carregando conteúdo", ...props }: LoadingStateProps) {
  return (
    <div aria-label={label} className={cn("space-y-3", className)} role="status" {...props}>
      <span className="sr-only">{label}</span>
      {children ?? <Skeleton className="h-24" />}
    </div>
  );
}
