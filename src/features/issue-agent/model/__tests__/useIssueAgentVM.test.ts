import { IMainApi } from "@shared/api";
import type { NodeDto } from "@shared/api/gen/main/model";
import { iocContainer } from "@shared/lib/di";
import { INotificationService } from "@shared/lib/notifications";
import * as utils from "@shared/lib/utils";
import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useIssueAgentVM } from "../useIssueAgentVM";
import { issueAgentSchema, platformLabel } from "../validation";

const node = { id: "n-1", name: "alpha" } as NodeDto;

const archives = [
  {
    platform: "linux-arm64",
    file: "agent-prod-1.1.0-linux-arm64.tar.gz",
    size: 10,
    compose: true,
  },
  {
    platform: "linux-amd64",
    file: "agent-prod-1.1.0-linux-amd64.tar.gz",
    size: 10,
    compose: true,
  },
];

const api = {
  getAgentInstallOptions: vi.fn(async () => ({
    data: { server: "https://api.example.com", archives },
  })),
  issueAgentArchive: vi.fn(async () => ({ data: new Blob(["x"]) })),
  issueNodeAgentArchive: vi.fn(async () => ({ data: new Blob(["x"]) })),
  issueAgentLink: vi.fn(async () => ({
    data: {
      url: "https://api.example.com/agent/v1/bundle/issued/i",
      expiresAt: 1,
    },
  })),
  issueNodeAgentLink: vi.fn(async () => ({
    data: {
      url: "https://api.example.com/agent/v1/bundle/issued/j",
      expiresAt: 1,
    },
  })),
  issueAgentEnv: vi.fn(async () => ({
    data: {
      env: "AGENT_ENROLL_TOKEN=t\n",
      token: "t",
      tokenId: "x",
      expiresAt: 1,
    },
  })),
  issueNodeAgentEnv: vi.fn(async () => ({
    data: {
      env: "AGENT_ENROLL_TOKEN=n\n",
      token: "n",
      tokenId: "y",
      expiresAt: 1,
    },
  })),
};
const toast = { success: vi.fn(), error: vi.fn() };
const values = {
  platform: "linux-amd64",
  name: "",
  expiresInMinutes: 1440,
  maxUses: 3,
  baseUrl: "",
};

beforeEach(() => {
  iocContainer.bind(IMainApi.Tid).toConstantValue(api);
  iocContainer.bind(INotificationService.Tid).toConstantValue(toast);
  vi.spyOn(utils, "downloadBlob").mockImplementation(() => undefined);
});

afterEach(() => {
  iocContainer.unbind(IMainApi.Tid);
  iocContainer.unbind(INotificationService.Tid);
  vi.clearAllMocks();
  vi.restoreAllMocks();
});

describe("useIssueAgentVM", () => {
  it("варианты с сервера: платформа по умолчанию — linux-amd64, имя — имя узла", async () => {
    const { result } = renderHook(() => useIssueAgentVM({ node }));

    await waitFor(() => expect(result.current.options).not.toBeNull());
    expect(result.current.form.getValues("platform")).toBe("linux-amd64");
    expect(result.current.form.getValues("name")).toBe("alpha");
    expect(result.current.forNode).toBe(true);
  });

  it("архив узла — двоичный ответ, файл с именем архива платформы", async () => {
    const { result } = renderHook(() => useIssueAgentVM({ node }));

    await waitFor(() => expect(result.current.options).not.toBeNull());
    await act(() => result.current.downloadArchive({ ...values, name: "vps" }));
    expect(api.issueNodeAgentArchive).toHaveBeenCalledWith(
      "n-1",
      {
        platform: "linux-amd64",
        name: "vps",
        expiresInMinutes: 1440,
        baseUrl: undefined,
      },
      { responseType: "blob" },
    );
    expect(utils.downloadBlob).toHaveBeenCalledWith(
      expect.any(Blob),
      "agent-prod-1.1.0-linux-amd64.tar.gz",
    );
  });

  it("без узла: число регистраций уходит с запросом; ссылка и .env сохраняются", async () => {
    const { result } = renderHook(() => useIssueAgentVM({}));

    await waitFor(() => expect(result.current.options).not.toBeNull());
    await act(() => result.current.createLink(values));
    expect(api.issueAgentLink).toHaveBeenCalledWith(
      expect.objectContaining({ platform: "linux-amd64", maxUses: 3 }),
    );
    expect(result.current.link?.url).toMatch(/issued\/i$/);
    await act(() => result.current.createEnv(values));
    expect(api.issueAgentEnv).toHaveBeenCalledWith(
      expect.objectContaining({ maxUses: 3 }),
    );
    expect(result.current.env?.token).toBe("t");
  });
});

describe("проверка и подписи", () => {
  it("срок и адрес проверяются; платформы — по-человечески", () => {
    expect(issueAgentSchema.safeParse(values).success).toBe(true);
    expect(
      issueAgentSchema.safeParse({ ...values, expiresInMinutes: 1 }).success,
    ).toBe(false);
    expect(
      issueAgentSchema.safeParse({ ...values, baseUrl: "api" }).success,
    ).toBe(false);
    expect(platformLabel("linux-arm64")).toBe("Linux ARM64");
    expect(platformLabel("darwin-amd64")).toBe("macOS x86-64");
  });
});
