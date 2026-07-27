import { forwardRef, type HTMLAttributes } from "react";

import { cn } from "../utils";

/** Props do contêiner Card. */
export type CardProps = HTMLAttributes<HTMLDivElement>;

export const Card = forwardRef<HTMLDivElement, CardProps>(({ className, ...props }, ref) => (
  <div className={cn("rounded-xl border border-slate-200 bg-white shadow-sm", className)} ref={ref} {...props} />
));
Card.displayName = "Card";

export const CardHeader = forwardRef<HTMLDivElement, CardProps>(({ className, ...props }, ref) => (
  <div className={cn("p-5 pb-0", className)} ref={ref} {...props} />
));
CardHeader.displayName = "CardHeader";

export const CardContent = forwardRef<HTMLDivElement, CardProps>(({ className, ...props }, ref) => (
  <div className={cn("p-5", className)} ref={ref} {...props} />
));
CardContent.displayName = "CardContent";
