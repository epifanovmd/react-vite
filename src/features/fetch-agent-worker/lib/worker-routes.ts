import type {
  IAgentManifestRouteDto,
  IAgentWorkerManifestDto,
} from "@shared/api/gen/main/model";

/** Маршрут воркера для запроса: из `manifest.routes` или задач (`manifest.jobs`). */
export interface IWorkerRoute {
  /** `МЕТОД /путь` — ключ маршрута. */
  key: string;
  method: string;
  path: string;
  description?: string;
  /** JSON Schema тела запроса. */
  request?: Record<string, unknown>;
  /** JSON Schema ответа — подсказка. */
  response?: Record<string, unknown>;
}

/** Методы без тела. */
export const READ_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

const toRoute = (route: IAgentManifestRouteDto): IWorkerRoute => {
  const method = route.method.toUpperCase();

  return {
    key: `${method} ${route.path}`,
    method,
    path: route.path,
    ...(route.description && { description: route.description }),
    ...(route.request && { request: route.request }),
    ...(route.response && { response: route.response }),
  };
};

/**
 * Маршруты задач: агент пропускает `/jobs` только воркеру с `jobs` в
 * манифесте, тип — только из него.
 */
const jobRoutes = (
  jobs: IAgentWorkerManifestDto["jobs"],
): IAgentManifestRouteDto[] => [
  {
    method: "POST",
    path: "/jobs",
    description: "Задача воркеру: тип из манифеста, данные — по схеме типа",
    request: {
      type: "object",
      required: ["type"],
      properties: {
        type: {
          type: "string",
          enum: jobs.map(job => job.type),
          description: "Тип задачи",
        },
        jobId: {
          type: "string",
          description: "Ключ повтора: тот же — та же задача",
        },
        data: { description: "Данные задачи (JSON)" },
      },
    },
  },
  {
    method: "GET",
    path: "/jobs/{id}",
    description: "Состояние задачи у воркера",
  },
  {
    method: "POST",
    path: "/jobs/{id}/cancel",
    description: "Отменить задачу",
  },
];

/**
 * Маршруты, которые агент пропустит к воркеру: объявленные в манифесте и,
 * если воркер объявил задачи, — маршруты задач. Другие пути агент отклоняет
 * (`ROUTE_UNDECLARED`).
 */
export const workerRoutes = (
  manifest: IAgentWorkerManifestDto | undefined,
): IWorkerRoute[] => {
  if (!manifest) return [];

  const declared = manifest.routes.map(toRoute);
  const keys = new Set(declared.map(route => route.key));
  const jobs =
    manifest.jobs.length > 0
      ? jobRoutes(manifest.jobs)
          .map(toRoute)
          .filter(route => !keys.has(route.key))
      : [];

  return [...declared, ...jobs];
};
