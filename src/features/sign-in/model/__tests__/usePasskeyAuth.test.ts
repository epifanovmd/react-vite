import { IAuthStore } from "@entities/auth";
import { IMainApi } from "@shared/api";
import { iocContainer } from "@shared/lib/di";
import { IStorageService } from "@shared/lib/storage";
import { startAuthentication } from "@simplewebauthn/browser";
import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { usePasskeyAuth } from "../usePasskeyAuth";

vi.mock("@simplewebauthn/browser", () => ({
  browserSupportsWebAuthn: () => true,
  startAuthentication: vi.fn(),
  startRegistration: vi.fn(),
}));

const api = {
  generateAuthenticationOptions: vi.fn(),
  verifyAuthentication: vi.fn(),
  generateRegistrationOptions: vi.fn(),
  verifyRegistration: vi.fn(),
};
const auth = { restore: vi.fn() };
let saved: string | null = "user@example.com";
const storage = {
  getItem: () => saved,
  setItem: vi.fn(),
  removeItem: vi.fn(),
};

beforeEach(() => {
  saved = "user@example.com";
  iocContainer.bind(IMainApi.Tid).toConstantValue(api);
  iocContainer.bind(IAuthStore.Tid).toConstantValue(auth);
  iocContainer.bind(IStorageService.Tid).toConstantValue(storage);
});

afterEach(() => {
  iocContainer.unbind(IMainApi.Tid);
  iocContainer.unbind(IAuthStore.Tid);
  iocContainer.unbind(IStorageService.Tid);
  vi.clearAllMocks();
});

describe("usePasskeyAuth", () => {
  it("ошибка получения параметров входа — неуспех", async () => {
    api.generateAuthenticationOptions.mockResolvedValue({
      error: { message: "Passkey не найден" },
    });

    const onSuccess = vi.fn();
    const { result } = renderHook(() => usePasskeyAuth(onSuccess));
    let res: { ok: boolean; error?: string } | undefined;

    await act(async () => {
      res = await result.current.handleLogin();
    });

    expect(res).toEqual({ ok: false, error: "Passkey не найден" });
    expect(result.current.error).toBe("Passkey не найден");
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it("отмена системного диалога — не ошибка", async () => {
    api.generateAuthenticationOptions.mockResolvedValue({ data: {} });
    vi.mocked(startAuthentication).mockRejectedValue(
      Object.assign(
        new Error("The operation either timed out or was not allowed"),
        {
          name: "NotAllowedError",
        },
      ),
    );

    const { result } = renderHook(() => usePasskeyAuth(vi.fn()));
    let res: { ok: boolean; error?: string } | undefined;

    await act(async () => {
      res = await result.current.handleLogin();
    });

    expect(res).toEqual({ ok: false });
    expect(result.current.error).toBeNull();
  });

  it("сбой браузера без текста — сообщение на русском о входе", async () => {
    api.generateAuthenticationOptions.mockResolvedValue({ data: {} });
    vi.mocked(startAuthentication).mockRejectedValue("boom");

    const { result } = renderHook(() => usePasskeyAuth(vi.fn()));

    await act(async () => {
      await result.current.handleLogin();
    });

    expect(result.current.error).toBe("Не удалось войти с passkey");
  });

  it("на устройстве нет passkey — сообщение на русском", async () => {
    saved = null;

    const { result } = renderHook(() => usePasskeyAuth(vi.fn()));

    await act(async () => {
      await result.current.handleLogin();
    });

    expect(result.current.error).toBe("На этом устройстве нет passkey");
  });
});
