import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const source = (relative: string) => readFileSync(fileURLToPath(new URL(relative, import.meta.url)), "utf8");

describe("Customers route", () => {
  it("expõe /customers no layout autenticado", () => expect(source("./(dashboard)/customers/page.tsx")).toContain("<CustomersCenter />"));
  it("ativa o item Clientes no menu para todos os papéis", () => {
    const sidebar = source("../components/layout/app-sidebar.tsx");
    expect(sidebar).toContain('{ label: "Clientes", icon: Users, href: "/customers" }');
    expect(sidebar).not.toContain('{ label: "Clientes", icon: Users, href: "/customers", adminOnly: true }');
  });
});
