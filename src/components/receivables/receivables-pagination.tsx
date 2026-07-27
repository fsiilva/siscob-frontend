import { ChevronLeft, ChevronRight } from "lucide-react";

interface ReceivablesPaginationProps {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function ReceivablesPagination({
  page,
  pageSize,
  total,
  totalPages,
  onPageChange,
}: ReceivablesPaginationProps) {
  const firstItem = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const lastItem = Math.min(page * pageSize, total);
  const buttonClassName =
    "inline-flex min-h-10 items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <nav aria-label="Paginação dos recebíveis" className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-slate-600">
        Exibindo <strong>{firstItem}–{lastItem}</strong> de <strong>{total}</strong>
      </p>
      <div className="flex items-center justify-between gap-3 sm:justify-end">
        <button aria-label="Página anterior" className={buttonClassName} disabled={page <= 1} onClick={() => onPageChange(page - 1)} type="button">
          <ChevronLeft aria-hidden="true" className="size-4" />
          <span className="hidden sm:inline">Anterior</span>
        </button>
        <span className="whitespace-nowrap text-sm font-medium text-slate-700">
          Página {page} de {Math.max(totalPages, 1)}
        </span>
        <button aria-label="Próxima página" className={buttonClassName} disabled={page >= totalPages} onClick={() => onPageChange(page + 1)} type="button">
          <span className="hidden sm:inline">Próxima</span>
          <ChevronRight aria-hidden="true" className="size-4" />
        </button>
      </div>
    </nav>
  );
}
