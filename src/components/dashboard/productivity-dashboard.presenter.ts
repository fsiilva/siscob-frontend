import type { ProductivityDashboard, ProductivityFilters } from "@/types/productivity-dashboard";

export type ProductivityShortcut = "today" | "7days" | "30days";

export function getProductivityPeriod(shortcut: ProductivityShortcut, now = new Date()): Pick<ProductivityFilters, "from" | "to"> {
  const from = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const days = shortcut === "7days" ? 7 : shortcut === "30days" ? 30 : 1;
  from.setDate(from.getDate() - (days - 1));
  return { from: toDateInput(from), to: toDateInput(now) };
}

export function getDefaultProductivityFilters(now = new Date()): ProductivityFilters {
  return getProductivityPeriod("today", now);
}

export function getProductivityEfficiency(data: ProductivityDashboard) {
  return {
    contactRate: percentage(data.summary.contactMade, data.summary.interactions),
    promiseRate: percentage(data.summary.promisesToPay, data.summary.contactMade),
  };
}

export function sortProductivityOperators(data: ProductivityDashboard) {
  return [...data.operators].sort((left, right) => right.interactions - left.interactions);
}

export function isProductivityDashboardEmpty(data: ProductivityDashboard) {
  return Object.values(data.summary).every((value) => value === 0);
}

function percentage(numerator: number, denominator: number) {
  return denominator === 0 ? 0 : (numerator / denominator) * 100;
}

function toDateInput(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
