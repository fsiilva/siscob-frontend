"use client";

import { AlertTriangle, RefreshCw, Search, Users, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button, Card, EmptyState, Input, LoadingState, PageHeader, Pagination, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableHeader, TableRow } from "@/components/ui";
import { useCustomers } from "@/hooks/useCustomers";
import { getSafeApiErrorMessage } from "@/lib/api-error-message";
import type { Customer, CustomersQuery } from "@/types/customers";

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
      <Card className={`overflow-hidden transition-opacity ${query.isFetching ? "opacity-60" : ""}`}><TableContainer><Table className="min-w-[760px] table-fixed"><TableHeader><TableRow><TableHead className="w-[22%]">Cliente</TableHead><TableHead className="w-44">Documento</TableHead><TableHead className="w-40">Telefone</TableHead><TableHead className="w-[28%]">E-mail</TableHead><TableHead className="w-24">Código/ID</TableHead><TableHead className="sticky right-0 w-36 bg-slate-50"><span className="sr-only">Ações</span></TableHead></TableRow></TableHeader><TableBody>{query.data.data.map((customer) => <CustomerRow customer={customer} key={customer.id} onOpen={() => router.push(`/customers/${customer.id}`)} />)}</TableBody></Table></TableContainer></Card>
      <Pagination onPageChange={(page) => setParams((current) => ({ ...current, page }))} page={query.data.pagination.page} totalPages={query.data.pagination.totalPages} />
    </div> : null}
  </div>;
}

function CustomerRow({ customer, onOpen }: { customer: Customer; onOpen(): void }) {
  const name = customerDisplayName(customer);
  const document = customerDocument(customer);
  const phone = customerPhone(customer);
  const email = customerEmail(customer);

  return <TableRow><TableCell><div className="truncate font-semibold text-slate-950" title={name}>{name}</div></TableCell><TableCell><div className="truncate" title={document}>{document}</div></TableCell><TableCell><div className="truncate" title={phone}>{phone}</div></TableCell><TableCell><div className="truncate" title={email}>{email}</div></TableCell><TableCell className="whitespace-nowrap">{customer.id}</TableCell><TableCell className="sticky right-0 whitespace-nowrap bg-white"><Button onClick={onOpen} variant="secondary">Ver cliente</Button></TableCell></TableRow>;
}

export function getCustomersErrorMessage(error: unknown) {
  return getSafeApiErrorMessage(error, { defaultMessage: "Não foi possível consultar os clientes." });
}
