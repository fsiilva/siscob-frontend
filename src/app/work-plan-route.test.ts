import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const source = (relative: string) => readFileSync(fileURLToPath(new URL(relative, import.meta.url)), "utf8");

describe("work plan route", () => {
  it("expõe /operations/work-plan no layout autenticado", () => expect(source("./(dashboard)/operations/work-plan/page.tsx")).toContain("<WorkPlan />"));
  it("adiciona Plano de Trabalho próximo de Minha Operação", () => {
    const sidebar = source("../components/layout/app-sidebar.tsx");
    expect(sidebar).toContain('{ label: "Plano de Trabalho", icon: BriefcaseBusiness, href: "/operations/work-plan" }');
    expect(Math.abs(sidebar.indexOf('label: "Plano de Trabalho"') - sidebar.indexOf('label: "Minha Operação"'))).toBeLessThan(150);
  });
});
