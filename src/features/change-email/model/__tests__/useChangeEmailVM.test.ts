import { IUserStore } from "@entities/user";
import { iocContainer } from "@shared/lib/di";
import { HttpError, NetworkError } from "@shared/lib/http";
import { INotificationService } from "@shared/lib/notifications";
import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { useChangeEmailVM } from "../useChangeEmailVM";

const NEW_EMAIL = "new@example.com";

interface ISetupOptions {
  changeEmail?: unknown;
  confirmEmailChange?: unknown;
  user?: { email?: string } | null;
}

const setup = ({
  changeEmail = { data: undefined },
  confirmEmailChange = { data: {} },
  user = { email: "old@example.com" },
}: ISetupOptions = {}) => {
  const toast = { error: vi.fn(), success: vi.fn(), info: vi.fn() };
  const userStore = {
    user,
    changeEmail: vi.fn().mockResolvedValue(changeEmail),
    confirmEmailChange: vi.fn().mockResolvedValue(confirmEmailChange),
  };

  iocContainer.bind(IUserStore.Tid).toConstantValue(userStore);
  iocContainer.bind(INotificationService.Tid).toConstantValue(toast);

  const { result } = renderHook(() => useChangeEmailVM());

  return { toast, userStore, result };
};

type TResult = ReturnType<typeof setup>["result"];

const goToCodeStep = (result: TResult) =>
  act(() => result.current.requestChange({ email: NEW_EMAIL }));

afterEach(() => {
  iocContainer.unbind(IUserStore.Tid);
  iocContainer.unbind(INotificationService.Tid);
});

describe("useChangeEmailVM", () => {
  it("начальное состояние — шаг адреса, текущий email из стора", () => {
    const { result } = setup();

    expect(result.current.pendingEmail).toBeNull();
    expect(result.current.currentEmail).toBe("old@example.com");
    expect(result.current.emailForm.getValues()).toEqual({ email: "" });
    expect(result.current.codeForm.getValues()).toEqual({ code: "" });
  });

  it("пользователя нет — текущий email null", () => {
    const { result } = setup({ user: null });

    expect(result.current.currentEmail).toBeNull();
  });

  it("запрос смены успешен — переход на шаг кода, тост о письме", async () => {
    const { toast, userStore, result } = setup();

    await goToCodeStep(result);

    expect(userStore.changeEmail).toHaveBeenCalledWith(NEW_EMAIL);
    expect(result.current.pendingEmail).toBe(NEW_EMAIL);
    expect(toast.info).toHaveBeenCalledWith(
      `Код подтверждения отправлен на ${NEW_EMAIL}`,
    );
    expect(toast.error).not.toHaveBeenCalled();
  });

  it("запрос смены успешен — прежний ввод кода очищается", async () => {
    const { result } = setup();

    act(() => result.current.codeForm.setValue("code", "9999"));
    await goToCodeStep(result);

    expect(result.current.codeForm.getValues("code")).toBe("");
  });

  it("запрос смены отклонён (4xx) — тост с ошибкой, остаёмся на шаге адреса", async () => {
    const { toast, result } = setup({
      changeEmail: {
        error: new HttpError({ status: 409, message: "Email уже занят" }),
      },
    });

    await goToCodeStep(result);

    expect(toast.error).toHaveBeenCalledWith("Email уже занят");
    expect(toast.info).not.toHaveBeenCalled();
    expect(result.current.pendingEmail).toBeNull();
  });

  it("запрос смены без сети — тоста нет (его показал notifyErrors), шаг не меняется", async () => {
    const { toast, result } = setup({
      changeEmail: { error: new NetworkError() },
    });

    await goToCodeStep(result);

    expect(toast.error).not.toHaveBeenCalled();
    expect(toast.info).not.toHaveBeenCalled();
    expect(result.current.pendingEmail).toBeNull();
  });

  it("подтверждение кода успешно — возврат на шаг адреса, форма адреса очищена, тост", async () => {
    const { toast, userStore, result } = setup();

    act(() => result.current.emailForm.setValue("email", NEW_EMAIL));
    await goToCodeStep(result);
    await act(() => result.current.confirm({ code: "1234" }));

    expect(userStore.confirmEmailChange).toHaveBeenCalledWith("1234");
    expect(result.current.pendingEmail).toBeNull();
    expect(result.current.emailForm.getValues("email")).toBe("");
    expect(toast.success).toHaveBeenCalledWith("Email изменён");
  });

  it("неверный код (4xx) — тост с ошибкой, остаёмся на шаге кода", async () => {
    const { toast, result } = setup({
      confirmEmailChange: {
        error: new HttpError({ status: 400, message: "Неверный код" }),
      },
    });

    await goToCodeStep(result);
    await act(() => result.current.confirm({ code: "0000" }));

    expect(toast.error).toHaveBeenCalledWith("Неверный код");
    expect(toast.success).not.toHaveBeenCalled();
    expect(result.current.pendingEmail).toBe(NEW_EMAIL);
  });

  it("отмена — возврат на шаг адреса без запроса, введённый адрес сохраняется", async () => {
    const { userStore, result } = setup();

    act(() => result.current.emailForm.setValue("email", NEW_EMAIL));
    await goToCodeStep(result);
    act(() => result.current.cancel());

    expect(result.current.pendingEmail).toBeNull();
    expect(userStore.confirmEmailChange).not.toHaveBeenCalled();
    expect(userStore.changeEmail).toHaveBeenCalledTimes(1);
    expect(result.current.emailForm.getValues("email")).toBe(NEW_EMAIL);
  });
});
