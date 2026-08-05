import { describe, expect, it } from "vitest";

import { ApiRequestError } from "@/services/api";

import { getSafeApiErrorMessage } from "./api-error-message";

describe("getSafeApiErrorMessage", () => {
  it("does not expose a technical API message", () => {
    const error = new ApiRequestError({ status: 500, message: "stack trace interno", url: "/timeline" });

    expect(getSafeApiErrorMessage(error, { defaultMessage: "Falha segura." })).toBe("Falha segura.");
  });

  it("maps known statuses to actionable messages", () => {
    const error = new ApiRequestError({ status: 403, message: "internal", url: "/next-actions" });

    expect(getSafeApiErrorMessage(error, {
      defaultMessage: "Falha segura.",
      byStatus: { 403: "Acesso negado." },
    })).toBe("Acesso negado.");
  });
});
