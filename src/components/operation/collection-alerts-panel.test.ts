import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const source = readFileSync(fileURLToPath(new URL("./collection-alerts-panel.tsx", import.meta.url)), "utf8");

describe("CollectionAlertsPanel", () => {
  it("renderiza labels, reasons e severidades exatamente na ordem recebida", () => {
    for (const text of ["Alertas", "alerts.map", "alert.label", "alert.reason", "presentAlertSeverity(alert.severity)"]) expect(source).toContain(text);
    expect(source).not.toContain(".sort(");
  });
  it("não mostra painel vazio nem badge global para NONE", () => {
    expect(source).toContain("if (alerts.length === 0) return null");
    expect(source).toContain('highestSeverity !== "NONE"');
  });
  it("não calcula alertas ou severidade", () => {
    expect(source).not.toMatch(/cadence\.(status|attention)/);
    expect(source).not.toMatch(/score\s*[+*/-]/);
    expect(source).not.toMatch(/alerts\s*=/);
  });
});
