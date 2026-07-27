export interface ExecutiveAlerts {
  criticalOverdueCustomers: number;
  contractsExpiringNext30Days: number;
  highRiskReceivables: number;
  lastSislocSync: string | null;
}
