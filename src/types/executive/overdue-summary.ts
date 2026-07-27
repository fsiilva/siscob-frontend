export interface OverdueSummary {
  receivablesCount: number;
  totalAmount: number;
  averageTicket: number;
  oldestDueDate: string | null;
  oldestDelayDays: number;
}
