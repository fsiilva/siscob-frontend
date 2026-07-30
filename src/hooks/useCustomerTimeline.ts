"use client";

import { useInfiniteQuery } from "@tanstack/react-query";

import { getCustomerTimeline } from "@/services/timeline.service";

export const customerTimelineQueryKey = (customerId: number) => ["customers", customerId, "timeline"] as const;

export function getNextTimelinePageParam(lastPage: { hasMore: boolean; nextCursor: string | null }) {
  return lastPage.hasMore ? (lastPage.nextCursor ?? undefined) : undefined;
}

export function canFetchNextTimelinePage(hasNextPage: boolean, isFetchingNextPage: boolean) {
  return hasNextPage && !isFetchingNextPage;
}

export function useCustomerTimeline(customerId: number) {
  return useInfiniteQuery({
    queryKey: customerTimelineQueryKey(customerId),
    queryFn: ({ pageParam }) => getCustomerTimeline(customerId, {
      limit: 20,
      ...(pageParam ? { cursor: pageParam } : {}),
    }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: getNextTimelinePageParam,
    enabled: Number.isInteger(customerId) && customerId > 0,
    retry: 1,
  });
}
