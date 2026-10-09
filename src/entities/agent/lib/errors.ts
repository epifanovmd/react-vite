/** Понятный текст ошибки агента по коду (с префиксом `AGENT_` или без). */
const MANIFEST_ERRORS: Record<string, { title: string; hint: string }> = {
  ROUTE_UNDECLARED: {
    title: "Маршрут не объявлен",
    hint: "Воркер не объявил этот метод и путь в манифесте — агент не передаёт такие запросы. Выберите маршрут из списка.",
  },
  JOB_UNKNOWN: {
    title: "Неизвестный тип задачи",
    hint: "Воркер не объявил этот тип задачи в манифесте (jobs) — агент её не принимает.",
  },
  REQUEST_INVALID: {
    title: "Тело не подходит под схему",
    hint: "Тело запроса не подходит под схему маршрута из манифеста воркера — до воркера оно не отправлено.",
  },
  EVENT_UNDECLARED: {
    title: "Тип события не объявлен",
    hint: "Воркер не объявил этот тип события в манифесте.",
  },
  PATH_FORBIDDEN: {
    title: "Служебный путь",
    hint: "Служебные пути воркера (/health, /metrics, /config, /cleanup) с сервера недоступны.",
  },
};

/**
 * Ошибка по манифесту воркера (необъявленный маршрут, тип задачи, тело не по
 * схеме): заголовок и пояснение; другой код — `null`.
 */
export const agentErrorText = (
  code: string | null | undefined,
): { title: string; hint: string } | null =>
  code ? (MANIFEST_ERRORS[code.replace(/^AGENT_/, "")] ?? null) : null;
