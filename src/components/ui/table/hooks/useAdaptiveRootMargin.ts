import { type RefObject, useEffect, useRef, useState } from "react";

/**
 * Автоматически подбирает `rootMargin` для IntersectionObserver в
 * бесконечной прокрутке, чтобы подгрузка следующей страницы начиналась
 * заранее и пользователь не успевал долистать до пустого места.
 *
 * Итоговый отступ — это максимум трёх независимых оценок:
 * 1. Высота вьюпорта контейнера — не меньше "одного экрана" вперёд в любом случае.
 * 2. Половина высоты последней подгруженной страницы (rowCount делится на
 *    строки до/после загрузки, чтобы не требовать pageSize вручную).
 * 3. Скорость скролла × среднее время подгрузки × запас — сколько пикселей
 *    пользователь успеет проскроллить, пока едет запрос.
 *
 * Скорость и время загрузки сглаживаются экспоненциальным скользящим
 * средним (EMA), чтобы не дёргаться от одного случайного замера, а
 * подстраиваться под реальные условия (сеть, устройство) со временем.
 */
export interface UseAdaptiveRootMarginOptions {
  containerRef: RefObject<HTMLElement | null>;
  enabled: boolean;
  isFetchingNextPage: boolean;
  rowCount: number;
}

const DEFAULT_MARGIN_PX = 300;
const MIN_MARGIN_PX = 150;
const MAX_MARGIN_PX = 2400;
/** Запас поверх расчётного времени подгрузки — на случай, если следующий запрос будет медленнее среднего. */
const SAFETY_FACTOR = 1.5;
/** Коэффициент сглаживания EMA для скорости скролла (0..1 — чем больше, тем быстрее реагирует на изменения). */
const VELOCITY_ALPHA = 0.3;
/** Коэффициент сглаживания EMA для времени подгрузки страницы. */
const LATENCY_ALPHA = 0.3;
/** Коэффициент сглаживания EMA для измеренного размера страницы (число строк за одну подгрузку). */
const PAGE_SIZE_ALPHA = 0.3;

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export const useAdaptiveRootMargin = ({
  containerRef,
  enabled,
  isFetchingNextPage,
  rowCount,
}: UseAdaptiveRootMarginOptions): string => {
  const [margin, setMargin] = useState(DEFAULT_MARGIN_PX);

  const velocityRef = useRef(0);
  const lastScrollRef = useRef<{ top: number; time: number } | null>(null);
  const fetchStartRef = useRef<number | null>(null);
  const fetchStartRowCountRef = useRef<number | null>(null);
  const latencyRef = useRef<number | null>(null);
  const pageSizeRef = useRef<number | null>(null);

  // Слушаем скролл контейнера и копим среднюю скорость (px/мс) через EMA.
  useEffect(() => {
    if (!enabled) return;

    const el = containerRef.current;

    if (!el) return;

    // Сразу поднимаем нижнюю границу до размера вьюпорта, не дожидаясь
    // первой подгрузки — так отступ не остаётся крошечным по умолчанию.
    setMargin(prev => Math.max(prev, el.clientHeight));

    const onScroll = () => {
      const now = performance.now();
      const top = el.scrollTop;
      const last = lastScrollRef.current;

      lastScrollRef.current = { top, time: now };

      if (!last) return;

      const dt = now - last.time;
      const dy = top - last.top;

      // Пропускаем шум: отрицательный дельта-тайм и скролл вверх не считаем.
      if (dt <= 0 || dy <= 0) return;

      const instantVelocity = dy / dt;

      velocityRef.current =
        velocityRef.current === 0
          ? instantVelocity
          : velocityRef.current * (1 - VELOCITY_ALPHA) +
            instantVelocity * VELOCITY_ALPHA;
    };

    el.addEventListener("scroll", onScroll, { passive: true });

    return () => el.removeEventListener("scroll", onScroll);
  }, [containerRef, enabled]);

  // Ловим полный цикл одной подгрузки (isFetchingNextPage: false → true → false),
  // чтобы измерить её длительность и сколько строк она реально добавила.
  useEffect(() => {
    if (!enabled) return;

    if (isFetchingNextPage) {
      // Старт запроса: запоминаем время и текущее количество строк —
      // разница с этим значением после завершения даст размер страницы.
      fetchStartRef.current = performance.now();
      fetchStartRowCountRef.current = rowCount;

      return;
    }

    const start = fetchStartRef.current;
    const startRowCount = fetchStartRowCountRef.current;

    // Сбросили в false, но старт не зафиксирован — это не завершение
    // подгрузки (например, первый рендер), пересчитывать нечего.
    if (start == null) return;

    fetchStartRef.current = null;
    fetchStartRowCountRef.current = null;

    const elapsed = performance.now() - start;

    latencyRef.current =
      latencyRef.current == null
        ? elapsed
        : latencyRef.current * (1 - LATENCY_ALPHA) + elapsed * LATENCY_ALPHA;

    if (startRowCount != null) {
      const delta = rowCount - startRowCount;

      // delta — фактический размер только что подгруженной страницы.
      if (delta > 0) {
        pageSizeRef.current =
          pageSizeRef.current == null
            ? delta
            : pageSizeRef.current * (1 - PAGE_SIZE_ALPHA) +
              delta * PAGE_SIZE_ALPHA;
      }
    }

    const el = containerRef.current;
    const viewportFloor = el?.clientHeight ?? 0;
    const rowHeight =
      el?.querySelector("tbody tr")?.getBoundingClientRect().height ?? 0;
    // Нижняя граница по геометрии: не меньше половины высоты одной страницы данных.
    const pageFloor =
      pageSizeRef.current && rowHeight
        ? pageSizeRef.current * rowHeight * 0.5
        : 0;
    // Сколько пикселей пользователь проскроллит, пока идёт следующий запрос.
    const velocityBased =
      velocityRef.current * latencyRef.current * SAFETY_FACTOR;

    setMargin(
      clamp(
        Math.max(viewportFloor, pageFloor, velocityBased),
        MIN_MARGIN_PX,
        MAX_MARGIN_PX,
      ),
    );
  }, [enabled, isFetchingNextPage, containerRef, rowCount]);

  return `${Math.round(margin)}px`;
};
