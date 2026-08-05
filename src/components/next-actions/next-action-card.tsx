"use client";

import { AlertTriangle, CalendarClock, Check, CircleX, FileText, Mail, MapPin, MonitorCog, Phone, ReceiptText, Save, Smartphone, X } from "lucide-react";
import { useState, type ComponentType } from "react";

import { Badge, Button, Card, CardContent, Input } from "@/components/ui";
import type { BadgeVariant } from "@/components/ui";
import { useNextActionMutations } from "@/hooks/useNextActionQueries";
import { getSafeApiErrorMessage } from "@/lib/api-error-message";
import type { NextActionApiResponse, NextActionApiStatus, NextActionApiType } from "@/types/next-actions-api";

import { getNextActionPriority, isActiveNextAction, nextActionStatusLabels, nextActionTypeLabels, type NextActionPriority } from "./next-action-presenter";

const actionIcons: Record<NextActionApiType, ComponentType<{ className?: string; "aria-hidden"?: boolean }>> = {
  CALL: Phone, WHATSAPP: Smartphone, EMAIL: Mail, VERIFY_PAYMENT: ReceiptText,
  SEND_DOCUMENT: FileText, VISIT: MapPin, CLOSE_CASE: CircleX, SYSTEM: MonitorCog,
};
const priorityLabels: Record<NextActionPriority, string> = { low: "Baixa", medium: "Média", high: "Alta" };
const priorityVariants: Record<NextActionPriority, BadgeVariant> = { low: "success", medium: "warning", high: "danger" };
const statusVariants: Record<NextActionApiStatus, BadgeVariant> = {
  PENDING: "open", IN_PROGRESS: "warning", COMPLETED: "success", CANCELLED: "canceled", OVERDUE: "danger",
};
const dueFormatter = new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" });

export function NextActionCard({ action }: { action: NextActionApiResponse }) {
  const [editor, setEditor] = useState<"cancel" | "reschedule" | null>(null);
  const [reason, setReason] = useState("");
  const [dueAt, setDueAt] = useState(toDateTimeLocal(action.dueAt));
  const [description, setDescription] = useState(action.description);
  const { completeMutation, cancelMutation, rescheduleMutation } = useNextActionMutations(Number(action.customerId));
  const Icon = actionIcons[action.type];
  const priority = getNextActionPriority(action);
  const active = isActiveNextAction(action.status);
  const error = completeMutation.error ?? cancelMutation.error ?? rescheduleMutation.error;

  async function cancel() {
    if (!reason.trim()) return;
    try {
      await cancelMutation.mutateAsync({ id: action.id, request: { reason: reason.trim() } });
      setEditor(null);
    } catch {
      return;
    }
  }

  async function reschedule() {
    if (!dueAt) return;
    try {
      await rescheduleMutation.mutateAsync({
        id: action.id,
        request: {
          dueAt: new Date(dueAt).toISOString(),
          ...(description.trim() ? { description: description.trim() } : {}),
        },
      });
      setEditor(null);
    } catch {
      return;
    }
  }

  return (
    <Card>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-3">
          <span className="rounded-lg bg-blue-50 p-2 text-blue-700"><Icon aria-hidden className="size-5" /></span>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Cliente {action.customerId}</p>
            <h3 className="mt-1 break-words font-semibold text-slate-950">{action.title}</h3>
            <p className="mt-1 text-xs font-medium text-blue-700">{nextActionTypeLabels[action.type]}</p>
            <p className="mt-1 break-words text-sm text-slate-600">{action.description}</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={priorityVariants[priority]}>Prioridade {priorityLabels[priority]}</Badge>
          <Badge variant={statusVariants[action.status]}>{nextActionStatusLabels[action.status]}</Badge>
          <span className="flex items-center gap-1.5 text-xs text-slate-600"><CalendarClock aria-hidden className="size-4" />{action.dueAt ? dueFormatter.format(new Date(action.dueAt)) : "Sem vencimento"}</span>
        </div>

        {editor === "cancel" ? (
          <div className="space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
            <label className="block text-sm font-medium text-slate-700">Motivo do cancelamento<Input className="mt-1.5" maxLength={1000} onChange={(event) => setReason(event.target.value)} required value={reason} /></label>
            <div className="flex justify-end gap-2">
              <Button onClick={() => setEditor(null)} variant="secondary"><X aria-hidden className="size-4" />Voltar</Button>
              <Button disabled={!reason.trim()} loading={cancelMutation.isPending} onClick={() => void cancel()}><CircleX aria-hidden className="size-4" />Confirmar cancelamento</Button>
            </div>
          </div>
        ) : null}

        {editor === "reschedule" ? (
          <div className="space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
            <label className="block text-sm font-medium text-slate-700">Novo vencimento<Input className="mt-1.5" onChange={(event) => setDueAt(event.target.value)} required type="datetime-local" value={dueAt} /></label>
            <label className="block text-sm font-medium text-slate-700">Descrição<Input className="mt-1.5" onChange={(event) => setDescription(event.target.value)} value={description} /></label>
            <div className="flex justify-end gap-2">
              <Button onClick={() => setEditor(null)} variant="secondary"><X aria-hidden className="size-4" />Voltar</Button>
              <Button disabled={!dueAt} loading={rescheduleMutation.isPending} onClick={() => void reschedule()}><Save aria-hidden className="size-4" />Reagendar</Button>
            </div>
          </div>
        ) : null}

        {error ? <p className="flex items-start gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800" role="alert"><AlertTriangle aria-hidden className="mt-0.5 size-4 shrink-0" />{getActionErrorMessage(error)}</p> : null}
        {!editor ? (
          <div className="flex flex-wrap justify-end gap-2">
            <Button disabled={!active} loading={completeMutation.isPending} onClick={() => completeMutation.mutate(action.id)} variant="secondary"><Check aria-hidden className="size-4" />Concluir</Button>
            <Button disabled={!active} onClick={() => setEditor("reschedule")} variant="secondary"><CalendarClock aria-hidden className="size-4" />Reagendar</Button>
            <Button disabled={!active} onClick={() => setEditor("cancel")} variant="secondary"><CircleX aria-hidden className="size-4" />Cancelar</Button>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

function getActionErrorMessage(error: Error) {
  return getSafeApiErrorMessage(error, {
    defaultMessage: "Não foi possível atualizar a ação.",
    byStatus: {
      401: "Sua sessão expirou. Entre novamente para continuar.",
      403: "Você não tem permissão para alterar esta ação.",
      404: "Esta ação não foi encontrada. Atualize a lista e tente novamente.",
      409: "A ação foi alterada e a lista está sendo atualizada.",
    },
  });
}

function toDateTimeLocal(value: string) {
  const date = new Date(value);
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}
