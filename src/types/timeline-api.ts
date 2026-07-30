export type TimelineApiEventType =
  | "INTERACTION_CREATED"
  | "NEXT_ACTION_CREATED"
  | "NEXT_ACTION_COMPLETED"
  | "NEXT_ACTION_CANCELLED"
  | "NEXT_ACTION_RESCHEDULED"
  | "SYSTEM";

export interface TimelineApiEvent {
  id: string;
  customerId: string;
  interactionId: string | null;
  nextActionId: string | null;
  actorUserId: string | null;
  type: TimelineApiEventType;
  title: string;
  description: string;
  metadata: Record<string, unknown> | null;
  occurredAt: string;
  createdAt: string;
}

export interface TimelineApiResponse {
  items: TimelineApiEvent[];
  nextCursor: string | null;
  hasMore: boolean;
}

export interface TimelineApiParams {
  cursor?: string;
  limit?: number;
  type?: TimelineApiEventType;
}
