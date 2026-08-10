import type { NextActionApiResponse, NextActionApiStatus, NextActionApiType } from "@/types/next-actions-api";

export type NextActionPriority = "low" | "medium" | "high";

export const nextActionTypeLabels: Record<NextActionApiType, string> = {
  CALL: "Ligação",
  WHATSAPP: "WhatsApp",
  EMAIL: "E-mail",
  VERIFY_PAYMENT: "Conferir pagamento",
  SEND_DOCUMENT: "Enviar documento",
  VISIT: "Visita",
  CLOSE_CASE: "Encerrar atendimento",
  SYSTEM: "Sistema",
};

export const nextActionStatusLabels: Record<NextActionApiStatus, string> = {
  PENDING: "Pendente",
  IN_PROGRESS: "Em andamento",
  COMPLETED: "Concluída",
  CANCELLED: "Cancelada",
  OVERDUE: "Atrasada",
};

export function getNextActionPriority(action: Pick<NextActionApiResponse, "status" | "type">): NextActionPriority {
  if (action.status === "OVERDUE" || action.type === "VERIFY_PAYMENT") return "high";
  if (action.type === "CLOSE_CASE" || action.type === "SYSTEM") return "low";
  return "medium";
}

export function isActiveNextAction(status: NextActionApiStatus) {
  return status === "PENDING" || status === "IN_PROGRESS" || status === "OVERDUE";
}
