import {
  configuredWorkers,
  type ISchemaFormField,
  parseJsonText,
  schemaFormBody,
  schemaFormDefaults,
  schemaFormFields,
  schemaSkeleton,
} from "@entities/agent";
import { IMainSession } from "@shared/api";
import type { AgentDto, IAgentFetchBody } from "@shared/api/gen/main/model";
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
  type IWorkerRoute,
  READ_METHODS,
  workerRoutes,
} from "../lib/worker-routes";
import {
  FETCH_METHODS,
  type TBodyMode,
  type TWorkerFetchForm,
  workerFetchSchema,
} from "./validation";
import { WorkerFetchSession } from "./worker-fetch-session";

type TMethod = (typeof FETCH_METHODS)[number];

const isMethod = (value: string): value is TMethod =>
  (FETCH_METHODS as readonly string[]).includes(value);

const CONTENT_TYPE = {
  json: "application/json",
  text: "text/plain; charset=utf-8",
} as const;

/** Как можно отправить тело маршрута: по схеме — форма и JSON. */
export const bodyModesOf = (route: IWorkerRoute | null): TBodyMode[] => {
  if (!route) return ["none"];
  if (route.request) {
    return schemaFormFields(route.request) ? ["form", "json"] : ["json"];
  }

  return READ_METHODS.has(route.method) ? ["none"] : ["none", "json", "text"];
};

/** Текст тела: JSON из формы по схеме, из редактора — сжатый, или текст. */
const bodyTextOf = (
  form: TWorkerFetchForm,
  fields: ISchemaFormField[] | null,
): string => {
  if (form.bodyMode === "form" && fields) {
    const built = schemaFormBody(fields, form.fields);

    return JSON.stringify("value" in built ? built.value : {});
  }
  if (form.bodyMode === "json") {
    const parsed = parseJsonText(form.body);

    return JSON.stringify("value" in parsed ? (parsed.value ?? null) : null);
  }

  return form.body;
};

/**
 * Тело запроса к воркеру из формы: путь маршрута с подстановками и
 * параметрами после `?`, заголовки, тело (форма по схеме — `fields`).
 */
export const fetchBodyOf = (
  form: TWorkerFetchForm,
  fields: ISchemaFormField[] | null = null,
): IAgentFetchBody => {
  const parsedHeaders = parseHeaderLines(form.headers);
  const headers = "headers" in parsedHeaders ? parsedHeaders.headers : {};
  const { bodyMode } = form;
  const withBody = bodyMode !== "none";

  if (withBody) {
    headers["content-type"] ??=
      CONTENT_TYPE[bodyMode === "text" ? "text" : "json"];
  }

  const query = form.query.trim().replace(/^\?/, "");
  const path = fillRoutePath(form.path.trim(), form.params);

  return {
    method: form.method,
    path: query ? `${path}?${query}` : path,
    ...(Object.keys(headers).length > 0 && { headers }),
    ...(withBody && { body: bodyTextOf(form, fields) }),
    ...(form.timeoutSec && { timeoutMs: form.timeoutSec * 1000 }),
  };
};

/** Значения формы по JSON-объекту тела (переход «JSON → форма»). */
const fieldValuesOf = (
  fields: ISchemaFormField[],
  record: Record<string, unknown>,
): Record<string, string> =>
  Object.fromEntries(
    fields.map(field => {
      const item = record[field.name];

      if (item === undefined) return [field.name, ""];
      if (field.kind === "string" && typeof item === "string") {
        return [field.name, item];
      }

      return [field.name, JSON.stringify(item)];
    }),
  );

/**
 * Консоль запроса к воркеру через агента: только маршруты из манифеста
 * воркера (другие агент не пропустит) — метод и путь с подстановками
 * `{name}`, тело формой по схеме маршрута или JSON, подсказка по ответу;
 * ответ — по мере прихода. Уход с вкладки отменяет запрос.
 */
export const useWorkerFetchVM = (agent: AgentDto) => {
  const tokens = IMainSession.useInstance();
  const session = useHolderRef(() => new WorkerFetchSession());
  const workers = configuredWorkers(agent);
  const form = useZodForm(workerFetchSchema, {
    defaultValues: {
      worker: workers[0]?.name ?? "",
      route: "",
      method: "GET",
      path: "/",
      params: {},
      query: "",
      bodyMode: "none",
      fields: {},
      body: "",
      headers: "",
      timeoutSec: null,
    },
  });
  const workerName = useWatch({ control: form.control, name: "worker" });
  const routeKey = useWatch({ control: form.control, name: "route" });
  const bodyMode = useWatch({ control: form.control, name: "bodyMode" });
  const worker = workers.find(item => item.name === workerName) ?? null;
  const routes = workerRoutes(worker?.manifest);
  const route = routes.find(item => item.key === routeKey) ?? null;
  const fields = schemaFormFields(route?.request);

  useEffect(() => () => session.cancel(), [session]);

  // Другой воркер — маршрут прежнего к нему не относится.
  useEffect(() => {
    if (form.getValues("route")) form.setValue("route", "");
  }, [workerName, form]);

  const pickRoute = (next: IWorkerRoute) => {
    const nextFields = schemaFormFields(next.request);

    form.setValue("route", next.key, { shouldValidate: true });
    if (isMethod(next.method)) form.setValue("method", next.method);
    form.setValue("path", next.path);
    form.setValue("params", {});
    form.setValue("bodyMode", bodyModesOf(next)[0]);
    form.setValue(
      "fields",
      nextFields ? schemaFormDefaults(next.request, nextFields) : {},
    );
    form.setValue(
      "body",
      next.request ? JSON.stringify(schemaSkeleton(next.request), null, 2) : "",
    );
  };

  /** Сменить вид тела, перенеся введённое: форма ↔ JSON. */
  const setBodyMode = (next: TBodyMode) => {
    const values = form.getValues();

    if (fields && values.bodyMode === "form" && next === "json") {
      const built = schemaFormBody(fields, values.fields);

      if ("value" in built) {
        form.setValue("body", JSON.stringify(built.value, null, 2));
      }
    }
    if (fields && values.bodyMode === "json" && next === "form") {
      const parsed = parseJsonText(values.body);
      const value = "value" in parsed ? parsed.value : null;

      if (value && typeof value === "object" && !Array.isArray(value)) {
        form.setValue(
          "fields",
          fieldValuesOf(fields, value as Record<string, unknown>),
        );
      }
    }
    form.setValue("bodyMode", next);
  };

  const submit = async (values: TWorkerFetchForm) => {
    if (values.bodyMode === "form" && fields) {
      const built = schemaFormBody(fields, values.fields);

      if ("errors" in built) {
        for (const [name, message] of Object.entries(built.errors)) {
          form.setError(`fields.${name}`, { message });
        }

        return;
      }
    }

    const body = fetchBodyOf(values, fields);

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
    /** Маршруты, которые агент пропустит к выбранному воркеру. */
    routes,
    /** Выбранный маршрут. */
    route,
    /** Поля формы тела по схеме маршрута; `null` — формы нет. */
    fields,
    bodyMode,
    /** Доступные виды тела выбранного маршрута. */
    bodyModes: bodyModesOf(route),
    /** Подстановки пути маршрута. */
    params: route ? routeParams(route.path) : [],
    pickRoute,
    setBodyMode,
    submit,
    session,
    cancel: session.cancel,
    download,
  };
};

export type WorkerFetchVM = ReturnType<typeof useWorkerFetchVM>;
