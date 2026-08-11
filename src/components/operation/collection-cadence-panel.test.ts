import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const source = readFileSync(fileURLToPath(new URL("./collection-cadence-panel.tsx", import.meta.url)), "utf8");

describe("CollectionCadencePanel", () => {
  it("apresenta label, attention e reasons fornecidas pela API", () => {
    for (const text of ["Acompanhamento", "cadence.label", "presentCadenceAttention(cadence.attention)", "cadence.reasons.length", "{reason}"]) expect(source).toContain(text);
  });
  it("não calcula status, attention ou reasons", () => {
    expect(source).not.toMatch(/cadence\.status\s*===/);
    expect(source).not.toMatch(/\.sort\(/);
    expect(source).not.toMatch(/reasons\s*=/);
  });
});
