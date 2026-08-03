import { ApiRequestError } from "@/services/api";
import type { AuthUser } from "@/types/auth";
import type { CreateOperationRequest, OperationPriority } from "@/types/operations-api";

export interface CreateOperationValues {
  companyId: string;
  portfolioId: string;
  customerId: string;
  receivableId: string;
  objective: string;
  priority: OperationPriority;
}

export const initialCreateOperationValues: CreateOperationValues = {
  companyId: "", portfolioId: "", customerId: "", receivableId: "", objective: "", priority: "NORMAL",
};

export function canCreateOperation(user: AuthUser | null) {
  return user?.role === "ADMIN";
}

export function changeCreateOperationCustomer(values: CreateOperationValues, customerId: string): CreateOperationValues {
  return { ...values, customerId, receivableId: "" };
}

export function changeCreateOperationCompany(values: CreateOperationValues, companyId: string): CreateOperationValues {
  return { ...values, companyId, portfolioId: "", receivableId: "" };
}

export function isCreateOperationValid(values: CreateOperationValues) {
  return Boolean(values.companyId.trim() && values.portfolioId.trim() && values.customerId.trim() && values.objective.trim() && values.priority);
}

export function buildCreateOperationRequest(values: CreateOperationValues): CreateOperationRequest {
  return {
    companyId: values.companyId.trim(), portfolioId: values.portfolioId.trim(), customerId: values.customerId.trim(),
    ...(values.receivableId.trim() ? { receivableId: values.receivableId.trim() } : {}),
    objective: values.objective.trim(), priority: values.priority,
  };
}

export function createOperationErrorMessage(error: Error) {
  if (!(error instanceof ApiRequestError)) return "Falha de rede. Verifique sua conexão e tente novamente.";
  if (error.status === 400) return "Revise os campos obrigatórios e tente novamente.";
  if (error.status === 401) return "Sua sessão expirou. Entre novamente para continuar.";
  if (error.status === 403) return "Você não tem permissão para criar Operations.";
  if (error.status === 404) return "Um dos vínculos selecionados não foi encontrado.";
  if (error.status === 409) return "Já existe uma alteração conflitante. Atualize os dados e tente novamente.";
  if (error.status === 422) return "Os dados selecionados não atendem às regras atuais da Operation.";
  return "Não foi possível criar a Operation.";
}
