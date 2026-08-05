import type { ManagementDashboard } from "@/types/management-dashboard";

const labels: Record<string, string> = {
  READY: "Prontas",
  ASSIGNED: "Atribuídas",
  IN_PROGRESS: "Em andamento",
  WAITING: "Aguardando",
  BLOCKED: "Bloqueadas",
  COMPLETED: "Concluídas",
  CANCELLED: "Canceladas",
  LOW: "Baixa",
  NORMAL: "Normal",
  HIGH: "Alta",
  URGENT: "Urgente",
};

export function managementLabel(value: string) {
  return labels[value] ?? value;
}

export function isManagementDashboardEmpty(data: ManagementDashboard) {
  return data.operations.total === 0 &&
    data.operators.every((operator) =>
      operator.assigned === 0 &&
      operator.inProgress === 0 &&
      operator.completedToday === 0 &&
      operator.overdueNextActions === 0,
    );
}
