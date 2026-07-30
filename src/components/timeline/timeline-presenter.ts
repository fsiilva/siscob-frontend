import type { TimelineApiEvent, TimelineApiEventType } from "@/types/timeline-api";

export type TimelineIcon = "interaction" | "created" | "completed" | "cancelled" | "rescheduled" | "system";

export interface PresentedTimelineEvent {
  id: string;
  title: string;
  description: string;
  icon: TimelineIcon;
  occurredAt: string;
  dateLabel: string;
  details: Array<{ label: string; value: string }>;
}

const typePresentation: Record<TimelineApiEventType, { icon: TimelineIcon; fallbackTitle: string }> = {
  INTERACTION_CREATED: { icon: "interaction", fallbackTitle: "Atendimento registrado" },
  NEXT_ACTION_CREATED: { icon: "created", fallbackTitle: "Próxima ação criada" },
  NEXT_ACTION_COMPLETED: { icon: "completed", fallbackTitle: "Próxima ação concluída" },
  NEXT_ACTION_CANCELLED: { icon: "cancelled", fallbackTitle: "Próxima ação cancelada" },
  NEXT_ACTION_RESCHEDULED: { icon: "rescheduled", fallbackTitle: "Próxima ação reagendada" },
  SYSTEM: { icon: "system", fallbackTitle: "Evento do sistema" },
};

const channelLabels: Record<string, string> = {
  phone: "Ligação", whatsapp: "WhatsApp", email: "E-mail", visit: "Presencial", system: "Sistema",
};
const outcomeLabels: Record<string, string> = {
  contact_made: "Contato realizado", no_answer: "Sem resposta", promise_to_pay: "Promessa de pagamento",
  refused: "Recusou", wrong_contact: "Contato inválido", follow_up: "Acompanhamento", completed: "Concluído",
};
const actionTypeLabels: Record<string, string> = {
  CALL: "Ligação", WHATSAPP: "WhatsApp", EMAIL: "E-mail", VERIFY_PAYMENT: "Conferir pagamento",
  SEND_DOCUMENT: "Enviar documento", VISIT: "Visita", CLOSE_CASE: "Encerrar atendimento", SYSTEM: "Sistema",
};

export function presentTimelineEvent(event: TimelineApiEvent): PresentedTimelineEvent {
  const presentation = typePresentation[event.type];
  const metadata = isRecord(event.metadata) ? event.metadata : {};
  const details = detailsByType(event, metadata);
  const actor = optionalString(event.actorUserId);
  if (actor) details.push({ label: "Ator", value: actor });

  return {
    id: event.id,
    title: optionalString(event.title) ?? presentation.fallbackTitle,
    description: optionalString(event.description) ?? "Sem descrição.",
    icon: presentation.icon,
    occurredAt: event.occurredAt,
    dateLabel: formatTimelineDate(event.occurredAt),
    details,
  };
}

function detailsByType(event: TimelineApiEvent, metadata: Record<string, unknown>) {
  if (event.type === "INTERACTION_CREATED") return compactDetails([
    ["Canal", mappedValue(metadata, "channel", channelLabels)],
    ["Resultado", mappedValue(metadata, "outcome", outcomeLabels)],
    ["Observação", optionalString(event.description)],
  ]);
  if (event.type === "NEXT_ACTION_CREATED") return compactDetails([
    ["Tipo", mappedValue(metadata, "type", actionTypeLabels)],
    ["Descrição", optionalString(event.description)],
    ["Vencimento", optionalDate(metadata, "dueAt")],
    ["Responsável", optionalString(metadata.assignedTo)],
  ]);
  if (event.type === "NEXT_ACTION_COMPLETED") return compactDetails([
    ["Ação concluída", optionalString(event.description)],
    ["Conclusão", optionalDate(metadata, "completedAt") ?? formatTimelineDate(event.occurredAt)],
  ]);
  if (event.type === "NEXT_ACTION_CANCELLED") return compactDetails([
    ["Ação cancelada", optionalString(event.description)],
    ["Motivo", optionalString(metadata.reason)],
    ["Cancelamento", optionalDate(metadata, "cancelledAt") ?? formatTimelineDate(event.occurredAt)],
  ]);
  if (event.type === "NEXT_ACTION_RESCHEDULED") return compactDetails([
    ["Vencimento anterior", optionalDate(metadata, "previousDueAt")],
    ["Novo vencimento", optionalDate(metadata, "newDueAt")],
    ["Descrição anterior", optionalString(metadata.previousDescription)],
    ["Nova descrição", optionalString(metadata.newDescription)],
  ]);
  return [];
}

function compactDetails(entries: Array<[string, string | null]>) {
  return entries.flatMap(([label, value]) => value ? [{ label, value }] : []);
}

function mappedValue(metadata: Record<string, unknown>, key: string, labels: Record<string, string>) {
  const value = optionalString(metadata[key]);
  return value ? (labels[value] ?? value) : null;
}

function optionalDate(metadata: Record<string, unknown>, key: string) {
  const value = optionalString(metadata[key]);
  return value ? formatTimelineDate(value) : null;
}

function optionalString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function formatTimelineDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Data indisponível";
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium", timeStyle: "short" }).format(date);
}
