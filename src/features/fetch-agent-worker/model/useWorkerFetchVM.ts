import { configuredWorkers, parseJsonText } from "@entities/agent";
import { IMainSession } from "@shared/api";
import type {
  AgentDto,
  IAgentFetchBody,
  IAgentManifestRouteDto,
} from "@shared/api/gen/main/model";
import { BASE_URL } from "@shared/config/env";
import { useHolderRef } from "@shared/lib/holders";
import { useZodForm } from "@shared/ui";
import { useEffect } from "react";
import { useWatch } from "react-hook-form";

import { streamWorkerFetch } from "../api/stream-worker-fetch";
import {
  fillRoutePath,
  parseHeaderLines,
  responseFileName,
  routeParams,
} from "../lib/route-path";
import {
  FETCH_METHODS,
  type TWorkerFetchForm,
  workerFetchSchema,
} from "./validation";
import { WorkerFetchSession } from "./worker-fetch-session";

type TMethod = (typeof FETCH_METHODS)[number];

const isMethod = (value: string): value is TMethod =>
  (FETCH_METHODS as readonly string[]).includes(value);

/** Без тела — методы чтения. */
const READ_METHODS = new Set<string>(["GET", "HEAD", "OPTIONS"]);

const CONTENT_TYPE = {
  json: "application/json",
  text: "text/plain; charset=utf-8",
} as const;

/** Тело запроса к воркеру из формы: путь с подстановками, заголовки, тело. */
export const fetchBodyOf = (form: TWorkerFetchForm): IAgentFetchBody => {
  const parsedHeaders = parseHeaderLines(form.headers);
  const headers = "headers" in parsedHeaders ? parsedHeaders.headers : {};
  const { bodyMode } = form;
  const withBody = bodyMode !== "none";

  if (withBody) headers["content-type"] ??= CONTENT_TYPE[bodyMode];

  const parsed = parseJsonText(form.body);
  const body =
    bodyMode === "json"
      ? JSON.stringify("value" in parsed ? (parsed.value ?? null) : null)
      : form.body;

  return {
    method: form.method,
    path: fillRoutePath(form.path.trim(), form.params),
    ...(Object.keys(headers).length > 0 && { headers }),
    ...(withBody && { body }),
    ...(form.timeoutSec && { timeoutMs: form.timeoutSec * 1000 }),
  };
};

/**
 * Консоль запроса к воркеру через агента: воркер и маршрут из его манифеста
 * (метод и путь с подстановками `{name}`), тело JSON или текстом, ответ — по
 * мере прихода. Уход с вкладки отменяет запрос.
 */
export const useWorkerFetchVM = (agent: AgentDto) => {
  const tokens = IMainSession.useInstance();
  const session = useHolderRef(() => new WorkerFetchSession());
  const workers = configuredWorkers(agent);
  const form = useZodForm(workerFetchSchema, {
    defaultValues: {
      worker: workers[0]?.name ?? "",
      method: "GET",
      path: "/",
      params: {},
      bodyMode: "none",
      body: "",
      headers: "",
      timeoutSec: null,
    },
  });
  const workerName = useWatch({ control: form.control, name: "worker" });
  const path = useWatch({ control: form.control, name: "path" });
  const worker = workers.find(item => item.name === workerName) ?? null;

  useEffect(() => () => session.cancel(), [session]);

  const pickRoute = (route: IAgentManifestRouteDto) => {
    const method = route.method.toUpperCase();

    if (isMethod(method)) form.setValue("method", method);
    form.setValue("path", route.path, { shouldValidate: false });
    form.setValue("bodyMode", READ_METHODS.has(method) ? "none" : "json");
  };

  const submit = async (values: TWorkerFetchForm) => {
    const body = fetchBodyOf(values);

    await session.start(`${body.method} ${body.path}`, handlers =>
      streamWorkerFetch({
        baseUrl: BASE_URL,
        tokens,
        agentId: agent.id,
        worker: values.worker,
        body,
        ...handlers,
      }),
    );
  };

  /** Сохранить тело ответа файлом. */
  const download = () => {
    const url = URL.createObjectURL(session.blob());
    const link = document.createElement("a");

    link.href = url;
    link.download = responseFileName(
      session.head?.headers ?? {},
      workerName || "worker",
    );
    link.click();
    URL.revokeObjectURL(url);
  };

  return {
    form,
    workers,
    worker,
    /** Маршруты из манифеста выбранного воркера. */
    routes: worker?.manifest?.routes ?? [],
    /** Подстановки текущего пути. */
    params: routeParams(path),
    pickRoute,
    submit,
    session,
    cancel: session.cancel,
    download,
  };
};

export type WorkerFetchVM = ReturnType<typeof useWorkerFetchVM>;
