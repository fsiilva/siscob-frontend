import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { operationQueryKeys } from "./useOperations";

describe("useOperationDetails", () => {
  it("uses the dedicated details service and stable query key", () => {
    const source = readFileSync(fileURLToPath(new URL("./useOperations.ts", import.meta.url)), "utf8");
    expect(operationQueryKeys.details("op-1")).toEqual(["operations", "op-1", "details"]);
    expect(source).toContain("getOperationDetails(id as string)");
    expect(source).toContain("enabled: Boolean(id)");
  });
});
