import type { NodeDto } from "@shared/api/gen/main/model";
import { describe, expect, it } from "vitest";

import { nodeSubtitle } from "../node-subtitle";

const node = (patch: Partial<NodeDto>) =>
  ({ host: "203.0.113.10", agent: null, ...patch }) as NodeDto;

const agent = (patch: Partial<NonNullable<NodeDto["agent"]>>) =>
  ({
    version: "1.1.0",
    online: true,
    lastSeenAt: null,
    ...patch,
  }) as NodeDto["agent"];

describe("nodeSubtitle", () => {
  it("адрес и версия; на связи — без времени", () => {
    expect(nodeSubtitle(node({ agent: agent({}) }))).toBe(
      "203.0.113.10 · агент 1.1.0",
    );
  });

  it("без связи — время в статусе, не в шапке; не выходил — так и пишем", () => {
    expect(
      nodeSubtitle(
        node({
          agent: agent({ online: false, lastSeenAt: Date.now() - 60_000 }),
        }),
      ),
    ).toBe("203.0.113.10 · агент 1.1.0");
    expect(
      nodeSubtitle(
        node({ host: null, agent: agent({ online: false, version: null }) }),
      ),
    ).toBe("адрес не задан · агент не выходил на связь");
  });

  it("без агента — только адрес", () => {
    expect(nodeSubtitle(node({}))).toBe("203.0.113.10");
  });
});
