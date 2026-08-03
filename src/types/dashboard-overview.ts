export interface DashboardOverview {
  operations: {
    total: number;
    ready: number;
    assigned: number;
    inProgress: number;
    waiting: number;
    blocked: number;
    completed: number;
    cancelled: number;
  };
  priorities: { low: number; normal: number; high: number; urgent: number };
  nextActions: { pending: number; overdue: number; today: number };
  interactions: { today: number };
}
