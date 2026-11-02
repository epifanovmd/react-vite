import { IMainApi } from "@shared/api";
import { iocContainer } from "@shared/lib/di";
import { HttpError, NetworkError } from "@shared/lib/http";
import { INotificationService } from "@shared/lib/notifications";
import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { useTwoFactorVM } from "../useTwoFactorVM";

const ENABLE_FORM = {
  currentPassword: "main-pass",
  password: "second-pass1",
  confirmPassword: "second-pass1",
  hint: "",
};

const DISABLE_FORM = { currentPassword: "main-pass", password: "second-pass1" };

const setup = ({
  enable2FA = { data: undefined },
  disable2FA = { data: undefined },
}: { enable2FA?: unknown; disable2FA?: unknown } = {}) => {
  const api = {
    enable2FA: vi.fn().mockResolvedValue(enable2FA),
    disable2FA: vi.fn().mockResolvedValue(disable2FA),
  };
  const toast = { error: vi.fn(), success: vi.fn() };

  iocContainer.bind(IMainApi.Tid).toConstantValue(api);
  iocContainer.bind(INotificationService.Tid).toConstantValue(toast);

  const { result } = renderHook(() => useTwoFactorVM());

  return { api, toast, result };
};

afterEach(() => {
  iocContainer.unbind(IMainApi.Tid);
  iocContainer.unbind(INotificationService.Tid);
});

describe("useTwoFactorVM", () => {
  it("по умолчанию режим «Включить», переключается на «Отключить»", () => {
    const { result } = setup();

    expect(result.current.mode).toBe("enable");

    act(() => result.current.setMode("disable"));

    expect(result.current.mode).toBe("disable");
  });

  it("включение успешно — пустая подсказка уходит как undefined, форма сброшена, тост", async () => {
    const { api, toast, result } = setup();

    act(() => {
      result.current.enableForm.setValue("currentPassword", "main-pass");
      result.current.enableForm.setValue("password", "second-pass1");
    });
    await act(() => result.current.enable(ENABLE_FORM));

    expect(api.enable2FA).toHaveBeenCalledWith({
      currentPassword: "main-pass",
      password: "second-pass1",
      hint: undefined,
    });
    expect(result.current.enableForm.getValues()).toEqual({
      currentPassword: "",
      password: "",
      confirmPassword: "",
      hint: "",
    });
    expect(toast.success).toHaveBeenCalledWith("Двухфакторная защита включена");
  });

  it("включение с подсказкой — подсказка уходит на сервер, повтор пароля — нет", async () => {
    const { api, result } = setup();

    await act(() => result.current.enable({ ...ENABLE_FORM, hint: "кот" }));

    expect(api.enable2FA).toHaveBeenCalledWith({
      currentPassword: "main-pass",
      password: "second-pass1",
      hint: "кот",
    });
  });

  it("включение отклонено (4xx) — тост с ошибкой, введённое в форме сохраняется", async () => {
    const { toast, result } = setup({
      enable2FA: {
        error: new HttpError({ status: 400, message: "Неверный пароль" }),
      },
    });

    act(() => result.current.enableForm.setValue("currentPassword", "wrong"));
    await act(() => result.current.enable(ENABLE_FORM));

    expect(toast.error).toHaveBeenCalledWith("Неверный пароль");
    expect(toast.success).not.toHaveBeenCalled();
    expect(result.current.enableForm.getValues("currentPassword")).toBe(
      "wrong",
    );
  });

  it("включение без сети — тоста нет (его показал notifyErrors), успеха нет", async () => {
    const { toast, result } = setup({
      enable2FA: { error: new NetworkError() },
    });

    await act(() => result.current.enable(ENABLE_FORM));

    expect(toast.error).not.toHaveBeenCalled();
    expect(toast.success).not.toHaveBeenCalled();
  });

  it("отключение успешно — запрос с обоими паролями, форма сброшена, тост", async () => {
    const { api, toast, result } = setup();

    act(() => result.current.disableForm.setValue("password", "second-pass1"));
    await act(() => result.current.disable(DISABLE_FORM));

    expect(api.disable2FA).toHaveBeenCalledWith(DISABLE_FORM);
    expect(result.current.disableForm.getValues()).toEqual({
      currentPassword: "",
      password: "",
    });
    expect(toast.success).toHaveBeenCalledWith(
      "Двухфакторная защита отключена",
    );
  });

  it("отключение отклонено (4xx) — тост с ошибкой, введённое сохраняется", async () => {
    const { toast, result } = setup({
      disable2FA: {
        error: new HttpError({
          status: 403,
          message: "Неверный второй пароль",
        }),
      },
    });

    act(() => result.current.disableForm.setValue("password", "wrong"));
    await act(() => result.current.disable(DISABLE_FORM));

    expect(toast.error).toHaveBeenCalledWith("Неверный второй пароль");
    expect(toast.success).not.toHaveBeenCalled();
    expect(result.current.disableForm.getValues("password")).toBe("wrong");
  });

  it("после успеха режим не переключается", async () => {
    const { result } = setup();

    await act(() => result.current.enable(ENABLE_FORM));

    expect(result.current.mode).toBe("enable");
  });
});
