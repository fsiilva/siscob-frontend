import { ZodError } from "zod";

import { getSafeApiErrorMessage } from "@/lib/api-error-message";

export function getWorkPlanErrorMessage(error: unknown) {
  if (error instanceof ZodError) return "A resposta do plano de trabalho possui um formato inesperado. Tente novamente.";
  return getSafeApiErrorMessage(error, {
    defaultMessage: "Não foi possível consultar o plano de trabalho.",
    byStatus: {
      400: "Revise os filtros informados e tente novamente.",
      401: "Sua sessão expirou. Entre novamente para continuar.",
      403: "Você não possui acesso a este plano de trabalho.",
      404: "O plano de trabalho solicitado não foi encontrado.",
      409: "Os dados foram alterados. Atualize o plano e tente novamente.",
      422: "Os filtros informados não atendem às regras do plano de trabalho.",
    },
  });
}
