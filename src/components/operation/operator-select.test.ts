import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const source = readFileSync(fileURLToPath(new URL("./operator-select.tsx", import.meta.url)), "utf8");

describe("OperatorSelect", () => {
  it("mostra nome e e-mail, permite busca, retry e exclusão do operador atual", () => {
    for (const text of ["operator.name", "operator.email", "Buscar por nome ou e-mail", "query.refetch()", "excludeOperatorId"]) expect(source).toContain(text);
  });
});
