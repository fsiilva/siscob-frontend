import { forwardRef, type HTMLAttributes } from "react";

import { cn } from "../utils";

/** Props da barra horizontal de ações. */
export type ToolbarProps = HTMLAttributes<HTMLDivElement>;

export const Toolbar = forwardRef<HTMLDivElement, ToolbarProps>(({ className, role = "toolbar", ...props }, ref) => (
  <div className={cn("flex flex-wrap items-center justify-between gap-3", className)} ref={ref} role={role} {...props} />
));
Toolbar.displayName = "Toolbar";
