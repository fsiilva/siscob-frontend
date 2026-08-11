import { ApiRequestError } from "@/services/api";

export function paymentPromiseErrorMessage(error: Error) {
  if (!(error instanceof ApiRequestError)) return "Falha de rede. Verifique sua conexão e tente novamente.";
  if (error.status === 400) return "Revise os dados da promessa e tente novamente.";
  if (error.status === 401) return "Sua sessão expirou. Entre novamente para continuar.";
  if (error.status === 403) return "Você não tem permissão para alterar esta promessa.";
  if (error.status === 404) return "A promessa ou a cobrança não foi encontrada.";
  if (error.status === 409) return "A promessa foi atualizada por outro usuário. Os dados serão recarregados.";
  if (error.status === 422) return "Não foi possível registrar a promessa com os dados informados.";
  return "Não foi possível atualizar a promessa de pagamento.";
}
