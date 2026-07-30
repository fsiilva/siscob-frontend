import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

describe("migração da Timeline", () => {
  it("Customer 360 e TimelineList não dependem do Context em memória", () => {
    const list = readFileSync(fileURLToPath(new URL("timeline-list.tsx", import.meta.url)), "utf8");
    const customer = readFileSync(fileURLToPath(new URL("../customers/customer-360-page.tsx", import.meta.url)), "utf8");
    expect(list).not.toContain("useTimeline");
    expect(list).not.toContain("TimelineContext");
    expect(customer).not.toContain("useTimeline");
  });

  it("o salvamento da interação não cria eventos locais", () => {
    const queue = readFileSync(fileURLToPath(new URL("../operation/work-queue.tsx", import.meta.url)), "utf8");
    expect(queue).not.toContain("addEvent");
    expect(queue).not.toContain("TimelineEvent");
  });
});
