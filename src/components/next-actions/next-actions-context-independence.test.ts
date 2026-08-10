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
  it("reuses complete, reschedule and cancel mutations with a single-submission lock", () => {
    const source = readFileSync(fileURLToPath(new URL("next-action-card.tsx", import.meta.url)), "utf8");
    for (const action of ["completeMutation.mutateAsync", "rescheduleMutation.mutateAsync", "cancelMutation.mutateAsync"]) expect(source).toContain(action);
    expect(source).toContain("submissionLock.current");
    expect(source).toContain("disabled={!active || isPending}");
  });

  it("keeps authorization errors safe and the card usable", () => {
    const source = readFileSync(fileURLToPath(new URL("next-action-card.tsx", import.meta.url)), "utf8");
    expect(source).toContain("403:");
    expect(source).toContain("getSafeApiErrorMessage");
    expect(source).not.toContain("error.message");
  });
});
