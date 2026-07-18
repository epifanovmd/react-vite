import { type RefObject, useEffect, useRef } from "react";

import { useAdaptiveRootMargin } from "./useAdaptiveRootMargin";

export interface UseInfiniteScrollSentinelOptions {
  containerRef: RefObject<HTMLElement | null>;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onLoadMore: () => void;
  rowCount: number;
  rootMargin?: string;
}

export const useInfiniteScrollSentinel = ({
  containerRef,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
  rowCount,
  rootMargin,
}: UseInfiniteScrollSentinelOptions): RefObject<HTMLTableRowElement | null> => {
  const sentinelRef = useRef<HTMLTableRowElement>(null);

  const adaptiveRootMargin = useAdaptiveRootMargin({
    containerRef,
    enabled: hasNextPage && rootMargin === undefined,
    isFetchingNextPage,
    rowCount,
  });

  const effectiveRootMargin = rootMargin ?? adaptiveRootMargin;

  useEffect(() => {
    if (!hasNextPage) return;

    const sentinel = sentinelRef.current;

    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isFetchingNextPage) onLoadMore();
      },
      { root: containerRef.current, rootMargin: effectiveRootMargin },
    );

    observer.observe(sentinel);

    return () => observer.disconnect();
  }, [
    containerRef,
    hasNextPage,
    isFetchingNextPage,
    onLoadMore,
    effectiveRootMargin,
  ]);

  return sentinelRef;
};
