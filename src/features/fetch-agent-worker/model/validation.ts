import { parseJsonText } from "@entities/agent";
import { z } from "zod";

import { missingParams, parseHeaderLines } from "../lib/route-path";

export const FETCH_METHODS = [
  "GET",
  "POST",
  "PUT",
  "PATCH",
  "DELETE",
  "HEAD",
  "OPTIONS",
] as const;

/** Как отправить тело: форма по схеме маршрута, без тела, JSON или текстом. */
export const BODY_MODES = [
  { value: "form", label: "Форма" },
  { value: "none", label: "Без тела" },
  { value: "json", label: "JSON" },
  { value: "text", label: "Текст" },
] as const;

export type TBodyMode = (typeof BODY_MODES)[number]["value"];

/** Срок ответа, с (не больше 10 минут — предел агента). */
export const MAX_TIMEOUT_SEC = 600;

export const workerFetchSchema = z
  .object({
    worker: z.string().min(1, "Выберите воркер."),
    /** Маршрут из манифеста (`МЕТОД /путь`): другие агент не пропустит. */
    route: z.string().min(1, "Выберите маршрут воркера."),
    method: z.enum(FETCH_METHODS),
    path: z.string().trim().startsWith("/", "Путь — от «/»."),
    params: z.record(z.string(), z.string()),
    /** Параметры после `?`: `n=3&full=1`. */
    query: z.string().trim().max(1024, "Не длиннее 1024 символов."),
    bodyMode: z.enum(["form", "none", "json", "text"]),
    /** Поля формы по схеме тела маршрута — строки (`schemaFormBody`). */
    fields: z.record(z.string(), z.string().nullable().optional()),
    body: z.string(),
    headers: z.string(),
    timeoutSec: z
      .number()
      .int()
      .min(1, "Не меньше секунды.")
      .max(MAX_TIMEOUT_SEC, "Не больше 10 минут.")
      .nullable(),
  })
  .superRefine((form, ctx) => {
    const missing = missingParams(form.path, form.params);

    if (missing.length) {
      ctx.addIssue({
        code: "custom",
        path: ["path"],
        message: `Заполните подстановки: ${missing.join(", ")}.`,
      });
    }

    if (form.bodyMode === "json") {
      const parsed = parseJsonText(form.body);

      if ("error" in parsed) {
        ctx.addIssue({
          code: "custom",
          path: ["body"],
          message: `Неверный JSON: ${parsed.error}`,
        });
      }
    }

    const headers = parseHeaderLines(form.headers);

    if ("error" in headers) {
      ctx.addIssue({
        code: "custom",
        path: ["headers"],
        message: `Не понимаю «${headers.error}»: нужно Имя: значение.`,
      });
    }
  });

export type TWorkerFetchForm = z.input<typeof workerFetchSchema>;
