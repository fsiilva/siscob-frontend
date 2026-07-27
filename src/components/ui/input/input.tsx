import { forwardRef, type InputHTMLAttributes } from "react";

import { cn } from "../utils";

/** Props do campo de entrada. Use `aria-invalid` para comunicar erros. */
export type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => (
  <input
    className={cn(
      "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100 aria-[invalid=true]:border-red-600",
      className,
    )}
    ref={ref}
    {...props}
  />
));
Input.displayName = "Input";
