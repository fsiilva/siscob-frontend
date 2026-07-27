"use client";

import { Search } from "lucide-react";
import type { FormEvent } from "react";

import type { ReceivableStatus } from "@/types/receivables";

export interface ReceivableFilterValues {
  search: string;
  companyId: string;
  status: "" | ReceivableStatus;
  dueStart: string;
  dueEnd: string;
  overdueDaysMin: string;
  overdueDaysMax: string;
}

interface ReceivablesFiltersProps {
  values: ReceivableFilterValues;
  onChange: (values: ReceivableFilterValues) => void;
  onSubmit: () => void;
}

const inputClassName =
  "mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100";

export function ReceivablesFilters({
  values,
  onChange,
  onSubmit,
}: ReceivablesFiltersProps) {
  function update<Key extends keyof ReceivableFilterValues>(
    key: Key,
    value: ReceivableFilterValues[Key],
  ) {
    onChange({ ...values, [key]: value });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit();
  }

  return (
    <form
      className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
      onSubmit={handleSubmit}
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <label className="text-sm font-medium text-slate-700 sm:col-span-2">
          Pesquisa
          <input
            className={inputClassName}
            onChange={(event) => update("search", event.target.value)}
            placeholder="Cliente, CPF/CNPJ ou documento"
            type="search"
            value={values.search}
          />
        </label>

        <label className="text-sm font-medium text-slate-700">
          Empresa
          <input
            className={inputClassName}
            min="1"
            onChange={(event) => update("companyId", event.target.value)}
            placeholder="Código da empresa"
            type="number"
            value={values.companyId}
          />
        </label>

        <label className="text-sm font-medium text-slate-700">
          Status
          <select
            className={inputClassName}
            onChange={(event) => update("status", event.target.value as ReceivableFilterValues["status"])}
            value={values.status}
          >
            <option value="">Todos</option>
            <option value="OPEN">Em aberto</option>
            <option value="PAID">Pago</option>
            <option value="CANCELED">Cancelado</option>
          </select>
        </label>

        <label className="text-sm font-medium text-slate-700">
          Vencimento inicial
          <input className={inputClassName} onChange={(event) => update("dueStart", event.target.value)} type="date" value={values.dueStart} />
        </label>

        <label className="text-sm font-medium text-slate-700">
          Vencimento final
          <input className={inputClassName} onChange={(event) => update("dueEnd", event.target.value)} type="date" value={values.dueEnd} />
        </label>

        <label className="text-sm font-medium text-slate-700">
          Atraso mínimo
          <input className={inputClassName} min="0" onChange={(event) => update("overdueDaysMin", event.target.value)} placeholder="Dias" type="number" value={values.overdueDaysMin} />
        </label>

        <label className="text-sm font-medium text-slate-700">
          Atraso máximo
          <input className={inputClassName} min="0" onChange={(event) => update("overdueDaysMax", event.target.value)} placeholder="Dias" type="number" value={values.overdueDaysMax} />
        </label>
      </div>

      <div className="mt-5 flex justify-end">
        <button className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-blue-700 px-5 text-sm font-semibold text-white transition hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700" type="submit">
          <Search aria-hidden="true" className="size-4" />
          Pesquisar
        </button>
      </div>
    </form>
  );
}
