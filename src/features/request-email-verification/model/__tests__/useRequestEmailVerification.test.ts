import { IUserStore } from "@entities/user";
import { iocContainer } from "@shared/lib/di";
import { HttpError, NetworkError } from "@shared/lib/http";
import { INotificationService } from "@shared/lib/notifications";
import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { useRequestEmailVerification } from "../useRequestEmailVerification";

const setup = (error: unknown) => {
  const toast = { error: vi.fn(), success: vi.fn() };
  const userStore = {
    requestVerifyEmail: vi.fn().mockResolvedValue({ data: null, error }),
  };

  iocContainer.bind(IUserStore.Tid).toConstantValue(userStore);
  iocContainer.bind(INotificationService.Tid).toConstantValue(toast);

  const { result } = renderHook(() => useRequestEmailVerification());

  return { toast, result };
};

afterEach(() => {
  iocContainer.unbind(IUserStore.Tid);
  iocContainer.unbind(INotificationService.Tid);
});

describe("useRequestEmailVerification", () => {
  it("ошибка 4xx — тост с сообщением сервера", async () => {
    const { toast, result } = setup(
      new HttpError({ status: 429, message: "Слишком часто" }),
    );

    await act(() => result.current.requestVerification());

    expect(toast.error).toHaveBeenCalledWith("Слишком часто");
    expect(toast.success).not.toHaveBeenCalled();
  });

  it("нет сети — второго тоста нет, его показал notifyErrors", async () => {
    const { toast, result } = setup(new NetworkError());

    await act(() => result.current.requestVerification());

    expect(toast.error).not.toHaveBeenCalled();
    expect(toast.success).not.toHaveBeenCalled();
  });

  it("успех — тост об отправке; во время запроса isLoading", async () => {
    let resolve: (value: unknown) => void = () => {};
    const toast = { error: vi.fn(), success: vi.fn() };
    const userStore = {
      requestVerifyEmail: vi.fn(() => new Promise(r => (resolve = r))),
    };

    iocContainer.bind(IUserStore.Tid).toConstantValue(userStore);
    iocContainer.bind(INotificationService.Tid).toConstantValue(toast);

    const { result, rerender } = renderHook(() =>
      useRequestEmailVerification(),
    );
    let pending: Promise<void> = Promise.resolve();

    act(() => {
      pending = result.current.requestVerification();
    });
    rerender();

    expect(result.current.isLoading).toBe(true);

    await act(async () => {
      resolve({ data: undefined, error: null });
      await pending;
    });
    rerender();

    expect(result.current.isLoading).toBe(false);
    expect(toast.success).toHaveBeenCalledWith(
      "Письмо с подтверждением отправлено",
    );
    expect(toast.error).not.toHaveBeenCalled();
  });
});
