import type { WorkQueueItem } from "@/types/work-queue";
export type WorkQueueGroup = "priority" | "today" | "overdue" | "all";
export function filterWorkQueueGroup(items: WorkQueueItem[], group: WorkQueueGroup, now = new Date()) {
  if (group === "priority" || group === "all") return items;
  const day = (value: Date) => `${value.getFullYear()}-${value.getMonth()}-${value.getDate()}`;
  if (group === "today") return items.filter((item) => item.nextAction && day(new Date(item.nextAction.dueAt)) === day(now));
  return items.filter((item) => item.nextAction && (item.nextAction.status === "OVERDUE" || new Date(item.nextAction.dueAt) < now));
}
