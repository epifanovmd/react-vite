import { IJobStore } from "@entities/job";
import { IMainApi } from "@shared/api";
import type { IDemoEchoData } from "@shared/api/gen/main/model";
import { notifyApiError } from "@shared/lib/http";
import { INotificationService } from "@shared/lib/notifications";
import { useZodForm } from "@shared/ui";
import { z } from "zod";

/** Тип задачи воркера `echo`: быстрая — итог сразу, долгая — ход событиями. */
export type TDemoJobKind = "quick" | "long";

export const DEMO_JOB_KIND_OPTIONS: { value: TDemoJobKind; label: string }[] = [
  { value: "quick", label: "echo.quick" },
  { value: "long", label: "echo.long" },
];

export const demoJobSchema = z.object({
  kind: z.enum(["quick", "long"]),
  text: z.string().trim().min(1, "Введите текст."),
  steps: z
    .number()
    .int()
    .min(1, "Не меньше одного шага.")
    .max(100, "Не больше 100 шагов.")
    .nullable(),
  delayMs: z
    .number()
    .int()
    .min(0, "Не меньше 0 мс.")
    .max(60_000, "Не больше минуты.")
    .nullable(),
  fail: z.boolean(),
  withOutput: z.boolean(),
  /** Быстрая задача: префикс воркер спрашивает у сервера (`echo.lookup`). */
  lookup: z.boolean(),
});

export type TDemoJobForm = z.infer<typeof demoJobSchema>;

/**
 * Тело запроса демо-задачи: `lookup` — только для `echo.quick`, параметры
 * долгой задачи — только для `echo.long`.
 */
export const demoJobBody = ({
  kind,
  text,
  steps,
  delayMs,
  fail,
  withOutput,
  lookup,
}: TDemoJobForm): IDemoEchoData =>
  kind === "quick"
    ? { text, ...(lookup && { lookup }) }
    : {
        text,
        long: true,
        ...(steps !== null && { steps }),
        ...(delayMs !== null && { delayMs }),
        ...(fail && { fail }),
        ...(withOutput && { withOutput }),
      };

/**
 * Демо-задача `demo.echo` воркеру `echo` агента: `echo.quick` — итог в ответе
 * воркера (с `lookup` — префикс по запросу воркера к серверу), `echo.long` — шаги с ходом, отмена, провал после шагов и итог в
 * файл.
 */
export const useRunDemoJobVM = () => {
  const api = IMainApi.useInstance();
  const jobs = IJobStore.useInstance();
  const toast = INotificationService.useInstance();
  const form = useZodForm(demoJobSchema, {
    defaultValues: {
      kind: "long",
      text: "Привет, агент!",
      steps: 5,
      delayMs: 500,
      fail: false,
      withOutput: false,
      lookup: false,
    },
  });

  const submit = async (values: TDemoJobForm) => {
    const res = await api.demoEchoJob(demoJobBody(values));

    if (!res.data) {
      notifyApiError(toast, res.error);

      return;
    }

    toast.info("Задача поставлена в очередь");
    await jobs.fetch(res.data.jobId);
  };

  return { form, submit };
};
