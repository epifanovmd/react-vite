import { IMainApi } from "@shared/api";
import type { ApiKeyDto } from "@shared/api/gen/main/model";
import { iocContainer } from "@shared/lib/di";
import { INotificationService } from "@shared/lib/notifications";
import { renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useRevokeApiKey } from "../useRevokeApiKey";

const confirm = vi.fn();

vi.mock("@shared/ui", async importOriginal => ({
  ...(await importOriginal<object>()),
  useConfirm: () => confirm,
}));

const item = { id: "k-1", name: "ci" } as unknown as ApiKeyDto;
const api = { revokeApiKey: vi.fn() };
const toast = { success: vi.fn(), error: vi.fn() };
const onRevoked = vi.fn();

beforeEach(() => {
  iocContainer.bind(IMainApi.Tid).toConstantValue(api);
  iocContainer.bind(INotificationService.Tid).toConstantValue(toast);
});

afterEach(() => {
  iocContainer.unbind(IMainApi.Tid);
  iocContainer.unbind(INotificationService.Tid);
  vi.clearAllMocks();
});

const run = () =>
  renderHook(() => useRevokeApiKey({ onRevoked })).result.current(item);

describe("useRevokeApiKey", () => {
  it("отзыв — после подтверждения, затем обновление списка", async () => {
    confirm.mockResolvedValue(true);
    api.revokeApiKey.mockResolvedValue({});

    expect(await run()).toBe(true);
    expect(confirm).toHaveBeenCalledWith(
      expect.objectContaining({ confirmLabel: "Отозвать" }),
    );
    expect(api.revokeApiKey).toHaveBeenCalledWith(item.id);
    expect(onRevoked).toHaveBeenCalledWith(item);
  });

  it("отказ в подтверждении — запроса нет", async () => {
    confirm.mockResolvedValue(false);

    expect(await run()).toBe(false);
    expect(api.revokeApiKey).not.toHaveBeenCalled();
    expect(onRevoked).not.toHaveBeenCalled();
  });

  it("ошибка сервера — тост, список не трогается", async () => {
    confirm.mockResolvedValue(true);
    api.revokeApiKey.mockResolvedValue({ error: { message: "Нет прав" } });

    expect(await run()).toBe(false);
    expect(toast.error).toHaveBeenCalled();
    expect(onRevoked).not.toHaveBeenCalled();
  });
});
