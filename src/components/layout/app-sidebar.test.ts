import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import { canViewNavigationItem } from "./navigation-authorization";

describe("AppSidebar authorization", () => {
  it("shows Dashboard Gerencial only to ADMIN", () => {
    const source = readFileSync(fileURLToPath(new URL("./app-sidebar.tsx", import.meta.url)), "utf8");
    expect(source).toContain("Dashboard Gerencial");
    expect(source).toContain("adminOnly: true");
    expect(canViewNavigationItem(true, "ADMIN")).toBe(true);
    expect(canViewNavigationItem(true, "USER")).toBe(false);
  });

  it("shows Productivity to ADMIN and USER", () => {
    const source = readFileSync(fileURLToPath(new URL("./app-sidebar.tsx", import.meta.url)), "utf8");
    expect(source).toContain("Produtividade");
    expect(canViewNavigationItem(undefined, "ADMIN")).toBe(true);
    expect(canViewNavigationItem(undefined, "USER")).toBe(true);
  });

  it("shows Customers to ADMIN and USER", () => {
    const source = readFileSync(fileURLToPath(new URL("./app-sidebar.tsx", import.meta.url)), "utf8");
    expect(source).toContain('href: "/customers"');
    expect(canViewNavigationItem(undefined, "ADMIN")).toBe(true);
    expect(canViewNavigationItem(undefined, "USER")).toBe(true);
  });
});
