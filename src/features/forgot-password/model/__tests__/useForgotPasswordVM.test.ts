import { IMainApi } from "@shared/api";
import { iocContainer } from "@shared/lib/di";
import { HttpError } from "@shared/lib/http";
import { INotificationService } from "@shared/lib/notifications";
import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { useForgotPasswordVM } from "../useForgotPasswordVM";

const setup = (response: unknown) => {
  const api = { requestResetPassword: vi.fn().mockResolvedValue(response) };
  const toast = { error: vi.fn(), success: vi.fn() };

  iocContainer.bind(IMainApi.Tid).toConstantValue(api);
  iocContainer.bind(INotificationService.Tid).toConstantValue(toast);

  const { result } = renderHook(() => useForgotPasswordVM());

  return { toast, result };
};

afterEach(() => {
  iocContainer.unbind(IMainApi.Tid);
  iocContainer.unbind(INotificationService.Tid);
});

describe("useForgotPasswordVM", () => {
  it("ошибка запроса — тост, «Письмо отправлено» не показывается", async () => {
    const { toast, result } = setup({
      error: new HttpError({ status: 404, message: "Пользователь не найден" }),
    });

    await act(() => result.current.submit({ login: "user@example.com" }));

    expect(toast.error).toHaveBeenCalledWith("Пользователь не найден");
    expect(result.current.sent).toBe(false);
  });

  it("успех — экран «Письмо отправлено»", async () => {
    const { result } = setup({ data: undefined });

    await act(() => result.current.submit({ login: "user@example.com" }));

    expect(result.current.sent).toBe(true);
  });
});
