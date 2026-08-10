import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const source = readFileSync(fileURLToPath(new URL("./operation-details-drawer.tsx", import.meta.url)), "utf8");

describe("OperationDetailsDrawer", () => {
  it("renders header, summary, next actions, reused timeline, interactions and workflow footer", () => {
    for (const text of ["Resumo", "Próximas ações", "Timeline", "Interactions", "Workflow", "OperationTimeline", "OperationActions"]) expect(source).toContain(text);
    for (const field of ["Empresa", "Carteira", "Cliente", "Recebível", "Operador responsável", "Version", "Waiting", "Blocked", "Completion", "Cancelamento"]) expect(source).toContain(field);
  });

  it("reuses the actionable Next Action card with Operation context", () => {
    expect(source).toContain("NextActionCard");
    expect(source).toContain("customerId: operation.customerId");
    expect(source).toContain("operationId={operation.id}");
  });

  it("reuses InteractionDrawer and sends the complete Operation context", () => {
    expect(source).toContain("InteractionDrawer");
    expect(source).toContain("buildInteractionPayload");
    expect(source).toContain("operationId: operation.id");
    for (const field of ["company:", "portfolio:", "receivable:", "objective:"]) expect(source).toContain(field);
  });

  it("uses the timeline embedded in details without a second timeline request", () => {
    expect(source).toContain("items={details.timeline}");
    expect(source).not.toContain("useOperationTimeline");
    expect(source).not.toContain("getOperationTimeline");
  });

  it("renders interaction date, type and description", () => {
    expect(source).toContain("interaction.createdAt");
    expect(source).toContain("interaction.channel");
    expect(source).toContain("interaction.notes");
  });

  it("implements loading, error, retry and empty states", () => {
    expect(source).toContain("query.isLoading");
    expect(source).toContain("query.isError");
    expect(source).toContain("query.refetch()");
    expect(source).toContain("Nenhuma próxima ação registrada.");
    expect(source).toContain("Nenhuma interação registrada.");
  });
});
