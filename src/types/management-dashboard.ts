export interface ManagementCount {
  value: string;
  count: number;
}

export interface ManagementOperator {
  id: string;
  name: string;
  assigned: number;
  inProgress: number;
  completedToday: number;
  overdueNextActions: number;
}

export interface ManagementEntityCount {
  id: string;
  name: string;
  operations: number;
}

export interface ManagementDashboard {
  operations: {
    total: number;
    byStatus: ManagementCount[];
    byPriority: ManagementCount[];
  };
  operators: ManagementOperator[];
  companies: ManagementEntityCount[];
  portfolios: ManagementEntityCount[];
}
