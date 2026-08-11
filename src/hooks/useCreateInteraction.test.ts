import { QueryClient } from "@tanstack/react-query";
import { describe, expect, it, vi } from "vitest";

import { interactionQueryKeys, invalidateInteractionQueries } from "./useCreateInteraction";

describe("invalidação após criar interação", () => {
  it("invalida todos os dados relacionados sem criar registros locais", async () => {
    const queryClient = new QueryClient();
    const invalidate = vi.spyOn(queryClient, "invalidateQueries").mockResolvedValue(undefined);

    await invalidateInteractionQueries(queryClient, 123, "operation-1");

    expect(invalidate).toHaveBeenCalledTimes(10);
    expect(invalidate).toHaveBeenCalledWith({ exact: true, queryKey: interactionQueryKeys.customerInteractions(123) });
    expect(invalidate).toHaveBeenCalledWith({ exact: true, queryKey: interactionQueryKeys.customerNextActions(123) });
    expect(invalidate).toHaveBeenCalledWith({ exact: true, queryKey: interactionQueryKeys.userNextActions });
    expect(invalidate).toHaveBeenCalledWith({ queryKey: interactionQueryKeys.operationQueue });
    expect(invalidate).toHaveBeenCalledWith({ queryKey: interactionQueryKeys.workPlan });
    expect(invalidate).toHaveBeenCalledWith({ exact: true, queryKey: interactionQueryKeys.operationDetails("operation-1") });
    expect(invalidate).toHaveBeenCalledWith({ exact: true, queryKey: interactionQueryKeys.operationTimeline("operation-1") });
    expect(invalidate).toHaveBeenCalledWith({ exact: true, queryKey: interactionQueryKeys.dashboardOverview });
    expect(invalidate).toHaveBeenCalledWith({ exact: true, queryKey: interactionQueryKeys.managementDashboard });
    expect(invalidate).toHaveBeenCalledWith({ exact: true, queryKey: interactionQueryKeys.customer360(123) });
  });
});
