export type NextActionApiType =
  | "CALL"
  | "WHATSAPP"
  | "EMAIL"
  | "VERIFY_PAYMENT"
  | "SEND_DOCUMENT"
  | "VISIT"
  | "CLOSE_CASE"
  | "SYSTEM";

export type NextActionApiStatus =
  | "PENDING"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED"
  | "OVERDUE";

export interface NextActionApiResponse {
  id: string;
  interactionId: string;
  customerId: string;
  receivableId: string | null;
  assignedTo: string;
  type: NextActionApiType;
  status: NextActionApiStatus;
  title: string;
  description: string;
  dueAt: string;
  completedAt: string | null;
  cancelledAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface NextActionListResponse {
  data: NextActionApiResponse[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface CancelNextActionRequest {
  reason: string;
}

export interface RescheduleNextActionRequest {
  dueAt: string;
  description?: string;
}
