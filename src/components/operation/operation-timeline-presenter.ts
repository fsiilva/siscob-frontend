import type { OperationTimelineItem, OperationTimelineEventType } from "@/types/operations-api";

export type OperationTimelineIcon = "created" | "assigned" | "status" | "completed" | "cancelled" | "priority" | "interaction" | "nextAction";
export type OperationTimelineRelation = "Interaction" | "Next Action" | null;

const icons: Record<OperationTimelineEventType, OperationTimelineIcon> = {
  OperationCreated: "created", OperationAssigned: "assigned", OperationReleased: "assigned",
  OperationTransferred: "assigned", OperationStarted: "status", OperationWaiting: "status",
  OperationBlocked: "status", OperationResumed: "status", OperationCompleted: "completed",
  OperationCancelled: "cancelled", OperationReopened: "status", OperationPriorityChanged: "priority",
  PaymentPromiseCreated: "created", PaymentPromiseFulfilled: "completed",
  PaymentPromiseBroken: "cancelled", PaymentPromiseCancelled: "cancelled",
  OperationEvent: "status",
};

export function presentOperationTimelineItem(item: OperationTimelineItem) {
  const date = new Date(item.createdAt);
  const relation = getOperationEventRelation(item);
  return {
    ...item,
    icon: relation === "Interaction" ? "interaction" as const : relation === "Next Action" ? "nextAction" as const : icons[item.type],
    relation,
    user: item.actor?.name ?? "Sistema",
    date: new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium" }).format(date),
    time: new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit" }).format(date),
  };
}

function getOperationEventRelation(item: OperationTimelineItem): OperationTimelineRelation {
  if (item.type !== "OperationEvent") return null;
  if (hasStrings(item.metadata, ["channel", "outcome"])) return "Interaction";
  if (hasStrings(item.metadata, ["type", "status", "dueAt"])) return "Next Action";
  return null;
}

function hasStrings(metadata: Record<string, unknown>, keys: string[]) {
  return keys.every((key) => typeof metadata[key] === "string" && metadata[key].trim().length > 0);
}
