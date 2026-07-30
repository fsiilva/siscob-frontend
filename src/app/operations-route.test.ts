import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

function source(relativeUrl: string) {
  return readFileSync(fileURLToPath(new URL(relativeUrl, import.meta.url)), "utf8");
}

describe("rota autenticada de Operations", () => {
  it("expõe /operations pelo grupo dashboard reutilizando OperationPage", () => {
    const page = source("./(dashboard)/operations/page.tsx");
    expect(page).toContain('import { OperationPage } from "@/components/operation/operation-page"');
    expect(page).toContain("return <OperationPage />");
    expect(source("./(dashboard)/layout.tsx")).toContain("<ApplicationShell>{children}</ApplicationShell>");
  });

  it("mantém a rota singular existente sem duplicar a implementação", () => {
    const legacyPage = source("./(dashboard)/operation/page.tsx");
    expect(legacyPage).toContain("OperationPage");
    expect(legacyPage).not.toContain("useOperations");
  });

  it("aponta o menu para /operations", () => {
    const sidebar = source("../components/layout/app-sidebar.tsx");
    expect(sidebar).toContain('{ label: "Minha Operação", icon: CircleDollarSign, href: "/operations" }');
  });

  it("protege o layout dashboard com o AuthProvider existente", () => {
    const shell = source("../components/layout/application-shell.tsx");
    expect(shell).toContain("useAuth()");
    expect(shell).toContain('router.replace("/login")');
  });
});
