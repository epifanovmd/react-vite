import { IAuthStore } from "@entities/auth";
import { iocContainer } from "@shared/lib/di";
import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { useSignInVM } from "../useSignInVM";

const setup = (verified: boolean) => {
  const authStore = {
    isAuthenticated: false,
    signIn: vi.fn(),
    verify2FA: vi.fn(async () => {
      authStore.isAuthenticated = verified;
    }),
  };

  iocContainer.bind(IAuthStore.Tid).toConstantValue(authStore);

  const onSuccess = vi.fn();
  const { result } = renderHook(() => useSignInVM(onSuccess));

  return { authStore, onSuccess, result };
};

afterEach(() => {
  iocContainer.unbind(IAuthStore.Tid);
});

describe("useSignInVM", () => {
  it("поля входа по умолчанию пустые", () => {
    const { result } = setup(false);

    expect(result.current.form.getValues()).toEqual({
      login: "",
      password: "",
    });
  });

  it("второй фактор — свой пароль, после подтверждения вызывается onSuccess", async () => {
    const { authStore, onSuccess, result } = setup(true);

    act(() => result.current.form.setValue("password", "main-pass"));
    act(() => result.current.setTwoFactorPassword("second-pass"));
    await act(() => result.current.verifyTwoFactor());

    expect(authStore.verify2FA).toHaveBeenCalledWith("second-pass");
    expect(onSuccess).toHaveBeenCalledTimes(1);
  });

  it("второй фактор не подтверждён — onSuccess не вызывается", async () => {
    const { onSuccess, result } = setup(false);

    act(() => result.current.setTwoFactorPassword("wrong"));
    await act(() => result.current.verifyTwoFactor());

    expect(onSuccess).not.toHaveBeenCalled();
  });
});
