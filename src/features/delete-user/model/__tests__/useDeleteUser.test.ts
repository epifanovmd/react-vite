import { IMainApi } from "@shared/api";
import type { UserDto } from "@shared/api/gen/main/model";
import { iocContainer } from "@shared/lib/di";
import { INotificationService } from "@shared/lib/notifications";
import { renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useDeleteUser } from "../useDeleteUser";

const confirm = vi.fn();

vi.mock("@shared/ui", async importOriginal => ({
  ...(await importOriginal<object>()),
  useConfirm: () => confirm,
}));

const item = { id: "u-1", email: "a@x" } as unknown as UserDto;
const api = { deleteUser: vi.fn() };
const toast = { success: vi.fn(), error: vi.fn() };
const onDeleted = vi.fn();

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
  renderHook(() => useDeleteUser({ onDeleted })).result.current(item);

describe("useDeleteUser", () => {
  it("удаление — после подтверждения, затем обновление списка", async () => {
    confirm.mockResolvedValue(true);
    api.deleteUser.mockResolvedValue({});

    expect(await run()).toBe(true);
    expect(confirm).toHaveBeenCalledWith(
      expect.objectContaining({ confirmLabel: "Удалить" }),
    );
    expect(api.deleteUser).toHaveBeenCalledWith(item.id);
    expect(onDeleted).toHaveBeenCalledWith(item);
  });

  it("отказ в подтверждении — запроса нет", async () => {
    confirm.mockResolvedValue(false);

    expect(await run()).toBe(false);
    expect(api.deleteUser).not.toHaveBeenCalled();
    expect(onDeleted).not.toHaveBeenCalled();
  });

  it("ошибка сервера — тост, список не трогается", async () => {
    confirm.mockResolvedValue(true);
    api.deleteUser.mockResolvedValue({ error: { message: "Нет прав" } });

    expect(await run()).toBe(false);
    expect(toast.error).toHaveBeenCalled();
    expect(onDeleted).not.toHaveBeenCalled();
  });
});
