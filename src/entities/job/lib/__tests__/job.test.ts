import type { JobRunDto } from "@shared/api/gen/main/model";
import { describe, expect, it } from "vitest";

import {
  jobAttemptText,
  jobErrorDetails,
  jobErrorText,
  jobExecutorText,
  jobOutputFiles,
  jobResultText,
} from "../job";

const job = (patch: Partial<JobRunDto>): JobRunDto =>
  ({
    status: "running",
    attempt: 0,
    agentId: null,
    result: null,
    error: null,
    ...patch,
  }) as JobRunDto;

describe("jobAttemptText", () => {
  it("первая попытка — без подписи, повтор — с номером от 1", () => {
    expect(jobAttemptText(job({ attempt: 0 }))).toBeNull();
    expect(jobAttemptText(job({ attempt: 1 }))).toBe("попытка 2");
  });
});

describe("jobErrorDetails", () => {
  it("код и текст; без кода — текст; без ошибки — null", () => {
    expect(
      jobErrorDetails(
        job({ error: { code: "JOB_TIMEOUT", message: "Срок истёк" } }),
      ),
    ).toBe("JOB_TIMEOUT: Срок истёк");
    expect(jobErrorDetails(job({ error: { code: "", message: "Сбой" } }))).toBe(
      "Сбой",
    );
    expect(jobErrorDetails(job({}))).toBeNull();
  });
});

describe("jobErrorText", () => {
  it("ошибки по манифесту воркера — понятным текстом, остальные — как есть", () => {
    expect(
      jobErrorText(
        job({ error: { code: "JOB_UNKNOWN", message: "unknown job type" } }),
      ),
    ).toContain("не объявил этот тип задачи");
    expect(
      jobErrorText(job({ error: { code: "JOB_TIMEOUT", message: "Срок" } })),
    ).toBe("Срок");
    expect(jobErrorText(job({}))).toBeNull();
  });
});

describe("jobResultText", () => {
  it("итог — JSON, без итога — null", () => {
    expect(jobResultText(job({ result: { text: "hi" } }))).toBe(
      '{"text":"hi"}',
    );
    expect(jobResultText(job({ result: null }))).toBeNull();
  });
});

describe("jobOutputFiles", () => {
  it("ссылки на файлы итога от сервера; нет — пустой список", () => {
    const outputs = [
      {
        name: "result",
        url: "https://s3/jobs/1/echo.txt",
        size: 9,
        expiresAt: "2026-10-09T12:00:00.000Z",
      },
    ];

    expect(jobOutputFiles(job({ outputs }))).toEqual(outputs);
    expect(jobOutputFiles(job({ outputs: null }))).toEqual([]);
    expect(jobOutputFiles(job({}))).toEqual([]);
  });
});

describe("jobExecutorText", () => {
  it("тип задачи и воркер; ничего — null", () => {
    expect(jobExecutorText(job({ jobType: "echo.long", worker: "echo" }))).toBe(
      "echo.long · воркер echo",
    );
    expect(jobExecutorText(job({ jobType: null, worker: "echo" }))).toBe(
      "воркер echo",
    );
    expect(jobExecutorText(job({ jobType: null, worker: null }))).toBeNull();
  });
});
