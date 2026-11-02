import { IUserStore } from "@entities/user";
import { EPrivacyLevel } from "@shared/api/gen/main/model";
import { iocContainer } from "@shared/lib/di";
import { HttpError, NetworkError } from "@shared/lib/http";
import { INotificationService } from "@shared/lib/notifications";
import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { useEditPrivacy } from "../useEditPrivacy";

const privacy = {
  showAvatar: EPrivacyLevel.everyone,
  showPhone: EPrivacyLevel.contacts,
  showLastOnline: EPrivacyLevel.nobody,
};

const setup = (response: unknown = { data: privacy }) => {
  let resolveUpdate: (value: unknown) => void = () => {};
  const userStore = {
    privacy,
    loadPrivacy: vi.fn(async () => {}),
    updatePrivacy: vi.fn(
      () =>
        new Promise(resolve => {
          resolveUpdate = resolve;
        }),
    ),
  };
  const toast = { error: vi.fn(), success: vi.fn() };

  iocContainer.bind(IUserStore.Tid).toConstantValue(userStore);
  iocContainer.bind(INotificationService.Tid).toConstantValue(toast);

  const hook = renderHook(() => useEditPrivacy());

  /** Изменение уровня с ответом стора `response`. */
  const change = async () => {
    let pending: Promise<void> = Promise.resolve();

    act(() => {
      pending = hook.result.current.change("showPhone", EPrivacyLevel.nobody);
    });
    const savingDuringRequest = hook.result.current.saving;

    await act(async () => {
      resolveUpdate(response);
      await pending;
    });

    return { savingDuringRequest };
  };

  return { userStore, toast, change, ...hook };
};

afterEach(() => {
  iocContainer.unbind(IUserStore.Tid);
  iocContainer.unbind(INotificationService.Tid);
});

describe("useEditPrivacy", () => {
  it("загрузка настроек вызывается один раз при монтировании", () => {
    const { userStore, rerender } = setup();

    rerender();
    rerender();

    expect(userStore.loadPrivacy).toHaveBeenCalledTimes(1);
  });

  it("отдаёт настройки из стора, ничего не сохраняется", () => {
    const { result } = setup();

    expect(result.current.privacy).toEqual(privacy);
    expect(result.current.saving).toBeNull();
  });

  it("успех — во время запроса saving = ключ поля, затем null и тост", async () => {
    const { userStore, toast, change, result } = setup();

    const { savingDuringRequest } = await change();

    expect(savingDuringRequest).toBe("showPhone");
    expect(userStore.updatePrivacy).toHaveBeenCalledWith({
      showPhone: EPrivacyLevel.nobody,
    });
    expect(result.current.saving).toBeNull();
    expect(toast.success).toHaveBeenCalledWith(
      "Настройки приватности сохранены",
    );
    expect(toast.error).not.toHaveBeenCalled();
  });

  it("ошибка 4xx — тост ошибки, saving сбрасывается", async () => {
    const { toast, change, result } = setup({
      error: new HttpError({ status: 400, message: "Недопустимое значение" }),
    });

    await change();

    expect(result.current.saving).toBeNull();
    expect(toast.error).toHaveBeenCalledWith("Недопустимое значение");
    expect(toast.success).not.toHaveBeenCalled();
  });

  it("ошибка сети — без тоста от экрана: её уже показал глобальный тост", async () => {
    const { toast, change, result } = setup({
      error: new NetworkError("Нет соединения"),
    });

    await change();

    expect(result.current.saving).toBeNull();
    expect(toast.error).not.toHaveBeenCalled();
    expect(toast.success).not.toHaveBeenCalled();
  });
});
