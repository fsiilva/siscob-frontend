import { describe, expect, it } from "vitest";

import { canFetchNextTimelinePage, getNextTimelinePageParam } from "./useCustomerTimeline";

describe("paginação da Timeline", () => {
  it("usa nextCursor quando há mais eventos", () => {
    expect(getNextTimelinePageParam({ hasMore: true, nextCursor: "cursor-from-api" })).toBe("cursor-from-api");
  });

  it("não fabrica cursor quando a API não fornece", () => {
    expect(getNextTimelinePageParam({ hasMore: true, nextCursor: null })).toBeUndefined();
    expect(getNextTimelinePageParam({ hasMore: false, nextCursor: "ignored" })).toBeUndefined();
  });

  it("impede fetch duplicado durante carregamento adicional", () => {
    expect(canFetchNextTimelinePage(true, false)).toBe(true);
    expect(canFetchNextTimelinePage(true, true)).toBe(false);
    expect(canFetchNextTimelinePage(false, false)).toBe(false);
  });
});
