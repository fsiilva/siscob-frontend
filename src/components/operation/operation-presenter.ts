import type { UserRole } from "@/types/auth";
import type { OperationCommand, OperationPriority, OperationResponse, OperationStatus } from "@/types/operations-api";
import type { TimelineApiEvent } from "@/types/timeline-api";

export const operationStatusLabels: Record<OperationStatus, string> = {
  READY: "Pronta", ASSIGNED: "Atribuída", IN_PROGRESS: "Em andamento", WAITING: "Em espera",
  BLOCKED: "Bloqueada", COMPLETED: "Concluída", CANCELLED: "Cancelada",
};
export const operationPriorityLabels: Record<OperationPriority, string> = {
  LOW: "Baixa", NORMAL: "Normal", HIGH: "Alta", URGENT: "Urgente",
};
export const operationCommandLabels: Record<OperationCommand, string> = {
  assign: "Atribuir", release: "Liberar", transfer: "Transferir", start: "Iniciar", wait: "Aguardar",
  block: "Bloquear", resume: "Retomar", complete: "Concluir", cancel: "Cancelar", reopen: "Reabrir",
  changePriority: "Alterar prioridade",
};

const adminActions: Record<OperationStatus, OperationCommand[]> = {
  READY: ["assign", "cancel", "changePriority"],
  ASSIGNED: ["release", "transfer", "start", "cancel", "changePriority"],
  IN_PROGRESS: ["transfer", "wait", "block", "complete", "cancel", "changePriority"],
  WAITING: ["transfer", "block", "resume", "cancel", "changePriority"],
  BLOCKED: ["transfer", "wait", "resume", "cancel", "changePriority"],
  COMPLETED: ["reopen"], CANCELLED: ["reopen"],
};
const operatorActions: Record<OperationStatus, OperationCommand[]> = {
  READY: ["assign"], ASSIGNED: ["release", "start"], IN_PROGRESS: ["wait", "block", "complete"],
  WAITING: ["block", "resume"], BLOCKED: ["wait", "resume"], COMPLETED: [], CANCELLED: [],
};

export function getAvailableOperationActions(operation: OperationResponse, user: { id: string; role: UserRole } | null) {
  if (!user) return [];
  if (user.role === "ADMIN") return adminActions[operation.status];
  const ownsOperation = operation.status === "READY" || operation.assignedOperatorId === user.id;
  return ownsOperation ? operatorActions[operation.status] : [];
}

export function formatOperationDate(value: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(date);
}

export function isOperationTimelineEvent(event: TimelineApiEvent, operationId: string) {
  return typeof event.metadata === "object"
    && event.metadata !== null
    && !Array.isArray(event.metadata)
    && event.metadata.operationId === operationId;
}
