import type { DashboardOverview } from "@/types/dashboard-overview";

export function getOperationCards(data: DashboardOverview) {
  return [
    { label: "Total de Operations", value: data.operations.total },
    { label: "Pendentes", value: data.operations.ready + data.operations.assigned },
    { label: "Em andamento", value: data.operations.inProgress },
    { label: "Concluídas", value: data.operations.completed },
  ];
}

export function isDashboardEmpty(data: DashboardOverview) {
  return data.operations.total === 0 && data.nextActions.pending === 0 && data.nextActions.overdue === 0 && data.nextActions.today === 0 && data.interactions.today === 0;
}
