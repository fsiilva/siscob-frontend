import { ZodError } from "zod";

import { ApiRequestError } from "@/services/api";

export function getCollectionOpportunitiesErrorMessage(error: unknown) {
  if (error instanceof ZodError) return "Os dados recebidos das oportunidades possuem um formato inesperado. Tente novamente.";
  if (!(error instanceof ApiRequestError)) return "Erro de rede ao carregar as oportunidades. Verifique sua conexão e tente novamente.";
  if (error.status === 401) return "Sua sessão expirou. Entre novamente para consultar as oportunidades.";
  if (error.status === 403) return "Você não possui acesso às oportunidades deste cliente.";
  if (error.status === 404) return "As oportunidades deste cliente não foram encontradas.";
  return "Não foi possível carregar as oportunidades de cobrança.";
}
