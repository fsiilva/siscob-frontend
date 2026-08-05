import type { UserRole } from "@/types/auth";

export function canViewNavigationItem(adminOnly: boolean | undefined, role: UserRole | undefined) {
  return !adminOnly || role === "ADMIN";
}
