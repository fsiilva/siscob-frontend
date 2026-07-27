"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useReceivables } from "@/hooks/useReceivables";
import type { ReceivablesQuery } from "@/types/receivables";

import { ReceivableDetailsDrawer } from "./receivable-details-drawer";
import { ReceivablesFilters, type ReceivableFilterValues } from "./receivables-filters";
import { ReceivablesKpis } from "./receivables-kpis";
import { ReceivablesPageHeader } from "./receivables-page-header";
import { ReceivablesPagination } from "./receivables-pagination";
import { ReceivablesLoading, ReceivablesMessage } from "./receivables-states";
import { ReceivablesTable } from "./receivables-table";

const PAGE_SIZE = 20;
const initialFilters: ReceivableFilterValues = {
  search: "",
  companyId: "",
  status: "",
  dueStart: "",
  dueEnd: "",
  overdueDaysMin: "",
  overdueDaysMax: "",
};

function optionalNumber(value: string) {
  return value === "" ? undefined : Number(value);
}

export function ReceivablesPage() {
  const [page, setPage] = useState(1);
  const [selectedReceivableId, setSelectedReceivableId] = useState<number | null>(null);
  const [draftFilters, setDraftFilters] = useState(initialFilters);
  const [appliedFilters, setAppliedFilters] = useState(initialFilters);
  const drawerTriggerRef = useRef<HTMLButtonElement | null>(null);
  const debouncedSearch = useDebouncedValue(draftFilters.search.trim(), 500);

  useEffect(() => {
    setAppliedFilters((current) => ({ ...current, search: debouncedSearch }));
    setPage(1);
  }, [debouncedSearch]);

  const query = useMemo<ReceivablesQuery>(
    () => ({
      page,
      pageSize: PAGE_SIZE,
      search: appliedFilters.search || undefined,
      companyId: optionalNumber(appliedFilters.companyId),
      status: appliedFilters.status || undefined,
      dueStart: appliedFilters.dueStart || undefined,
      dueEnd: appliedFilters.dueEnd || undefined,
      overdueDaysMin: optionalNumber(appliedFilters.overdueDaysMin),
      overdueDaysMax: optionalNumber(appliedFilters.overdueDaysMax),
    }),
    [appliedFilters, page],
  );
  const { data, isLoading, isError, isFetching, refetch } = useReceivables(query);

  function applyFilters() {
    setAppliedFilters({ ...draftFilters, search: draftFilters.search.trim() });
    setPage(1);
  }

  function openDetails(id: number, trigger: HTMLButtonElement) {
    drawerTriggerRef.current = trigger;
    setSelectedReceivableId(id);
  }

  const closeDetails = useCallback(() => {
    setSelectedReceivableId(null);
    window.requestAnimationFrame(() => drawerTriggerRef.current?.focus());
  }, []);

  return (
    <div className="mx-auto flex min-w-0 w-full max-w-full flex-1 flex-col gap-6 overflow-hidden px-4 py-6 sm:px-6 sm:py-8 lg:max-w-[1600px] lg:px-8">
      <ReceivablesPageHeader />
      <ReceivablesKpis data={data?.data ?? []} />
      <ReceivablesFilters values={draftFilters} onChange={setDraftFilters} onSubmit={applyFilters} />

      {isLoading ? <ReceivablesLoading /> : null}
      {isError ? <ReceivablesMessage type="error" onRetry={() => void refetch()} /> : null}
      {!isLoading && !isError && data?.data.length === 0 ? <ReceivablesMessage type="empty" /> : null}
      {data?.data.length ? (
        <div className={`space-y-4 transition-opacity ${isFetching ? "opacity-60" : "opacity-100"}`} aria-busy={isFetching}>
          <ReceivablesTable data={data.data} onViewDetails={openDetails} />
          <ReceivablesPagination {...data.pagination} onPageChange={setPage} />
        </div>
      ) : null}
      <ReceivableDetailsDrawer
        onClose={closeDetails}
        receivableId={selectedReceivableId}
      />
    </div>
  );
}
