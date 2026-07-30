export interface TimelineEvent {
  id: string;
  customerId: string;
  interactionId: string;
  type: "interaction" | "next_action" | "payment" | "system";
  title: string;
  description: string;
  createdAt: Date;
  metadata?: Record<string, unknown>;
}
