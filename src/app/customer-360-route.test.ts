import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const source = (relative: string) => readFileSync(fileURLToPath(new URL(relative, import.meta.url)), "utf8");

describe("Customer 360 route", () => {
  it("expõe /customers/:id no layout autenticado", () => {
    const page = source("./(dashboard)/customers/[id]/page.tsx");
    expect(page).toContain("Customer360Dashboard");
    expect(page).toContain("params: Promise<{ id: string }>");
  });

  it("navega para Customer 360 ao clicar no cliente exibido na lista", () => {
    const table = source("../components/receivables/receivables-table.tsx");
    expect(table).toContain("href={`/customers/${receivable.customer.id}`}");
  });
});
