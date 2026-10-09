import { describe, expect, it } from "vitest";

import { workerRoutes } from "../worker-routes";

const manifest = {
  version: "1.0.0",
  configs: [],
  events: [],
  requests: [],
  routes: [
    {
      method: "post",
      path: "/echo",
      description: "Эхо",
      request: { type: "object" },
      response: { type: "object" },
    },
  ],
  jobs: [] as { type: string }[],
};

describe("workerRoutes", () => {
  it("маршруты манифеста: метод заглавными, ключ, схемы", () => {
    expect(workerRoutes(manifest)).toEqual([
      {
        key: "POST /echo",
        method: "POST",
        path: "/echo",
        description: "Эхо",
        request: { type: "object" },
        response: { type: "object" },
      },
    ]);
    expect(workerRoutes(undefined)).toEqual([]);
  });

  it("воркер с задачами — маршруты /jobs, тип задачи — из манифеста", () => {
    const routes = workerRoutes({
      ...manifest,
      jobs: [{ type: "echo.quick" }, { type: "echo.long" }],
    });

    expect(routes.map(r => r.key)).toEqual([
      "POST /echo",
      "POST /jobs",
      "GET /jobs/{id}",
      "POST /jobs/{id}/cancel",
    ]);
    expect(
      (routes[1].request?.properties as Record<string, { enum?: string[] }>)
        .type.enum,
    ).toEqual(["echo.quick", "echo.long"]);
  });
});
