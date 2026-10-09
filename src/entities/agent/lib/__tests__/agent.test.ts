import type { AgentAlertDto } from "@shared/api/gen/main/model";
import { describe, expect, it } from "vitest";

import {
  agentLabels,
  agentPlatform,
  agentSubtitle,
  agentVersion,
  agentWorkers,
  alertKey,
  configuredWorkers,
  isAgentLive,
  onlineAgentFirst,
  workerOf,
  workersSummary,
} from "../agent";
import { makeAgent, makeWorker } from "./agent-fixture";

describe("agent lib", () => {
  it("версия, узел и подпись", () => {
    const agent = makeAgent();

    expect(agentVersion(agent)).toBe("1.0.0");
    expect(agentPlatform(agent)).toBe("linux · amd64");
    expect(agentSubtitle(agent)).toBe("node-01 · linux · amd64 · 203.0.113.10");
  });

  it("не выходивший на связь агент — подпись по умолчанию", () => {
    const agent = makeAgent({
      version: undefined,
      host: undefined,
      address: undefined,
    });

    expect(agentVersion(agent)).toBeNull();
    expect(agentPlatform(agent)).toBeNull();
    expect(agentSubtitle(agent)).toBe("агент ещё не выходил на связь");
  });

  it("метки по ключу, пустое значение — только ключ", () => {
    expect(agentLabels({ zone: "eu", gpu: "" })).toEqual(["gpu", "zone=eu"]);
  });

  it("на связи и не отозван — живой", () => {
    expect(isAgentLive(makeAgent())).toBe(true);
    expect(isAgentLive(makeAgent({ online: false }))).toBe(false);
    expect(isAgentLive(makeAgent({ revoked: true }))).toBe(false);
  });

  it("воркеры не в порядке: не работает, не зарегистрирован или сам сообщил", () => {
    const agent = makeAgent({
      workers: [
        makeWorker({ name: "a" }),
        makeWorker({ name: "b", state: "backoff" }),
        makeWorker({ name: "c", health: { ok: false, message: "нет БД" } }),
        makeWorker({ name: "d", state: "invalid", message: "нет /manifest" }),
        makeWorker({ name: "e", health: { ok: true, busy: true } }),
      ],
    });

    expect(workersSummary(agent)).toEqual({ total: 5, troubled: 3 });
  });

  it("встроенный воркер — в конце списка, не в сводке и не среди настраиваемых", () => {
    const agent = makeAgent({
      workers: [
        { name: "sysmetrics", state: "backoff", builtin: true },
        makeWorker({ name: "a" }),
      ],
    });

    expect(agentWorkers(agent).map(worker => worker.name)).toEqual([
      "a",
      "sysmetrics",
    ]);
    expect(configuredWorkers(agent).map(worker => worker.name)).toEqual(["a"]);
    expect(workersSummary(agent)).toEqual({ total: 1, troubled: 0 });
    expect(workerOf(agent, "sysmetrics")?.builtin).toBe(true);
    expect(workerOf(agent, "nope")).toBeUndefined();
  });

  it("на связи — первыми, дальше по имени", () => {
    const list = [
      makeAgent({ id: "1", name: "b", online: false }),
      makeAgent({ id: "2", name: "c" }),
      makeAgent({ id: "3", name: "a" }),
      makeAgent({ id: "4", name: "d", revoked: true }),
    ].sort(onlineAgentFirst);

    expect(list.map(a => a.name)).toEqual(["a", "c", "b", "d"]);
  });

  it("ключ проблемы — агент и ключ сервера", () => {
    const alert = {
      key: "workerDown:echo",
      agentId: "a",
      type: "workerDown",
    } as AgentAlertDto;

    expect(alertKey(alert)).toBe("a/workerDown:echo");
  });
});
