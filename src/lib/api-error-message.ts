import { ApiRequestError } from "@/services/api";

interface ApiErrorMessages {
  defaultMessage: string;
  byStatus?: Partial<Record<number, string>>;
}

export function getSafeApiErrorMessage(error: unknown, messages: ApiErrorMessages) {
  if (!(error instanceof ApiRequestError)) {
    return "Erro de rede. Verifique sua conexão e tente novamente.";
  }

  return messages.byStatus?.[error.status ?? 0] ?? messages.defaultMessage;
}
