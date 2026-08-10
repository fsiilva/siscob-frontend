import { ZodError } from "zod";

import { getSafeApiErrorMessage } from "@/lib/api-error-message";

export function getCustomer360ErrorMessage(error: unknown) {
  if (error instanceof ZodError) return "Os dados recebidos do cliente possuem um formato inesperado. Tente novamente.";
  return getSafeApiErrorMessage(error, {
    defaultMessage: "Não foi possível consultar os dados consolidados do cliente.",
    byStatus: {
      401: "Sua sessão expirou. Entre novamente para continuar.",
      403: "Você não possui acesso a este cliente.",
      404: "Cliente não encontrado.",
    },
  });
}
