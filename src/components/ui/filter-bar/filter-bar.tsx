import { forwardRef, type FormHTMLAttributes } from "react";

import { cn } from "../utils";

/** Props do formulário visual de filtros. */
export type FilterBarProps = FormHTMLAttributes<HTMLFormElement>;

export const FilterBar = forwardRef<HTMLFormElement, FilterBarProps>(({ className, ...props }, ref) => (
  <form className={cn("rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5", className)} ref={ref} {...props} />
));
FilterBar.displayName = "FilterBar";
