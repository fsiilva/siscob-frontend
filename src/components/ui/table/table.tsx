import { forwardRef, type HTMLAttributes, type TableHTMLAttributes, type TdHTMLAttributes, type ThHTMLAttributes } from "react";

import { cn } from "../utils";

/** Props da tabela semântica. */
export type TableProps = TableHTMLAttributes<HTMLTableElement>;
/** Props das seções e linhas da tabela. */
export type TableSectionProps = HTMLAttributes<HTMLTableSectionElement>;
export type TableRowProps = HTMLAttributes<HTMLTableRowElement>;
export type TableHeadProps = ThHTMLAttributes<HTMLTableCellElement>;
export type TableCellProps = TdHTMLAttributes<HTMLTableCellElement>;

export const TableContainer = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div className={cn("max-w-full overflow-x-auto", className)} ref={ref} {...props} />,
);
TableContainer.displayName = "TableContainer";

export const Table = forwardRef<HTMLTableElement, TableProps>(({ className, ...props }, ref) => (
  <table className={cn("w-full border-collapse text-left text-sm", className)} ref={ref} {...props} />
));
Table.displayName = "Table";

export const TableHeader = forwardRef<HTMLTableSectionElement, TableSectionProps>(({ className, ...props }, ref) => (
  <thead className={cn("bg-slate-50 text-xs uppercase tracking-wider text-slate-600", className)} ref={ref} {...props} />
));
TableHeader.displayName = "TableHeader";

export const TableBody = forwardRef<HTMLTableSectionElement, TableSectionProps>(({ className, ...props }, ref) => (
  <tbody className={cn("divide-y divide-slate-100", className)} ref={ref} {...props} />
));
TableBody.displayName = "TableBody";

export const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(({ className, ...props }, ref) => (
  <tr className={cn("transition hover:bg-slate-50/80", className)} ref={ref} {...props} />
));
TableRow.displayName = "TableRow";

export const TableHead = forwardRef<HTMLTableCellElement, TableHeadProps>(({ className, scope = "col", ...props }, ref) => (
  <th className={cn("px-5 py-4 font-semibold", className)} ref={ref} scope={scope} {...props} />
));
TableHead.displayName = "TableHead";

export const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(({ className, ...props }, ref) => (
  <td className={cn("px-5 py-4", className)} ref={ref} {...props} />
));
TableCell.displayName = "TableCell";
