import type { NodeDto } from "@shared/api/gen/main/model";

/** Узел на связи с агентом и актуальной конфигурацией. */
export const makeNode = (patch: Partial<NodeDto> = {}): NodeDto => ({
  id: "n-1",
  name: "alpha",
  description: null,
  host: "203.0.113.10",
  ownerId: "u-1",
  ownerName: "Владелец",
  createdById: "u-2",
  createdByName: "Создатель",
  agentId: "a-1",
  agentName: "alpha",
  status: "online",
  statusMessage: null,
  agent: {
    id: "a-1",
    name: "alpha",
    online: true,
    revoked: false,
    version: "1.1.0",
    address: "203.0.113.10",
    lastSeenAt: 1_790_000_000_000,
    host: { hostname: "alpha", os: "linux", arch: "amd64" },
    updateAvailable: false,
    workers: [],
  },
  config: { status: "synced", pending: [], failed: [] },
  job: null,
  createdAt: "2026-10-01T10:00:00.000Z",
  updatedAt: "2026-10-01T10:00:00.000Z",
  ...patch,
});
