import { describe, expect, it } from "vitest";

import { ApiRequestError } from "@/services/api";

import { buildOperationCommandPayload, operationErrorMessage } from "./operation-command";

const values = { assignedOperatorId: " operator-2 ", reason: " motivo ", reviewAt: "2026-08-01T10:30", result: " resultado ", priority: "HIGH" as const };

describe("Operation command payload", () => {
  it("inclui expectedVersion em todos os comandos", () => {
    for (const command of ["assign", "release", "transfer", "start", "wait", "block", "resume", "complete", "cancel", "reopen", "changePriority"] as const) {
      expect(buildOperationCommandPayload(command, 7, values).expectedVersion).toBe(7);
    }
  });

  it("monta os contratos específicos sem campos técnicos extras", () => {
    expect(buildOperationCommandPayload("assign", 7, values)).toEqual({ expectedVersion: 7, assignedOperatorId: "operator-2" });
    expect(buildOperationCommandPayload("assign", 7, { ...values, assignedOperatorId: "" })).toEqual({ expectedVersion: 7 });
    expect(buildOperationCommandPayload("release", 7, values)).toEqual({ expectedVersion: 7, reason: "motivo" });
    expect(buildOperationCommandPayload("transfer", 7, values)).toEqual({ expectedVersion: 7, assignedOperatorId: "operator-2", reason: "motivo" });
    expect(buildOperationCommandPayload("complete", 7, values)).toEqual({ expectedVersion: 7, result: "resultado" });
    expect(buildOperationCommandPayload("changePriority", 7, values)).toEqual({ expectedVersion: 7, priority: "HIGH", reason: "motivo" });
    expect(buildOperationCommandPayload("wait", 7, values)).toMatchObject({ expectedVersion: 7, reason: "motivo", reviewAt: expect.stringContaining("2026-08-01") });
  });
});

describe("Operation errors", () => {
  it.each([
    [400, "Revise os campos"], [401, "sessão expirou"], [403, "permissão"], [404, "não foi encontrado"],
    [409, "alterada por outro usuário"], [422, "regra de negócio"],
  ])("traduz HTTP %s sem expor mensagem técnica", (status, expected) => {
    const error = new ApiRequestError({ status, message: "stack trace interno", url: "/operations/op-1" });
    expect(operationErrorMessage(error)).toContain(expected);
    expect(operationErrorMessage(error)).not.toContain("stack trace");
  });

  it("trata falha de rede", () => {
    expect(operationErrorMessage(new Error("ECONNRESET"))).toContain("Falha de rede");
  });
});
