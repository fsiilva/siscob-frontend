import type { OperationTimelineItem, OperationTimelineEventType } from "@/types/operations-api";

export type OperationTimelineIcon = "created" | "assigned" | "status" | "completed" | "cancelled" | "priority";

const icons: Record<OperationTimelineEventType, OperationTimelineIcon> = {
  OperationCreated: "created", OperationAssigned: "assigned", OperationReleased: "assigned",
  OperationTransferred: "assigned", OperationStarted: "status", OperationWaiting: "status",
  OperationBlocked: "status", OperationResumed: "status", OperationCompleted: "completed",
  OperationCancelled: "cancelled", OperationReopened: "status", OperationPriorityChanged: "priority",
};

export function presentOperationTimelineItem(item: OperationTimelineItem) {
  const date = new Date(item.createdAt);
  return {
    ...item,
    icon: icons[item.type],
    user: item.actor?.name ?? "Sistema",
    date: new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium" }).format(date),
    time: new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit" }).format(date),
  };
}
