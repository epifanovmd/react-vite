export interface IDemoEchoData {
  text: string;
  /** Долгая задача `echo.long`: шаги с событиями хода; иначе — `echo.quick`. */
  long?: boolean;
  /** Шагов долгой задачи (по умолчанию 5). */
  steps?: number;
  /** Пауза шага, мс (по умолчанию 500). */
  delayMs?: number;
  /** Долгая задача падает после шагов — `job.failed`. */
  fail?: boolean;
  /** Долгая задача записывает итог в файл `jobs/<id>/echo.txt` (по подписанной ссылке). */
  withOutput?: boolean;
}
