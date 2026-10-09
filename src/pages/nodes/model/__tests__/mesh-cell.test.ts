import type { INodeMeshCellDto } from "@shared/api/gen/main/model";
import { describe, expect, it } from "vitest";

import { bestByTarget, describeMeshCell, formatRtt } from "../mesh-cell";

const cell = (patch: Partial<INodeMeshCellDto> = {}): INodeMeshCellDto => ({
  from: "n-1",
  to: "n-2",
  method: "icmp",
  sent: 3,
  received: 3,
  rttAvgMs: 12,
  rttMinMs: 4.25,
  rttMaxMs: 20,
  lossPct: 0,
  at: 1,
  stale: false,
  ...patch,
});

describe("describeMeshCell", () => {
  it("задержка мин / сред / макс, ответы, потери и способ проверки", () => {
    expect(describeMeshCell(cell())).toBe(
      "Задержка 4.3 / 12 / 20 мс · ответов 3 из 3 · потери 0% · icmp",
    );
    expect(describeMeshCell(cell({ via: "tcp" }))).toMatch(/icmp → tcp$/);
  });

  it("устарело, ошибка, нет ответа — пометками", () => {
    expect(
      describeMeshCell(
        cell({
          stale: true,
          error: "имя не разрешилось",
          rttAvgMs: null,
          received: 0,
          lossPct: 100,
        }),
      ),
    ).toBe(
      "Нет свежих данных · имя не разрешилось · не отвечает · ответов 0 из 3 · потери 100% · icmp",
    );
  });
});

describe("bestByTarget", () => {
  it("лучший — минимальный RTT без потерь и со свежей проверкой", () => {
    const fast = cell({ from: "n-3", rttAvgMs: 5 });
    const lossy = cell({ from: "n-4", rttAvgMs: 1, lossPct: 10 });
    const stale = cell({ from: "n-5", rttAvgMs: 1, stale: true });
    const silent = cell({ from: "n-6", rttAvgMs: null });

    expect(bestByTarget([cell(), fast, lossy, stale, silent]).get("n-2")).toBe(
      fast,
    );
  });
});

describe("formatRtt", () => {
  it("меньше 10 — с десятыми, нет ответа — ×", () => {
    expect(formatRtt(3.456)).toBe("3.5");
    expect(formatRtt(42.4)).toBe("42");
    expect(formatRtt(null)).toBe("×");
  });
});
