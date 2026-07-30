export interface NextAction {
  id: string;
  type:
    | "call"
    | "whatsapp"
    | "email"
    | "verify_payment"
    | "send_invoice"
    | "update_registration"
    | "close";
  title: string;
  description: string;
  dueAt?: Date;
  priority: "low" | "medium" | "high";
  status: "pending" | "completed" | "cancelled";
  interactionId: string;
}

export interface CustomerNextAction extends NextAction {
  customerId: number;
  customerName: string;
}
