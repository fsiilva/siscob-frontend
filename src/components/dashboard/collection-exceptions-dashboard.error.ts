import { ZodError } from "zod";

import { getSafeApiErrorMessage } from "@/lib/api-error-message";

export function getCollectionExceptionsErrorMessage(error: unknown) {
  if (error instanceof ZodError) return "A resposta das exceções de cobrança é inválida. Tente novamente mais tarde.";
  return getSafeApiErrorMessage(error, {
    defaultMessage: "Não foi possível consultar as exceções de cobrança.",
    byStatus: {
      400: "Revise os filtros informados e tente novamente.",
      401: "Sua sessão expirou. Entre novamente para continuar.",
      403: "Este painel está disponível apenas para administradores.",
    },
  });
}
