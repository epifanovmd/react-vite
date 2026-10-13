import {
  EJobRunStatus,
  type IJobRunOutputDto,
  type JobRunDto,
} from "@shared/api/gen/main/model";

const ACTIVE = new Set<EJobRunStatus>([
  EJobRunStatus.queued,
  EJobRunStatus.running,
]);

/** Задача ещё идёт: её можно отменить, прогресс меняется. */
export const isJobActive = (job: JobRunDto): boolean => ACTIVE.has(job.status);

/** Понятный текст ошибок передачи задачи воркеру (код сервера или агента). */
const KNOWN_ERRORS: Record<string, string> = {
  NO_AGENT: "Нет агента на связи с воркером, который выполняет эту задачу",
  COMMAND_UNDECLARED:
    "Воркер не объявил эту команду в манифесте — агент её не принял",
  COMMAND_INVALID: "Данные задачи не подходят под схему команды воркера",
  TIMEOUT: "Воркер не уложился в срок — агент отменил задачу",
};

/** Текст ошибки для человека; `null` — ошибки нет. */
export const jobErrorText = (job: JobRunDto): string | null =>
  job.error
    ? (KNOWN_ERRORS[job.error.code.replace(/^AGENT_/, "")] ?? job.error.message)
    : null;

/** Ошибка с кодом: «JOB_TIMEOUT: Срок истёк»; ошибки нет — `null`. */
export const jobErrorDetails = (job: JobRunDto): string | null => {
  if (!job.error) return null;

  return job.error.code
    ? `${job.error.code}: ${job.error.message}`
    : job.error.message;
};

/** Новые задачи — первыми. */
export const newestJobFirst = (a: JobRunDto, b: JobRunDto): number =>
  b.createdAt.localeCompare(a.createdAt);

/** Подпись повтора; `attempt` с 0 — первая попытка без подписи. */
export const jobAttemptText = (job: JobRunDto): string | null =>
  job.attempt > 0 ? `попытка ${job.attempt + 1}` : null;

/** Итог задачи строкой: JSON результата; результата нет — `null`. */
export const jobResultText = (job: JobRunDto): string | null =>
  job.result == null ? null : JSON.stringify(job.result);

/** Файлы итога задачи — ссылки на скачивание от сервера; нет — пустой список. */
export const jobOutputFiles = (job: JobRunDto): IJobRunOutputDto[] =>
  job.outputs ?? [];

/** Исполнитель внешней задачи строкой: тип задачи и воркер; нет — `null`. */
export const jobExecutorText = (job: JobRunDto): string | null => {
  const parts = [job.jobType, job.worker && `воркер ${job.worker}`].filter(
    Boolean,
  );

  return parts.length > 0 ? parts.join(" · ") : null;
};
