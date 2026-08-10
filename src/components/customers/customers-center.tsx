"use client";

import { AlertTriangle, RefreshCw, Search, Users, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button, Card, EmptyState, Input, LoadingState, PageHeader, Pagination, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableHeader, TableRow } from "@/components/ui";
import { useCustomers } from "@/hooks/useCustomers";
import { getSafeApiErrorMessage } from "@/lib/api-error-message";
import type { CustomersQuery } from "@/types/customers";

import { customerDisplayName, customerDocument, customerEmail, customerPhone } from "./customers-center.presenter";

const PAGE_SIZE = 20;
const initialQuery: CustomersQuery = { search: "", page: 1, pageSize: PAGE_SIZE };

export function CustomersCenter() {
  const router = useRouter();
  const [draftSearch, setDraftSearch] = useState("");
  const [params, setParams] = useState<CustomersQuery>(initialQuery);
  const hasSearch = Boolean(params.search);
  const query = useCustomers(params, hasSearch);

  function search() {
    const value = draftSearch.trim();
    if (value === params.search && params.page === 1 && value) void query.refetch();
    else setParams({ search: value, page: 1, pageSize: PAGE_SIZE });
  }

  function clear() {
    setDraftSearch("");
    setParams(initialQuery);
  }

  return <div className="mx-auto flex min-w-0 w-full max-w-[1600px] flex-1 flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
    <PageHeader description="Consulte clientes e acesse a visão consolidada de cobrança." eyebrow="Cadastro" icon={Users} title="Clientes" />

    <Card className="p-4"><form className="flex flex-col gap-3 sm:flex-row" onSubmit={(event) => { event.preventDefault(); search(); }}>
      <Input aria-label="Pesquisar clientes" className="flex-1" onChange={(event) => setDraftSearch(event.target.value)} placeholder="Nome, CPF ou CNPJ" type="search" value={draftSearch} />
      <Button type="submit"><Search aria-hidden className="size-4" />Pesquisar</Button>
      <Button disabled={!draftSearch && !hasSearch} onClick={clear} variant="secondary"><X aria-hidden className="size-4" />Limpar</Button>
    </form></Card>

    {!hasSearch ? <EmptyState description="Informe nome, CPF ou CNPJ para consultar o cadastro Sisloc." icon={Search} title="Pesquise por um cliente para começar." /> : null}
    {query.isLoading ? <LoadingState label="Carregando clientes"><Skeleton className="h-80" /></LoadingState> : null}
    {query.isError ? <EmptyState action={<Button onClick={() => void query.refetch()}><RefreshCw aria-hidden className="size-4" />Tentar novamente</Button>} description={getCustomersErrorMessage(query.error)} icon={AlertTriangle} title="Não foi possível pesquisar clientes" /> : null}
    {query.data?.data.length === 0 ? <EmptyState description="Revise a pesquisa e tente novamente." title="Nenhum cliente encontrado para os critérios informados." /> : null}
    {query.data?.data.length ? <div className="space-y-4">
      <p className="text-sm text-slate-600">{query.data.pagination.total.toLocaleString("pt-BR")} cliente(s) encontrado(s).</p>
      <Card className={`overflow-hidden transition-opacity ${query.isFetching ? "opacity-60" : ""}`}><TableContainer><Table className="min-w-[880px]"><TableHeader><TableRow><TableHead>Cliente</TableHead><TableHead>Documento</TableHead><TableHead>Telefone</TableHead><TableHead>E-mail</TableHead><TableHead>Código/ID</TableHead><TableHead><span className="sr-only">Ações</span></TableHead></TableRow></TableHeader><TableBody>{query.data.data.map((customer) => <TableRow key={customer.id}><TableCell className="font-semibold text-slate-950">{customerDisplayName(customer)}</TableCell><TableCell>{customerDocument(customer)}</TableCell><TableCell>{customerPhone(customer)}</TableCell><TableCell>{customerEmail(customer)}</TableCell><TableCell>{customer.id}</TableCell><TableCell><Button onClick={() => router.push(`/customers/${customer.id}`)} variant="secondary">Ver cliente</Button></TableCell></TableRow>)}</TableBody></Table></TableContainer></Card>
      <Pagination onPageChange={(page) => setParams((current) => ({ ...current, page }))} page={query.data.pagination.page} totalPages={query.data.pagination.totalPages} />
    </div> : null}
  </div>;
}

export function getCustomersErrorMessage(error: unknown) {
  return getSafeApiErrorMessage(error, { defaultMessage: "Não foi possível consultar os clientes." });
}
