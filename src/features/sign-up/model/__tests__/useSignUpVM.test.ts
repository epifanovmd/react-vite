import { IAuthStore } from "@entities/auth";
import { iocContainer } from "@shared/lib/di";
import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { useSignUpVM } from "../useSignUpVM";

/** Фейк стора: `signUp` либо авторизует, либо оставляет ошибку в `error`. */
const setup = ({ succeeds }: { succeeds: boolean }) => {
  const authStore = {
    isAuthenticated: false,
    error: undefined as string | undefined,
    signUp: vi.fn(async () => {
      if (succeeds) authStore.isAuthenticated = true;
      else authStore.error = "Пользователь уже существует";
    }),
  };
  const onSuccess = vi.fn();

  iocContainer.bind(IAuthStore.Tid).toConstantValue(authStore);

  const { result } = renderHook(() => useSignUpVM(onSuccess));

  return { authStore, onSuccess, result };
};

const form = {
  password: "secret1",
  confirmPassword: "secret1",
  firstName: "Иван",
  lastName: "Петров",
};

afterEach(() => {
  iocContainer.unbind(IAuthStore.Tid);
});

describe("useSignUpVM", () => {
  it("логин-email — регистрация по email, после авторизации onSuccess", async () => {
    const { authStore, onSuccess, result } = setup({ succeeds: true });

    await act(() =>
      result.current.handleSignUp({ ...form, login: "user@example.com" }),
    );

    expect(authStore.signUp).toHaveBeenCalledWith({
      email: "user@example.com",
      password: "secret1",
      firstName: "Иван",
      lastName: "Петров",
    });
    expect(onSuccess).toHaveBeenCalledTimes(1);
  });

  it("логин-телефон — регистрация по телефону", async () => {
    const { authStore, onSuccess, result } = setup({ succeeds: true });

    await act(() =>
      result.current.handleSignUp({ ...form, login: "+79991234567" }),
    );

    expect(authStore.signUp).toHaveBeenCalledWith({
      phone: "+79991234567",
      password: "secret1",
      firstName: "Иван",
      lastName: "Петров",
    });
    expect(onSuccess).toHaveBeenCalledTimes(1);
  });

  it("ошибка регистрации — onSuccess не вызывается", async () => {
    const { onSuccess, result } = setup({ succeeds: false });

    await act(() =>
      result.current.handleSignUp({ ...form, login: "user@example.com" }),
    );

    expect(onSuccess).not.toHaveBeenCalled();
  });

  it("пароли не совпадают — ошибка у повтора пароля, регистрация не уходит", async () => {
    const { authStore, result } = setup({ succeeds: true });

    act(() => {
      result.current.form.reset({
        ...form,
        login: "user@example.com",
        confirmPassword: "secret2",
      });
    });
    await act(() =>
      result.current.form.handleSubmit(result.current.handleSignUp)(),
    );

    expect(
      result.current.form.getFieldState("confirmPassword").error?.message,
    ).toBe("Пароли не совпадают.");
    expect(authStore.signUp).not.toHaveBeenCalled();
  });

  it("логин не email и не телефон — ошибка у логина, регистрация не уходит", async () => {
    const { authStore, result } = setup({ succeeds: true });

    act(() => {
      result.current.form.reset({ ...form, login: "просто-текст" });
    });
    await act(() =>
      result.current.form.handleSubmit(result.current.handleSignUp)(),
    );

    expect(result.current.form.getFieldState("login").error?.message).toBe(
      "Введите корректный email или номер телефона",
    );
    expect(authStore.signUp).not.toHaveBeenCalled();
  });

  it("валидная форма — регистрация уходит через submit формы", async () => {
    const { authStore, onSuccess, result } = setup({ succeeds: true });

    act(() => {
      result.current.form.reset({ ...form, login: "user@example.com" });
    });
    await act(() =>
      result.current.form.handleSubmit(result.current.handleSignUp)(),
    );

    expect(authStore.signUp).toHaveBeenCalledTimes(1);
    expect(onSuccess).toHaveBeenCalledTimes(1);
  });
});
