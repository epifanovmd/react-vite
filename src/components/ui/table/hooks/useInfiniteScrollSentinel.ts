import { type RefObject, useEffect, useRef } from "react";

export interface UseInfiniteScrollSentinelOptions {
  containerRef: RefObject<HTMLElement | null>;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onLoadMore: () => void;
  rootMargin?: string;
}

export const useInfiniteScrollSentinel = ({
  containerRef,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
  rootMargin = "200px",
}: UseInfiniteScrollSentinelOptions): RefObject<HTMLTableRowElement | null> => {
  const sentinelRef = useRef<HTMLTableRowElement>(null);

  useEffect(() => {
    if (!hasNextPage) return;

    const sentinel = sentinelRef.current;

    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isFetchingNextPage) onLoadMore();
      },
      { root: containerRef.current, rootMargin },
    );

    observer.observe(sentinel);

    return () => observer.disconnect();
  }, [
    containerRef,
    hasNextPage,
    isFetchingNextPage,
    onLoadMore,
    rootMargin,
  ]);

  return sentinelRef;
};
