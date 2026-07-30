import { QueryClient } from "@tanstack/react-query";
import { describe, expect, it, vi } from "vitest";

import { interactionQueryKeys, invalidateInteractionQueries } from "./useCreateInteraction";

describe("invalidação após criar interação", () => {
  it("invalida todos os dados relacionados sem criar registros locais", async () => {
    const queryClient = new QueryClient();
    const invalidate = vi.spyOn(queryClient, "invalidateQueries").mockResolvedValue(undefined);

    await invalidateInteractionQueries(queryClient, 123);

    expect(invalidate).toHaveBeenCalledTimes(7);
    expect(invalidate).toHaveBeenCalledWith({ exact: true, queryKey: interactionQueryKeys.customerInteractions(123) });
    expect(invalidate).toHaveBeenCalledWith({ exact: true, queryKey: interactionQueryKeys.customerNextActions(123) });
    expect(invalidate).toHaveBeenCalledWith({ exact: true, queryKey: interactionQueryKeys.userNextActions });
    expect(invalidate).toHaveBeenCalledWith({ exact: true, queryKey: interactionQueryKeys.customer(123) });
    expect(invalidate).toHaveBeenCalledWith({ exact: true, queryKey: interactionQueryKeys.customerSummary(123) });
    expect(invalidate).toHaveBeenCalledWith({ exact: true, queryKey: interactionQueryKeys.operationQueue });
    expect(invalidate).toHaveBeenCalledWith({ exact: true, queryKey: interactionQueryKeys.customerTimeline(123) });
  });
});
