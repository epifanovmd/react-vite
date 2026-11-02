import { IUserStore } from "@entities/user";
import { iocContainer } from "@shared/lib/di";
import { HttpError, NetworkError } from "@shared/lib/http";
import type { UseLeaveConfirmationOptions } from "@shared/lib/navigation";
import { INotificationService } from "@shared/lib/notifications";
import { act, renderHook } from "@testing-library/react";
import { parseISO } from "date-fns";
import { afterEach, describe, expect, it, vi } from "vitest";

import { useEditProfileVM } from "../useEditProfileVM";

const leaveConfirmation = vi.hoisted(() => ({
  options: null as UseLeaveConfirmationOptions | null,
}));

vi.mock("@shared/lib/navigation", () => ({
  useLeaveConfirmation: (options: UseLeaveConfirmationOptions) => {
    leaveConfirmation.options = options;

    return { withoutConfirmation: <T>(action: () => T) => action() };
  },
}));

const profile = {
  firstName: "Иван",
  lastName: "Петров",
  gender: "male",
  birthDate: "1990-05-15T00:00:00.000Z",
};

const setup = ({
  open = true,
  response = { data: profile } as unknown,
}: { open?: boolean; response?: unknown } = {}) => {
  const userStore = {
    user: { profile } as { profile: Partial<typeof profile> } | null,
    updateProfile: vi.fn().mockResolvedValue(response),
  };
  const toast = { error: vi.fn(), success: vi.fn() };
  const onSuccess = vi.fn();

  iocContainer.bind(IUserStore.Tid).toConstantValue(userStore);
  iocContainer.bind(INotificationService.Tid).toConstantValue(toast);

  const hook = renderHook(
    (props: { open: boolean }) =>
      useEditProfileVM({ open: props.open, onSuccess }),
    { initialProps: { open } },
  );

  return { userStore, toast, onSuccess, ...hook };
};

afterEach(() => {
  iocContainer.unbind(IUserStore.Tid);
  iocContainer.unbind(INotificationService.Tid);
  leaveConfirmation.options = null;
});

describe("useEditProfileVM", () => {
  it("при открытии форма заполняется из профиля", () => {
    const { result } = setup();

    expect(result.current.form.getValues()).toEqual({
      firstName: "Иван",
      lastName: "Петров",
      gender: "male",
      birthDate: parseISO(profile.birthDate),
    });
  });

  it("пустой профиль — пустые строки и без даты", () => {
    const { userStore, result, rerender } = setup({ open: false });

    userStore.user = { profile: {} };
    rerender({ open: true });

    expect(result.current.form.getValues()).toEqual({
      firstName: "",
      lastName: "",
      gender: "",
      birthDate: undefined,
    });
  });

  it("закрытая модалка форму не заполняет", () => {
    const { result } = setup({ open: false });

    expect(result.current.form.getValues("firstName")).not.toBe("Иван");
  });

  it("повторное открытие — форма заново заполняется из текущего профиля", () => {
    const { userStore, result, rerender } = setup();

    act(() => {
      result.current.form.setValue("firstName", "Черновик", {
        shouldDirty: true,
      });
    });
    rerender({ open: false });
    userStore.user = { profile: { ...profile, firstName: "Пётр" } };
    rerender({ open: true });

    expect(result.current.form.getValues("firstName")).toBe("Пётр");
  });

  it("успех — пустые строки уходят как undefined, дата в ISO, тост и onSuccess", async () => {
    const { userStore, toast, onSuccess, result } = setup();

    await act(() =>
      result.current.submit({
        firstName: "",
        lastName: "Петров",
        gender: "",
        birthDate: parseISO(profile.birthDate),
      }),
    );

    expect(userStore.updateProfile).toHaveBeenCalledWith({
      firstName: undefined,
      lastName: "Петров",
      gender: undefined,
      birthDate: "1990-05-15T00:00:00.000Z",
    });
    expect(toast.success).toHaveBeenCalledWith("Профиль обновлён");
    expect(onSuccess).toHaveBeenCalledTimes(1);
  });

  it("ошибка 4xx — тост ошибки, модалка не закрывается", async () => {
    const { toast, onSuccess, result } = setup({
      response: {
        error: new HttpError({ status: 400, message: "Некорректная дата" }),
      },
    });

    await act(() => result.current.submit({ firstName: "Иван" }));

    expect(toast.error).toHaveBeenCalledWith("Некорректная дата");
    expect(toast.success).not.toHaveBeenCalled();
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it("ошибка сети — без тоста от экрана, модалка не закрывается", async () => {
    const { toast, onSuccess, result } = setup({
      response: { error: new NetworkError("Нет соединения") },
    });

    await act(() => result.current.submit({ firstName: "Иван" }));

    expect(toast.error).not.toHaveBeenCalled();
    expect(toast.success).not.toHaveBeenCalled();
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it("подтверждение ухода — только пока модалка открыта и форма изменена", () => {
    const { result, rerender } = setup();

    expect(leaveConfirmation.options?.when).toBe(false);

    act(() => {
      result.current.form.setValue("firstName", "Пётр", { shouldDirty: true });
    });

    expect(leaveConfirmation.options?.when).toBe(true);
    expect(leaveConfirmation.options?.dialog).toEqual({
      description: "Изменения профиля не сохранены и пропадут.",
    });

    rerender({ open: false });

    expect(leaveConfirmation.options?.when).toBe(false);
  });
});
