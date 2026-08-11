"use client";

import { useState } from "react";

import { Button, Input, Select } from "@/components/ui";
import { useAuth } from "@/hooks/useAuth";
import { useOperationCommand } from "@/hooks/useOperations";
import type { OperationCommand, OperationPriority, OperationResponse } from "@/types/operations-api";

import { buildOperationCommandPayload, isOperationCommandValid, operationCommandRequiresReason, operationErrorMessage, type OperationActionValues } from "./operation-command";
import { getAvailableOperationActions, getOperationCommandLabel } from "./operation-presenter";
import { OperatorSelect } from "./operator-select";

const initialValues: OperationActionValues = { assignedOperatorId: "", reason: "", reviewAt: "", result: "", priority: "NORMAL" };

export function OperationActions({ operation }: { operation: OperationResponse }) {
  const { user } = useAuth();
  const mutation = useOperationCommand(operation.id);
  const [selected, setSelected] = useState<OperationCommand | null>(null);
  const [values, setValues] = useState<OperationActionValues>(initialValues);
  const [success, setSuccess] = useState<string | null>(null);
  const actions = getAvailableOperationActions(operation, user);
  const actionLabel = (action: OperationCommand) => getOperationCommandLabel(action, user?.role ?? "USER");

  async function submit() {
    if (!selected || !isOperationCommandValid(selected, values) || (selected === "assign" && user?.role === "ADMIN" && !values.assignedOperatorId)) return;
    try {
      await mutation.mutateAsync({ command: selected, payload: buildOperationCommandPayload(selected, operation.version, values) });
      setSuccess("Operation atualizada com sucesso.");
      setSelected(null);
      setValues(initialValues);
    } catch {
      setSuccess(null);
    }
  }

  if (actions.length === 0) return <p className="text-sm text-slate-500">Nenhuma ação disponível para seu papel e o estado atual.</p>;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {actions.map((action) => <Button key={action} onClick={() => { mutation.reset(); setSuccess(null); setSelected(action); }} variant="secondary">{actionLabel(action)}</Button>)}
      </div>
      {selected ? (
        <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <h4 className="font-semibold text-slate-950">{actionLabel(selected)}</h4>
          {(selected === "assign" || selected === "transfer") && user?.role === "ADMIN" ? <label className="block text-sm font-medium text-slate-700">{selected === "assign" ? "Operador" : "Novo operador"}<span className="mt-1.5 block"><OperatorSelect excludeOperatorId={selected === "transfer" ? operation.assignedOperatorId : undefined} onChange={(assignedOperatorId) => setValues((current) => ({ ...current, assignedOperatorId: assignedOperatorId ?? "" }))} value={values.assignedOperatorId} /></span></label> : null}
          {operationCommandRequiresReason(selected) ? <Field label="Motivo" maxLength={500} onChange={(reason) => setValues((current) => ({ ...current, reason }))} value={values.reason} /> : null}
          {selected === "complete" ? <Field label="Resultado" maxLength={1000} onChange={(result) => setValues((current) => ({ ...current, result }))} value={values.result} /> : null}
          {selected === "wait" ? <label className="block text-sm font-medium text-slate-700">Revisar em<Input className="mt-1.5" onChange={(event) => setValues((current) => ({ ...current, reviewAt: event.target.value }))} type="datetime-local" value={values.reviewAt} /></label> : null}
          {selected === "changePriority" ? <label className="block text-sm font-medium text-slate-700">Nova prioridade<Select className="mt-1.5" onChange={(event) => setValues((current) => ({ ...current, priority: event.target.value as OperationPriority }))} value={values.priority}><option value="LOW">Baixa</option><option value="NORMAL">Normal</option><option value="HIGH">Alta</option><option value="URGENT">Urgente</option></Select></label> : null}
          {mutation.error ? <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">{operationErrorMessage(mutation.error)}</p> : null}
          <div className="flex justify-end gap-2"><Button onClick={() => setSelected(null)} variant="secondary">Voltar</Button><Button disabled={!isOperationCommandValid(selected, values) || (selected === "assign" && user?.role === "ADMIN" && !values.assignedOperatorId)} loading={mutation.isPending} onClick={() => void submit()}>Confirmar</Button></div>
        </div>
      ) : null}
      {success ? <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800" role="status">{success}</p> : null}
    </div>
  );
}

function Field({ label, value, onChange, maxLength }: { label: string; value: string; onChange(value: string): void; maxLength?: number }) {
  return <label className="block text-sm font-medium text-slate-700">{label}<Input className="mt-1.5" maxLength={maxLength} onChange={(event) => onChange(event.target.value)} value={value} /></label>;
}
