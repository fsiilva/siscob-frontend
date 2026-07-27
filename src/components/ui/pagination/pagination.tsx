import { ChevronLeft, ChevronRight } from "lucide-react";
import type { HTMLAttributes } from "react";

import { Button } from "../button";
import { cn } from "../utils";

/** Props da paginação controlada por API. */
export interface PaginationProps extends HTMLAttributes<HTMLElement> {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  previousLabel?: string;
  nextLabel?: string;
}

export function Pagination({ page, totalPages, onPageChange, previousLabel = "Anterior", nextLabel = "Próxima", className, ...props }: PaginationProps) {
  return (
    <nav aria-label="Paginação" className={cn("flex items-center justify-end gap-3", className)} {...props}>
      <Button aria-label="Página anterior" disabled={page <= 1} onClick={() => onPageChange(page - 1)} variant="secondary">
        <ChevronLeft aria-hidden="true" className="size-4" /><span className="hidden sm:inline">{previousLabel}</span>
      </Button>
      <span className="whitespace-nowrap text-sm font-medium text-slate-700">Página {page} de {Math.max(totalPages, 1)}</span>
      <Button aria-label="Próxima página" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)} variant="secondary">
        <span className="hidden sm:inline">{nextLabel}</span><ChevronRight aria-hidden="true" className="size-4" />
      </Button>
    </nav>
  );
}
