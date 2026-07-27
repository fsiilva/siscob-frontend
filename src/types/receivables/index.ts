export type ReceivableStatus = "OPEN" | "PAID" | "CANCELED";

export interface Receivable {
  id: number;
  customerId: number;
  companyId: number;
  customer: {
    id: number;
    name: string;
    tradeName: string | null;
    document: string | null;
  };
  company: {
    id: number;
    name: string;
  };
  document: string | null;
  issueDate: string;
  dueDate: string;
  paymentDate: string | null;
  amount: number;
  interest: number;
  penalty: number;
  discount: number;
  collectionType: {
    id: number;
    description: string | null;
  };
  status: ReceivableStatus;
  balance: number;
  daysOverdue: number;
}

export interface ReceivablesQuery {
  page: number;
  pageSize: number;
  search?: string;
  companyId?: number;
  status?: ReceivableStatus;
  dueStart?: string;
  dueEnd?: string;
  overdueDaysMin?: number;
  overdueDaysMax?: number;
}

export interface ReceivablesResponse {
  data: Receivable[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}
