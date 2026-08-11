import { ApiRequestError } from "@/services/api";
import type { OperationCommand, OperationCommandPayload, OperationPriority } from "@/types/operations-api";

export interface OperationActionValues {
  assignedOperatorId: string;
  reason: string;
  reviewAt: string;
  result: string;
  priority: OperationPriority;
}

export function operationCommandRequiresReason(command: OperationCommand) {
  return ["release", "transfer", "wait", "block", "resume", "cancel", "reopen", "changePriority"].includes(command);
}

export function isOperationCommandValid(command: OperationCommand, values: OperationActionValues) {
  if (operationCommandRequiresReason(command) && !values.reason.trim()) return false;
  if (command === "transfer" && !values.assignedOperatorId.trim()) return false;
  if (command === "wait" && !values.reviewAt) return false;
  if (command === "complete" && !values.result.trim()) return false;
  return true;
}

export function buildOperationCommandPayload(command: OperationCommand, expectedVersion: number, values: OperationActionValues): OperationCommandPayload {
  const base = { expectedVersion };
  if (command === "assign") return { ...base, ...(values.assignedOperatorId.trim() ? { assignedOperatorId: values.assignedOperatorId.trim() } : {}) };
  if (command === "transfer") return { ...base, assignedOperatorId: values.assignedOperatorId.trim(), reason: values.reason.trim() };
  if (command === "wait") return { ...base, reason: values.reason.trim(), reviewAt: new Date(values.reviewAt).toISOString() };
  if (command === "complete") return { ...base, result: values.result.trim() };
  if (command === "changePriority") return { ...base, priority: values.priority, reason: values.reason.trim() };
  if (operationCommandRequiresReason(command)) return { ...base, reason: values.reason.trim() };
  return base;
}

export function operationErrorMessage(error: Error) {
  if (!(error instanceof ApiRequestError)) return "Falha de rede. Verifique sua conexão e tente novamente.";
  if (error.status === 400) return "Revise os campos informados e tente novamente.";
  if (error.status === 401) return "Sua sessão expirou. Entre novamente para continuar.";
  if (error.status === 403) return "Você não tem permissão para executar esta ação.";
  if (error.status === 404) return "A cobrança ou o operador não foi encontrado.";
  if (error.status === 409) return "Esta cobrança foi alterada por outro usuário. Os dados estão sendo atualizados.";
  if (error.status === 422) return "O operador não pode receber a cobrança ou a regra de negócio não permite esta ação.";
  return "Não foi possível atualizar a cobrança.";
}
