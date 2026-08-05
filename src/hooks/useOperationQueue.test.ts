import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { workQueueKeys } from "./useOperationQueue";

describe("work queue query", () => {
  it("includes filters and pagination in the required key", () => {
    const filters = { page: 2, pageSize: 50, priority: "HIGH" as const };
    expect(workQueueKeys.list(filters)).toEqual(["operations", "work-queue", filters]);
  });
  it("does not poll", () => {
    const source = readFileSync(fileURLToPath(new URL("./useOperationQueue.ts", import.meta.url)), "utf8");
    expect(source).not.toContain("refetchInterval");
  });
});
