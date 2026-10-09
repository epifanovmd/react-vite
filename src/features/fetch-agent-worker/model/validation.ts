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

/** Как отправить тело: без тела, JSON или текстом. */
export const BODY_MODES = [
  { value: "none", label: "Без тела" },
  { value: "json", label: "JSON" },
  { value: "text", label: "Текст" },
] as const;

/** Срок ответа, с (не больше 10 минут — предел агента). */
export const MAX_TIMEOUT_SEC = 600;

export const workerFetchSchema = z
  .object({
    worker: z.string().min(1, "Выберите воркер."),
    method: z.enum(FETCH_METHODS),
    path: z
      .string()
      .trim()
      .startsWith("/", "Путь — от «/».")
      .max(2048, "Не длиннее 2048 символов."),
    params: z.record(z.string(), z.string()),
    bodyMode: z.enum(["none", "json", "text"]),
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
