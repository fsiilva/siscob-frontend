import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const source = readFileSync(fileURLToPath(new URL("./usePaymentPromises.ts", import.meta.url)), "utf8");
describe("payment promise mutations", () => {
  it("invalida details, timeline, filas e dashboards sem retry", () => {
    for (const text of ["operationQueryKeys.details", "operationQueryKeys.timeline", "sharedQueryKeys.workPlan", "sharedQueryKeys.operationQueue", "collectionExceptionsDashboard", "managementDashboard", "dashboardOverview", "retry: false"]) expect(source).toContain(text);
  });
  it("recarrega após conflito 409 sem repetir mutation", () => expect(source).toContain("error.status === 409 ? refreshPaymentPromiseQueries"));
});
