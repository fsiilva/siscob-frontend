import { forwardRef, type SelectHTMLAttributes } from "react";

import { cn } from "../utils";

/** Props do select nativo acessível. */
export type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;

export const Select = forwardRef<HTMLSelectElement, SelectProps>(({ className, ...props }, ref) => (
  <select
    className={cn(
      "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100",
      className,
    )}
    ref={ref}
    {...props}
  />
));
Select.displayName = "Select";
