import { getSafeApiErrorMessage } from "@/lib/api-error-message";

export function getCustomer360ErrorMessage(error: unknown) {
  return getSafeApiErrorMessage(error, {
    defaultMessage: "Não foi possível consultar os dados consolidados do cliente.",
    byStatus: {
      401: "Sua sessão expirou. Entre novamente para continuar.",
      403: "Você não possui acesso a este cliente.",
      404: "Cliente não encontrado.",
    },
  });
}
