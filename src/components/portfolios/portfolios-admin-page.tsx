"use client";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button, Drawer, Input, Select } from "@/components/ui";
import { useCompany } from "@/context/company";
import { useAuth } from "@/hooks/useAuth";
import { useCompanies } from "@/hooks/useCompanies";
import { useCreatePortfolio, usePortfolioAdminList, useUpdatePortfolio, useUpdatePortfolioStatus } from "@/hooks/usePortfolios";
import type { PortfolioResponse } from "@/types/portfolios-api";

import { buildCompanyOptions } from "./build-company-options";

type Editor = { portfolio?: PortfolioResponse; companyId: string; code: string; name: string; active: boolean };
export function PortfoliosAdminPage() {
  const auth = useAuth(), context = useCompany();
  const [company, setCompany] = useState(""), [status, setStatus] = useState(""), [editor, setEditor] = useState<Editor | null>(null);
  const query = usePortfolioAdminList({ ...(company && { company }), ...(status && { active: status === "true" }) });
  const companiesQuery = useCompanies({ active: true });
  const create = useCreatePortfolio(), update = useUpdatePortfolio(), changeStatus = useUpdatePortfolioStatus();
  const companies = useMemo(
    () => buildCompanyOptions(
      [...context.assignedCompanies, ...context.availableCompanies, ...(context.selectedCompany ? [context.selectedCompany] : [])],
      companiesQuery.data?.data ?? [],
    ),
    [companiesQuery.data, context.assignedCompanies, context.availableCompanies, context.selectedCompany],
  );
  const rows = useMemo(() => [...(query.data ?? [])].sort((a, b) => a.name.localeCompare(b.name, "pt-BR")), [query.data]);
  if (auth.isLoading) return <State text="Carregando..." />;
  if (auth.user?.role !== "ADMIN") return <State error text="Acesso restrito a administradores." />;
  async function save() { if (!editor) return; try { if (editor.portfolio) await update.mutateAsync({ id: editor.portfolio.id, body: { code: editor.code, name: editor.name } }); else await create.mutateAsync({ companyId: editor.companyId, code: editor.code, name: editor.name, active: editor.active }); setEditor(null); toast.success("Carteira salva com sucesso."); } catch { toast.error("Não foi possível salvar a carteira."); } }
  async function toggle(item: PortfolioResponse) { if (item.active && !confirm(`Desativar a carteira ${item.name}?`)) return; try { await changeStatus.mutateAsync({ id: item.id, active: !item.active }); toast.success(item.active ? "Carteira desativada." : "Carteira ativada."); } catch { toast.error("Não foi possível alterar a situação."); } }
  return <div className="space-y-6 p-4 sm:p-6 lg:p-8">
    <header className="flex flex-wrap items-center justify-between gap-4"><div><p className="text-sm font-semibold text-blue-700">Administração</p><h1 className="text-2xl font-bold">Carteiras</h1></div><Button onClick={() => setEditor({ companyId: context.selectedCompany ? String(context.selectedCompany.id) : "", code: "", name: "", active: true })}>Nova Carteira</Button></header>
    <div className="flex flex-wrap gap-3 rounded-xl border bg-white p-4"><Select aria-label="Filtrar por empresa" value={company} onChange={(e) => setCompany(e.target.value)}><option value="">Todas as empresas</option>{companies.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}</Select><Select aria-label="Filtrar por situação" value={status} onChange={(e) => setStatus(e.target.value)}><option value="">Todas as situações</option><option value="true">Ativas</option><option value="false">Inativas</option></Select><Button variant="secondary" onClick={() => void query.refetch()}>Atualizar</Button></div>
    {query.isLoading ? <State text="Carregando carteiras..." /> : query.isError ? <State error text="Não foi possível carregar as carteiras." /> : !rows.length ? <State text="Nenhuma carteira encontrada." /> : <div className="overflow-x-auto rounded-xl border bg-white"><table className="w-full text-left text-sm"><thead className="bg-slate-50"><tr>{["Código","Nome","Empresa","Situação","Criação","Atualização","Ações"].map(x => <th className="px-4 py-3" key={x}>{x}</th>)}</tr></thead><tbody>{rows.map(item => <tr className="border-t" key={item.id}><td className="px-4 py-3">{item.code}</td><td className="px-4 py-3">{item.name}</td><td className="px-4 py-3">{companies.find(x => x.id === item.companyId)?.name ?? item.companyId}</td><td className="px-4 py-3">{item.active ? "Ativa" : "Inativa"}</td><td className="px-4 py-3">{date(item.createdAt)}</td><td className="px-4 py-3">{date(item.updatedAt)}</td><td className="flex gap-2 px-4 py-3"><Button variant="ghost" onClick={() => setEditor({ portfolio: item, companyId: item.companyId, code: item.code, name: item.name, active: item.active })}>Editar</Button><Button variant={item.active ? "danger" : "secondary"} onClick={() => void toggle(item)}>{item.active ? "Desativar" : "Ativar"}</Button></td></tr>)}</tbody></table></div>}
    {editor && <Drawer open title={editor.portfolio ? "Editar Carteira" : "Nova Carteira"} onClose={() => setEditor(null)}><form className="space-y-4 py-5" onSubmit={e => { e.preventDefault(); void save(); }}><label className="block text-sm">Empresa<Select className="mt-1" disabled={!!editor.portfolio || companiesQuery.isLoading} required value={editor.companyId} onChange={e => setEditor({...editor, companyId:e.target.value})}><option value="">{companiesQuery.isLoading ? "Carregando empresas..." : companies.length ? "Selecione" : "Nenhuma empresa disponível"}</option>{companies.map(x => <option key={x.id} value={x.id}>{x.name}{x.code ? ` (${x.code})` : ""}</option>)}</Select></label>{companiesQuery.isError && <div className="flex items-center justify-between gap-3 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800" role="alert"><span>Não foi possível carregar todas as empresas. As empresas já disponíveis continuam acessíveis.</span><Button onClick={() => void companiesQuery.refetch()} variant="secondary">Tentar novamente</Button></div>}<label className="block text-sm">Código<Input className="mt-1" maxLength={64} required value={editor.code} onChange={e => setEditor({...editor, code:e.target.value})}/></label><label className="block text-sm">Nome<Input className="mt-1" maxLength={150} required value={editor.name} onChange={e => setEditor({...editor, name:e.target.value})}/></label>{!editor.portfolio && <label className="flex gap-2 text-sm"><input checked={editor.active} type="checkbox" onChange={e => setEditor({...editor, active:e.target.checked})}/>Ativa</label>}<div className="flex justify-end gap-2"><Button variant="secondary" onClick={() => setEditor(null)}>Cancelar</Button><Button loading={create.isPending || update.isPending} type="submit">Salvar</Button></div></form></Drawer>}
  </div>;
}
function State({text,error=false}:{text:string;error?:boolean}) { return <div className={`rounded-xl border p-8 text-center ${error ? "bg-red-50 text-red-800" : "bg-white text-slate-600"}`} role={error?"alert":undefined}>{text}</div>; }
function date(value:string) { return new Intl.DateTimeFormat("pt-BR",{dateStyle:"short",timeStyle:"short"}).format(new Date(value)); }
