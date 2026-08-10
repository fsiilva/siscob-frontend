import { ZodError } from "zod";

import { getSafeApiErrorMessage } from "@/lib/api-error-message";

export function getProductivityErrorMessage(error: unknown) {
  if (error instanceof ZodError) return "A resposta de produtividade recebida é inválida. Tente novamente mais tarde.";
  return getSafeApiErrorMessage(error, {
    defaultMessage: "Não foi possível consultar a produtividade.",
    byStatus: {
      400: "O período ou operador informado não é válido.",
      401: "Sua sessão expirou. Entre novamente para continuar.",
      403: "Você não tem permissão para consultar estes dados de produtividade.",
    },
  });
}
