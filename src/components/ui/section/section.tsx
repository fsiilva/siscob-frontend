import { forwardRef, type HTMLAttributes } from "react";

import { cn } from "../utils";

/** Props de uma seção semântica com título opcional. */
export interface SectionProps extends HTMLAttributes<HTMLElement> {
  title?: string;
}

export const Section = forwardRef<HTMLElement, SectionProps>(({ title, children, className, ...props }, ref) => (
  <section className={cn("min-w-0", className)} ref={ref} {...props}>
    {title ? <h2 className="text-sm font-semibold text-slate-950">{title}</h2> : null}
    {children}
  </section>
));
Section.displayName = "Section";
