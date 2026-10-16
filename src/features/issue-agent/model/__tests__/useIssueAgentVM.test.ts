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

const archive = {
  file: "agent-prod-1.2.0.tar.gz",
  version: "1.2.0",
  platforms: ["linux/amd64", "linux/arm64"],
  size: 10,
  compose: true,
};

const api = {
  getAgentInstallOptions: vi.fn(async () => ({
    data: { server: "https://api.example.com", archive },
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
  it("варианты с сервера: архив агента, имя — имя узла", async () => {
    const { result } = renderHook(() => useIssueAgentVM({ node }));

    await waitFor(() => expect(result.current.options).not.toBeNull());
    expect(result.current.options?.archive?.platforms).toHaveLength(2);
    expect(result.current.form.getValues("name")).toBe("alpha");
    expect(result.current.forNode).toBe(true);
  });

  it("архив узла — двоичный ответ, файл с именем архива", async () => {
    const { result } = renderHook(() => useIssueAgentVM({ node }));

    await waitFor(() => expect(result.current.options).not.toBeNull());
    await act(() => result.current.downloadArchive({ ...values, name: "vps" }));
    expect(api.issueNodeAgentArchive).toHaveBeenCalledWith(
      "n-1",
      {
        name: "vps",
        expiresInMinutes: 1440,
        baseUrl: undefined,
      },
      { responseType: "blob" },
    );
    expect(utils.downloadBlob).toHaveBeenCalledWith(
      expect.any(Blob),
      "agent-prod-1.2.0.tar.gz",
    );
  });

  it("пока идёт одна выдача, другие не запускаются", async () => {
    let finish: (value: { data: Blob }) => void = () => undefined;

    api.issueNodeAgentArchive.mockImplementationOnce(
      () => new Promise(resolve => (finish = resolve)),
    );

    const { result } = renderHook(() => useIssueAgentVM({ node }));

    await waitFor(() => expect(result.current.options).not.toBeNull());

    let archiveDone: Promise<void> = Promise.resolve();

    act(() => {
      archiveDone = result.current.downloadArchive(values);
    });
    expect(result.current.busy).toBe("archive");

    await act(() => result.current.createLink(values));
    await act(() => result.current.createEnv(values));
    expect(api.issueNodeAgentLink).not.toHaveBeenCalled();
    expect(api.issueNodeAgentEnv).not.toHaveBeenCalled();
    expect(result.current.busy).toBe("archive");

    await act(async () => {
      finish({ data: new Blob(["x"]) });
      await archiveDone;
    });
    expect(result.current.busy).toBeNull();

    await act(() => result.current.createLink(values));
    expect(api.issueNodeAgentLink).toHaveBeenCalledTimes(1);
  });

  it("ошибка вариантов установки — тост", async () => {
    api.getAgentInstallOptions.mockResolvedValueOnce({
      error: { message: "Нет доступа", status: 403 },
    } as never);

    const { result } = renderHook(() => useIssueAgentVM({ node }));

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("Нет доступа"),
    );
    expect(result.current.options).toBeNull();
  });

  it("без узла: число регистраций уходит с запросом; ссылка и .env сохраняются", async () => {
    const { result } = renderHook(() => useIssueAgentVM({}));

    await waitFor(() => expect(result.current.options).not.toBeNull());
    await act(() => result.current.createLink(values));
    expect(api.issueAgentLink).toHaveBeenCalledWith(
      expect.objectContaining({ maxUses: 3 }),
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
    expect(platformLabel("linux/arm64")).toBe("Linux ARM64");
    expect(platformLabel("darwin/amd64")).toBe("macOS x86-64");
  });
});
