import { IJobStore } from "@entities/job";
import { IMainApi } from "@shared/api";
import { INotificationService } from "@shared/lib/notifications";
import { useZodForm } from "@shared/ui";
import { z } from "zod";

export const demoJobSchema = z.object({
  text: z.string().trim().min(1, "Введите текст."),
  withOutput: z.boolean(),
});

export type TDemoJobForm = z.infer<typeof demoJobSchema>;

/** Демо-задача `demo.echo`: воркер возвращает переданный текст. */
export const useRunDemoJobVM = () => {
  const api = IMainApi.useInstance();
  const jobs = IJobStore.useInstance();
  const toast = INotificationService.useInstance();
  const form = useZodForm(demoJobSchema, {
    defaultValues: { text: "Привет, воркер!", withOutput: false },
  });

  const submit = async (data: TDemoJobForm) => {
    const res = await api.demoEchoJob(data);

    if (!res.data) return;

    toast.info("Задача поставлена в очередь");
    await jobs.fetch(res.data.jobId);
  };

  return { form, submit };
};
