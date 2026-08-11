import { describe, expect, it } from "vitest";

import { alertSeverityVariant, presentAlertSeverity } from "./collection-alert.presenter";

describe("collection alert presenter", () => {
  it.each([["INFO", "Informativo", "canceled"], ["WARNING", "Atenção", "warning"], ["CRITICAL", "Crítico", "danger"]] as const)("apresenta %s com texto e estilo", (severity, label, variant) => {
    expect(presentAlertSeverity(severity)).toBe(label);
    expect(alertSeverityVariant(severity)).toBe(variant);
  });
});
