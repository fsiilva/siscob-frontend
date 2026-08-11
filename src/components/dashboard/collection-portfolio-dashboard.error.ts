import { ZodError } from "zod";

import { getSafeApiErrorMessage } from "@/lib/api-error-message";

export function getCollectionPortfolioErrorMessage(error: unknown) {
  if (error instanceof ZodError) return "A resposta da carteira de cobrança é inválida. Tente novamente mais tarde.";
  return getSafeApiErrorMessage(error, {
    defaultMessage: "Não foi possível consultar a carteira de cobrança.",
    byStatus: {
      400: "O filtro de empresa informado não é válido.",
      401: "Sua sessão expirou. Entre novamente para continuar.",
      403: "Este painel está disponível apenas para administradores.",
    },
  });
}
