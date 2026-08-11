import { describe, expect, it } from "vitest";

import { operatorQueryKeys } from "./useOperators";

describe("operator query keys", () => {
  it("inclui a busca na chave centralizada", () => expect(operatorQueryKeys.list({ search: "Ana" })).toEqual(["operators", { search: "Ana" }]));
});
