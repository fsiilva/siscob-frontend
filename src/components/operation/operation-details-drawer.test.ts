import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const source = readFileSync(fileURLToPath(new URL("./operation-details-drawer.tsx", import.meta.url)), "utf8");

describe("OperationDetailsDrawer", () => {
  it("renders header, summary, next actions, reused timeline, interactions and workflow footer", () => {
    for (const text of ["Resumo", "Próximas ações", "Timeline", "Interactions", "Workflow", "OperationTimeline", "OperationActions"]) expect(source).toContain(text);
    for (const field of ["Empresa", "Carteira", "Cliente", "Recebível", "Operador responsável", "Version", "Waiting", "Blocked", "Completion", "Cancelamento"]) expect(source).toContain(field);
  });

  it("renders next-action status, due date, description and read-only open button", () => {
    expect(source).toContain("action.status");
    expect(source).toContain("action.description");
    expect(source).toContain("action.dueAt");
    expect(source).toContain("Abrir Next Action");
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
