import { workQueueSchema } from "@/schemas/work-queue.schema";
import type { WorkQueueFilters, WorkQueueResponse } from "@/types/work-queue";
import { api } from "./api";

export async function getWorkQueue(filters: WorkQueueFilters): Promise<WorkQueueResponse> {
  const { data } = await api.get("/operations/work-queue", { params: filters });
  return workQueueSchema.parse(data);
}
