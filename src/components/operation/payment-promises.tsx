"use client";

import { useState } from "react";
import { Badge, Button, Drawer, EmptyState, Input } from "@/components/ui";
import { useAuth } from "@/hooks/useAuth";
import { useCreatePaymentPromise, useTransitionPaymentPromise } from "@/hooks/usePaymentPromises";
import type { OperationResponse } from "@/types/operations-api";
import type { PaymentPromise, PaymentPromiseCommand, PaymentPromiseStatus } from "@/types/payment-promises";
import { formatOperationDate, getAvailableOperationActions } from "./operation-presenter";
import { paymentPromiseErrorMessage } from "./payment-promise.error";

const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const date = new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" });
const statusLabels: Record<PaymentPromiseStatus, string> = { PENDING: "Pendente", FULFILLED: "Cumprida", BROKEN: "Quebrada", CANCELLED: "Cancelada" };
const commandLabels: Record<PaymentPromiseCommand, string> = { fulfill: "Marcar como cumprida", break: "Marcar como quebrada", cancel: "Cancelar promessa" };

export function PaymentPromises({ operation, promises }: { operation: OperationResponse; promises: PaymentPromise[] }) {
  const { user } = useAuth();
  const [createOpen, setCreateOpen] = useState(false);
  const canAct = !["COMPLETED", "CANCELLED"].includes(operation.status) && getAvailableOperationActions(operation, user).length > 0;
  return <section className="space-y-3" aria-labelledby="payment-promises-title">
    <div className="flex flex-wrap items-center justify-between gap-3"><h3 className="font-semibold text-slate-950" id="payment-promises-title">Promessas de pagamento</h3>{canAct ? <Button onClick={() => setCreateOpen(true)}>Registrar promessa</Button> : null}</div>
    {promises.length ? <div className="space-y-3">{promises.map((promise) => <PaymentPromiseCard canAct={canAct} key={promise.id} operationId={operation.id} promise={promise} />)}</div> : <EmptyState description="Nenhuma promessa de pagamento registrada." title="Sem promessas" />}
    <CreatePaymentPromiseDrawer onClose={() => setCreateOpen(false)} open={createOpen} operation={operation} />
  </section>;
}

function PaymentPromiseCard({ canAct, operationId, promise }: { canAct: boolean; operationId: string; promise: PaymentPromise }) {
  const mutation = useTransitionPaymentPromise(operationId);
  const [command, setCommand] = useState<PaymentPromiseCommand | null>(null);
  async function confirm() { if (!command) return; try { await mutation.mutateAsync({ id: promise.id, command, expectedVersion: promise.version }); setCommand(null); } catch {} }
  return <article className="space-y-3 rounded-xl border border-slate-200 p-4">
    <div className="flex flex-wrap items-center justify-between gap-2"><strong className="text-slate-950">{currency.format(promise.promisedAmount)}</strong><Badge variant={promise.status === "FULFILLED" ? "success" : promise.status === "BROKEN" ? "danger" : "open"}>{statusLabels[promise.status]}</Badge></div>
    <dl className="grid gap-3 text-sm sm:grid-cols-2"><Item label="Data prometida" value={date.format(new Date(`${promise.promisedDate}T00:00:00Z`))} /><Item label="Recebível" value={promise.receivableId ?? "Não vinculado"} /><Item label="Registrada em" value={formatOperationDate(promise.createdAt)} />{promise.notes ? <Item label="Observação" value={promise.notes} /> : null}</dl>
    {promise.status === "PENDING" && canAct ? <div className="space-y-3"><div className="flex flex-wrap gap-2">{(Object.keys(commandLabels) as PaymentPromiseCommand[]).map((item) => <Button disabled={mutation.isPending} key={item} onClick={() => { mutation.reset(); setCommand(item); }} variant="secondary">{commandLabels[item]}</Button>)}</div>{command ? <div className="rounded-lg bg-slate-50 p-3"><p className="text-sm text-slate-700">Confirma esta ação: {commandLabels[command]}?</p><div className="mt-3 flex justify-end gap-2"><Button disabled={mutation.isPending} onClick={() => setCommand(null)} variant="secondary">Voltar</Button><Button loading={mutation.isPending} onClick={() => void confirm()}>Confirmar</Button></div></div> : null}</div> : null}
    {mutation.error ? <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">{paymentPromiseErrorMessage(mutation.error)}</p> : null}
  </article>;
}

function CreatePaymentPromiseDrawer({ onClose, open, operation }: { onClose(): void; open: boolean; operation: OperationResponse }) {
  const mutation = useCreatePaymentPromise(operation.id);
  const [amount, setAmount] = useState(""); const [promisedDate, setPromisedDate] = useState(""); const [notes, setNotes] = useState("");
  const numericAmount = Number(amount); const valid = numericAmount > 0 && /^\d+(?:\.\d{1,2})?$/.test(amount) && /^\d{4}-\d{2}-\d{2}$/.test(promisedDate);
  async function submit() { if (!valid) return; try { await mutation.mutateAsync({ ...(operation.receivableId ? { receivableId: operation.receivableId } : {}), promisedAmount: numericAmount, promisedDate, ...(notes.trim() ? { notes: notes.trim() } : {}) }); setAmount(""); setPromisedDate(""); setNotes(""); onClose(); } catch {} }
  return <Drawer onClose={onClose} open={open} title="Registrar promessa de pagamento"><div className="space-y-4 py-4">
    <label className="block text-sm font-medium text-slate-700">Recebível<Input className="mt-1.5" disabled value={operation.receivableId ?? "Sem recebível vinculado"} /></label>
    <label className="block text-sm font-medium text-slate-700">Valor prometido<Input className="mt-1.5" inputMode="decimal" onChange={(event) => setAmount(event.target.value.replace(",", "."))} placeholder="0,00" value={amount} /></label>
    <label className="block text-sm font-medium text-slate-700">Data prometida<Input className="mt-1.5" min={today()} onChange={(event) => setPromisedDate(event.target.value)} type="date" value={promisedDate} /></label>
    <label className="block text-sm font-medium text-slate-700">Observação<Input className="mt-1.5" maxLength={1000} onChange={(event) => setNotes(event.target.value)} value={notes} /></label>
    {mutation.error ? <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">{paymentPromiseErrorMessage(mutation.error)}</p> : null}
    <div className="flex justify-end gap-2"><Button disabled={mutation.isPending} onClick={onClose} variant="secondary">Cancelar</Button><Button disabled={!valid} loading={mutation.isPending} onClick={() => void submit()}>Registrar promessa</Button></div>
  </div></Drawer>;
}

function Item({ label, value }: { label: string; value: string }) { return <div className="min-w-0"><dt className="text-xs uppercase text-slate-500">{label}</dt><dd className="mt-1 break-words text-slate-900">{value}</dd></div>; }
function today() { const now = new Date(); return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`; }
