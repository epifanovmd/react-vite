import { type RefObject, useEffect, useRef, useState } from "react";

/**
 * Автоматически подбирает `rootMargin` для IntersectionObserver в
 * бесконечной прокрутке, чтобы подгрузка следующей страницы начиналась
 * заранее и пользователь не успевал долистать до пустого места.
 *
 * Итоговый отступ — это максимум трёх независимых оценок:
 * 1. Высота вьюпорта контейнера — не меньше "одного экрана" вперёд в любом случае.
 * 2. Половина реального прироста высоты контента от последней подгрузки
 *    (`scrollHeight` до/после), без предположений о высоте одной строки —
 *    строки могут быть разной высоты (перенос текста, expand и т.д.).
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
/** Коэффициент сглаживания EMA для измеренного прироста высоты контента за одну подгрузку. */
const PAGE_HEIGHT_ALPHA = 0.3;

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export const useAdaptiveRootMargin = ({
  containerRef,
  enabled,
  isFetchingNextPage,
}: UseAdaptiveRootMarginOptions): string => {
  const [margin, setMargin] = useState(DEFAULT_MARGIN_PX);

  const velocityRef = useRef(0);
  const lastScrollRef = useRef<{ top: number; time: number } | null>(null);
  const fetchStartRef = useRef<number | null>(null);
  const fetchStartScrollHeightRef = useRef<number | null>(null);
  const latencyRef = useRef<number | null>(null);
  const pageHeightRef = useRef<number | null>(null);

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
  // чтобы измерить её длительность и сколько пикселей контента она добавила.
  useEffect(() => {
    if (!enabled) return;

    const el = containerRef.current;

    if (isFetchingNextPage) {
      // Старт запроса: запоминаем время и текущую высоту контента —
      // разница с этим значением после завершения даст высоту страницы.
      fetchStartRef.current = performance.now();
      fetchStartScrollHeightRef.current = el?.scrollHeight ?? null;

      return;
    }

    const start = fetchStartRef.current;
    const startScrollHeight = fetchStartScrollHeightRef.current;

    // Сбросили в false, но старт не зафиксирован — это не завершение
    // подгрузки (например, первый рендер), пересчитывать нечего.
    if (start == null) return;

    fetchStartRef.current = null;
    fetchStartScrollHeightRef.current = null;

    const elapsed = performance.now() - start;

    latencyRef.current =
      latencyRef.current == null
        ? elapsed
        : latencyRef.current * (1 - LATENCY_ALPHA) + elapsed * LATENCY_ALPHA;

    if (startScrollHeight != null && el) {
      // Разница scrollHeight "до" и "после" — реальная высота добавленной
      // страницы, без гадания про высоту одной строки.
      const delta = el.scrollHeight - startScrollHeight;

      if (delta > 0) {
        pageHeightRef.current =
          pageHeightRef.current == null
            ? delta
            : pageHeightRef.current * (1 - PAGE_HEIGHT_ALPHA) +
              delta * PAGE_HEIGHT_ALPHA;
      }
    }

    const viewportFloor = el?.clientHeight ?? 0;
    // Нижняя граница по геометрии: не меньше половины высоты одной страницы данных.
    const pageFloor = pageHeightRef.current ? pageHeightRef.current * 0.5 : 0;
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
  }, [enabled, isFetchingNextPage, containerRef]);

  return `${Math.round(margin)}px`;
};
