import type { SyntheticEvent } from "react";

/** Стабильный обработчик для интерактивных элементов внутри кликабельной строки. */
export const stopPropagation = (event: SyntheticEvent) =>
  event.stopPropagation();
