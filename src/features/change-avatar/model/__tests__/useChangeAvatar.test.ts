import { IUserStore } from "@entities/user";
import { IMainApi } from "@shared/api";
import { iocContainer } from "@shared/lib/di";
import { INotificationService } from "@shared/lib/notifications";
import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useChangeAvatar } from "../useChangeAvatar";

const api = { uploadFile: vi.fn() };
const userStore = {
  avatarUrl: null,
  model: null,
  updateProfile: vi.fn(async () => ({ data: {} })),
};
const toast = { error: vi.fn(), success: vi.fn() };

beforeEach(() => {
  iocContainer.bind(IMainApi.Tid).toConstantValue(api);
  iocContainer.bind(IUserStore.Tid).toConstantValue(userStore);
  iocContainer.bind(INotificationService.Tid).toConstantValue(toast);
});

afterEach(() => {
  iocContainer.unbind(IMainApi.Tid);
  iocContainer.unbind(IUserStore.Tid);
  iocContainer.unbind(INotificationService.Tid);
  vi.clearAllMocks();
});

describe("useChangeAvatar", () => {
  it("пустой ответ загрузки — ошибка «Файл не загружен», профиль не меняется", async () => {
    api.uploadFile.mockResolvedValue({ data: [] });

    const { result } = renderHook(() => useChangeAvatar());

    await act(() => result.current.upload(new File(["x"], "a.png")));

    expect(toast.error).toHaveBeenCalledWith("Файл не загружен");
    expect(userStore.updateProfile).not.toHaveBeenCalled();
  });
});
