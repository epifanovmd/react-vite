/** Подстановки маршрута воркера: `/items/{id}` → `id`. */
const PARAM = /\{([^{}/]+)\}/g;

/** Имена подстановок пути по порядку, без повторов. */
export const routeParams = (path: string): string[] => [
  ...new Set([...path.matchAll(PARAM)].map(match => match[1])),
];

/** Путь с подставленными значениями (экранированными для URL). */
export const fillRoutePath = (
  path: string,
  values: Record<string, string | undefined>,
): string =>
  path.replace(PARAM, (_, name: string) =>
    encodeURIComponent(values[name] ?? ""),
  );

/** Подстановки без значения. */
export const missingParams = (
  path: string,
  values: Record<string, string | undefined>,
): string[] => routeParams(path).filter(name => !values[name]?.trim());

/**
 * Заголовки из строк «Имя: значение»; пустые строки пропускаются. Строка без
 * двоеточия или с пустым именем — ошибка с её текстом.
 */
export const parseHeaderLines = (
  text: string,
): { headers: Record<string, string> } | { error: string } => {
  const headers: Record<string, string> = {};

  for (const raw of text.split("\n")) {
    const line = raw.trim();

    if (!line) continue;

    const colon = line.indexOf(":");
    const name = colon === -1 ? "" : line.slice(0, colon).trim();

    if (!name || /\s/.test(name)) return { error: line };
    headers[name.toLowerCase()] = line.slice(colon + 1).trim();
  }

  return { headers };
};

const TEXT_TYPES = [
  /^text\//,
  /^application\/(json|xml|javascript|x-ndjson|x-www-form-urlencoded)\b/,
  /\+(json|xml)\b/,
];

/**
 * Тело ответа показывать текстом: по `content-type`; без него — если начало
 * тела — целый UTF-8.
 */
export const isTextBody = (
  contentType: string | undefined,
  start: Uint8Array | undefined,
): boolean => {
  if (contentType) {
    const type = contentType.toLowerCase();

    return TEXT_TYPES.some(pattern => pattern.test(type));
  }
  if (!start || start.length === 0) return true;

  try {
    new TextDecoder("utf-8", { fatal: true }).decode(start, { stream: true });

    return true;
  } catch {
    return false;
  }
};

/** Имя файла для сохранения ответа: из `content-disposition` или по воркеру. */
export const responseFileName = (
  headers: Record<string, string>,
  worker: string,
): string => {
  const disposition = headers["content-disposition"] ?? "";
  const match = /filename\*?=(?:UTF-8'')?"?([^";]+)"?/i.exec(disposition);

  if (match) {
    try {
      return decodeURIComponent(match[1]);
    } catch {
      return match[1];
    }
  }

  return `${worker}-response.bin`;
};
