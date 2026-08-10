import { QueryClient } from "@tanstack/react-query";
import { describe, expect, it, vi } from "vitest";

import { ApiRequestError } from "@/services/api";

import {
  invalidateNextActionQueries,
  nextActionQueryKeys,
  refreshNextActionsOnConflict,
} from "./useNextActionQueries";

describe("queries de Next Actions", () => {
  it("invalida todas as queries relacionadas após mutations", async () => {
    const queryClient = new QueryClient();
    const invalidate = vi.spyOn(queryClient, "invalidateQueries").mockResolvedValue(undefined);
    await invalidateNextActionQueries(queryClient, 123, "operation-1");
    expect(invalidate).toHaveBeenCalledTimes(9);
    expect(invalidate).toHaveBeenCalledWith({ exact: true, queryKey: nextActionQueryKeys.mine });
    expect(invalidate).toHaveBeenCalledWith({ exact: true, queryKey: nextActionQueryKeys.customer(123) });
    expect(invalidate).toHaveBeenCalledWith({ exact: true, queryKey: nextActionQueryKeys.customerDetails(123) });
    expect(invalidate).toHaveBeenCalledWith({ queryKey: nextActionQueryKeys.operationQueue });
    expect(invalidate).toHaveBeenCalledWith({ exact: true, queryKey: nextActionQueryKeys.customerTimeline(123) });
    expect(invalidate).toHaveBeenCalledWith({ exact: true, queryKey: nextActionQueryKeys.operationDetails("operation-1") });
    expect(invalidate).toHaveBeenCalledWith({ exact: true, queryKey: nextActionQueryKeys.operationTimeline("operation-1") });
    expect(invalidate).toHaveBeenCalledWith({ exact: true, queryKey: nextActionQueryKeys.dashboardOverview });
    expect(invalidate).toHaveBeenCalledWith({ exact: true, queryKey: nextActionQueryKeys.managementDashboard });
  });

  it("refaz as listas em conflito 409", async () => {
    const queryClient = new QueryClient();
    const invalidate = vi.spyOn(queryClient, "invalidateQueries").mockResolvedValue(undefined);
    const conflict = new ApiRequestError({ status: 409, message: "Conflict", url: "/next-actions/action-1" });
    await refreshNextActionsOnConflict(conflict, queryClient, 123, "operation-1");
    expect(invalidate).toHaveBeenCalledTimes(9);
  });

  it("não refaz listas por erros sem conflito", async () => {
    const queryClient = new QueryClient();
    const invalidate = vi.spyOn(queryClient, "invalidateQueries").mockResolvedValue(undefined);
    const forbidden = new ApiRequestError({ status: 403, message: "Forbidden", url: "/next-actions/action-1" });
    await refreshNextActionsOnConflict(forbidden, queryClient, 123);
    expect(invalidate).not.toHaveBeenCalled();
  });
});
