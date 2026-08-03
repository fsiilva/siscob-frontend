import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { operationQueryKeys } from "./useOperations";

describe("useOperationTimeline", () => {
  it("usa a query key definida e o serviço dedicado sem paginação", () => {
    const source = readFileSync(fileURLToPath(new URL("./useOperations.ts", import.meta.url)), "utf8");
    expect(operationQueryKeys.timeline("op-1")).toEqual(["operations", "op-1", "timeline"]);
    expect(source).toContain("getOperationTimeline(operationId as string)");
    expect(source).not.toContain("getCustomerTimeline(operation?.customerId");
  });
});
