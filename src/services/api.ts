import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export interface ApiErrorDetails {
  status: number | null;
  message: string;
  url: string;
}

export class ApiRequestError extends Error {
  readonly status: number | null;
  readonly url: string;

  constructor({ status, message, url }: ApiErrorDetails) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
    this.url = url;
  }
}

function getResponseMessage(data: unknown, fallback: string) {
  if (typeof data === "object" && data !== null && "message" in data) {
    const { message } = data;

    if (typeof message === "string") return message;
    if (Array.isArray(message)) return message.join(", ");
  }

  return fallback;
}

function getRequestUrl(requestBaseUrl?: string, requestPath?: string) {
  if (!requestBaseUrl) return requestPath ?? "URL indisponível";

  try {
    return new URL(requestPath ?? "", requestBaseUrl).toString();
  } catch {
    return `${requestBaseUrl}${requestPath ?? ""}`;
  }
}

export const api = axios.create({
  baseURL,
  timeout: 15_000,
  headers: {
    Accept: "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (!axios.isAxiosError(error)) return Promise.reject(error);

    const details: ApiErrorDetails = {
      status: error.response?.status ?? null,
      message: getResponseMessage(error.response?.data, error.message),
      url: getRequestUrl(error.config?.baseURL, error.config?.url),
    };

    console.error("Falha na requisição à API", details);

    return Promise.reject(new ApiRequestError(details));
  },
);
