import { describe, expect, it } from "vitest";

import {
  countNodes,
  isNodeJobActive,
  NODE_STATUS,
  nodeConfigView,
  nodeWorkersSummary,
} from "../status";
import { makeNode } from "./node-fixture";

describe("NODE_STATUS", () => {
  it("подписи и окраска статусов", () => {
    expect(NODE_STATUS.created).toEqual({
      label: "Ожидает агента",
      variant: "muted",
    });
    expect(NODE_STATUS.provisioning.variant).toBe("info");
    expect(NODE_STATUS.online).toEqual({
      label: "На связи",
      variant: "success",
    });
    expect(NODE_STATUS.offline.variant).toBe("destructive");
    expect(NODE_STATUS.error.label).toBe("Ошибка");
  });
});

describe("nodeConfigView", () => {
  it("актуальна — без подсказки", () => {
    expect(
      nodeConfigView({ status: "synced", pending: [], failed: [] }),
    ).toEqual({ label: "Актуальна", variant: "success" });
  });

  it("ошибка и ожидание — разделы в подсказке", () => {
    const view = nodeConfigView({
      status: "error",
      pending: ["example.kv"],
      failed: ["netprobe"],
    });

    expect(view.label).toBe("Ошибка применения");
    expect(view.variant).toBe("destructive");
    expect(view.hint).toBe(
      "Не применены: netprobe. Ждут применения: example.kv",
    );
  });

  it("ожидает агента и применяется", () => {
    expect(
      nodeConfigView({ status: "awaitingAgent", pending: [], failed: [] }),
    ).toMatchObject({ label: "Ожидает агента", variant: "muted" });
    expect(
      nodeConfigView({ status: "applying", pending: [], failed: [] }).label,
    ).toBe("Применяется…");
  });
});

describe("countNodes", () => {
  it("всего, на связи, без связи, с ошибкой", () => {
    expect(
      countNodes([
        makeNode(),
        makeNode({ status: "offline" }),
        makeNode({ status: "error" }),
        makeNode({ status: "created" }),
      ]),
    ).toEqual({ total: 4, online: 1, offline: 1, error: 1 });
  });
});

describe("isNodeJobActive", () => {
  it("в очереди и выполняется — идёт", () => {
    expect(isNodeJobActive({ status: "queued" })).toBe(true);
    expect(isNodeJobActive({ status: "running" })).toBe(true);
    expect(isNodeJobActive({ status: "failed" })).toBe(false);
  });
});

describe("nodeWorkersSummary", () => {
  it("не в порядке — не работает или /health ответил ok: false", () => {
    const worker = {
      name: "echo",
      state: "running",
      version: "1.0.0",
      healthy: true,
      busy: false,
    };
    const node = makeNode();

    expect(nodeWorkersSummary({ agent: null })).toEqual({
      total: 0,
      troubled: 0,
    });
    expect(
      nodeWorkersSummary({
        agent: {
          ...node.agent!,
          workers: [
            worker,
            { ...worker, name: "a", healthy: false },
            { ...worker, name: "b", state: "invalid", healthy: null },
            { ...worker, name: "c", healthy: null, busy: true },
          ],
        },
      }),
    ).toEqual({ total: 4, troubled: 2 });
  });
});
