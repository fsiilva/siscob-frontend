import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

describe("migração das telas de Next Actions", () => {
  it.each([
    "next-action-list.tsx",
    "next-action-card.tsx",
    "next-actions-section.tsx",
    "customer-next-action.tsx",
  ])("não usa o Context em %s", (fileName) => {
    const source = readFileSync(fileURLToPath(new URL(fileName, import.meta.url)), "utf8");
    expect(source).not.toContain("useNextActions");
    expect(source).not.toContain("NextActionsContext");
  });
});
