"use client";

import { useMemo, useState } from "react";

import { Button, Drawer, Input, Select } from "@/components/ui";
import { useCompany } from "@/context/company";
import { useCompanies } from "@/hooks/useCompanies";
import { useCustomers } from "@/hooks/useCustomers";
import { useCreateOperation } from "@/hooks/useOperations";
import { usePortfolios } from "@/hooks/usePortfolios";
import { useReceivables } from "@/hooks/useReceivables";
import type { OperationPriority, OperationResponse } from "@/types/operations-api";

import { buildCompanyOptions } from "../portfolios/build-company-options";
import { buildCreateOperationRequest, changeCreateOperationCompany, changeCreateOperationCustomer, createOperationErrorMessage, initialCreateOperationValues, isCreateOperationValid, type CreateOperationValues } from "./create-operation-form";

export interface CreateOperationContext {
  customerId: number;
  customerName: string;
  companyId: number;
  companyName: string | null;
  receivableId: number;
  suggestedPriority: OperationPriority;
}

export function CreateOperationDrawer({ context, onClose, onCreated }: { context?: CreateOperationContext; onClose(): void; onCreated(operation: OperationResponse): void }) {
  const { assignedCompanies, availableCompanies, selectedCompany } = useCompany();
  const [values, setValues] = useState<CreateOperationValues>(() => ({
    ...initialCreateOperationValues,
    companyId: context ? String(context.companyId) : selectedCompany ? String(selectedCompany.id) : "",
    customerId: context ? String(context.customerId) : "",
    receivableId: context ? String(context.receivableId) : "",
    priority: context?.suggestedPriority ?? initialCreateOperationValues.priority,
  }));
  const [customerSearch, setCustomerSearch] = useState("");
  const customersQuery = useCustomers({ search: customerSearch, page: 1, pageSize: 50 }, !context);
  const companiesQuery = useCompanies({ active: true });
  const portfoliosQuery = usePortfolios(values.companyId);
  const selectedCustomer = context ? { id: context.customerId, name: context.customerName } : customersQuery.data?.data.find((customer) => String(customer.id) === values.customerId);
  const companyId = Number(values.companyId);
  const canLoadReceivables = Boolean(selectedCustomer && Number.isInteger(companyId) && companyId > 0);
  const compatibleReceivablesQuery = useReceivables(
    {
      page: 1,
      pageSize: 100,
      ...(Number.isInteger(companyId) && companyId > 0 ? { companyId } : {}),
      ...(selectedCustomer ? { search: selectedCustomer.name } : {}),
    },
    canLoadReceivables && !context,
  );
  const mutation = useCreateOperation();
  const companies = useMemo(
    () => buildCompanyOptions(
      [...assignedCompanies, ...availableCompanies, ...(selectedCompany ? [selectedCompany] : []), ...(context ? [{ id: context.companyId, code: "", name: context.companyName ?? "Empresa não informada" }] : [])],
      companiesQuery.data?.data ?? [],
    ),
    [assignedCompanies, availableCompanies, companiesQuery.data, context, selectedCompany],
  );
  const receivables = (compatibleReceivablesQuery.data?.data ?? []).filter((receivable) => (
    String(receivable.customerId) === values.customerId && String(receivable.companyId) === values.companyId
  ));

  function update<Key extends keyof CreateOperationValues>(key: Key, value: CreateOperationValues[Key]) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  async function submit() {
    if (!isCreateOperationValid(values)) return;
    try {
      const operation = await mutation.mutateAsync(buildCreateOperationRequest(values));
      onCreated(operation);
    } catch {
      // A mutation mantém o erro para apresentação e permite nova tentativa.
    }
  }

  return (
    <Drawer className="sm:w-[560px]" onClose={onClose} open title="Nova Operation">
      <form className="space-y-5 py-5" onSubmit={(event) => { event.preventDefault(); void submit(); }}>
        <Field label="Empresa"><Select disabled={Boolean(context) || companiesQuery.isLoading} required value={values.companyId} onChange={(event) => setValues((current) => changeCreateOperationCompany(current, event.target.value))}><option value="">{companiesQuery.isLoading ? "Carregando empresas..." : companies.length ? "Selecione a empresa" : "Nenhuma empresa disponível"}</option>{companies.map((company) => <option key={company.id} value={company.id}>{company.name}{company.code ? ` (${company.code})` : ""}</option>)}</Select></Field>
        <Field label="Carteira"><Select disabled={!values.companyId || portfoliosQuery.isLoading} required value={values.portfolioId} onChange={(event) => update("portfolioId", event.target.value)}><option value="">{portfoliosQuery.isLoading ? "Carregando carteiras..." : "Selecione a carteira"}</option>{portfoliosQuery.data?.map((portfolio) => <option key={portfolio.id} value={portfolio.id}>{portfolio.name} ({portfolio.code})</option>)}</Select></Field>
        {!context ? <Field label="Pesquisar Customer"><Input placeholder="Nome, CPF ou CNPJ" type="search" value={customerSearch} onChange={(event) => setCustomerSearch(event.target.value)} /></Field> : null}
        <Field label="Customer"><Select disabled={Boolean(context)} required value={values.customerId} onChange={(event) => setValues((current) => changeCreateOperationCustomer(current, event.target.value))}><option value="">Selecione o Customer</option>{context ? <option value={context.customerId}>{context.customerName}</option> : customersQuery.data?.data.map((customer) => <option key={customer.id} value={customer.id}>{customer.tradeName || customer.name}</option>)}</Select></Field>
        <Field label="Receivable (opcional)"><Select disabled={Boolean(context) || !values.customerId} value={values.receivableId} onChange={(event) => update("receivableId", event.target.value)}><option value="">Sem Receivable</option>{context ? <option value={context.receivableId}>Título {context.receivableId}</option> : receivables.map((receivable) => <option key={receivable.id} value={receivable.id}>{receivable.document || `Título ${receivable.id}`} — {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(receivable.balance)}</option>)}</Select></Field>
        <Field label="Objetivo operacional"><textarea className="min-h-28 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100" maxLength={1000} required value={values.objective} onChange={(event) => update("objective", event.target.value)} /><span className="mt-1 block text-right text-xs text-slate-500">{values.objective.length}/1000</span></Field>
        <Field label="Prioridade"><Select required value={values.priority} onChange={(event) => update("priority", event.target.value as CreateOperationValues["priority"])}><option value="LOW">Baixa</option><option value="NORMAL">Normal</option><option value="HIGH">Alta</option><option value="URGENT">Urgente</option></Select></Field>
        {companiesQuery.isError ? <div className="flex items-center justify-between gap-3 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800" role="alert"><span>Não foi possível carregar todas as empresas. As empresas já disponíveis continuam acessíveis.</span><Button onClick={() => void companiesQuery.refetch()} variant="secondary">Tentar novamente</Button></div> : null}
        {portfoliosQuery.isError || customersQuery.isError || compatibleReceivablesQuery.isError ? <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800" role="alert">Não foi possível carregar todos os dados de seleção. Tente novamente.</p> : null}
        {mutation.error ? <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">{createOperationErrorMessage(mutation.error)}</p> : null}
        <div className="flex justify-end gap-2 border-t border-slate-200 pt-4"><Button onClick={onClose} variant="secondary">Cancelar</Button><Button disabled={!isCreateOperationValid(values)} loading={mutation.isPending} type="submit">Criar Operation</Button></div>
      </form>
    </Drawer>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return <label className="block text-sm font-medium text-slate-700">{label}{hint ? <span className="mb-1 block text-xs font-normal text-slate-500">{hint}</span> : null}<span className="mt-1.5 block">{children}</span></label>;
}
