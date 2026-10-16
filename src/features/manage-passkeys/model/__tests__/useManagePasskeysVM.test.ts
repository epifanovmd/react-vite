import { IUserStore } from "@entities/user";
import { IMainApi } from "@shared/api";
import { iocContainer } from "@shared/lib/di";
import { INotificationService } from "@shared/lib/notifications";
import { IStorageService } from "@shared/lib/storage";
import { startRegistration } from "@simplewebauthn/browser";
import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useManagePasskeysVM } from "../useManagePasskeysVM";

vi.mock("@simplewebauthn/browser", () => ({
  browserSupportsWebAuthn: () => true,
  startRegistration: vi.fn(),
}));

vi.mock("@shared/ui", async importOriginal => ({
  ...(await importOriginal<object>()),
  useConfirm: () => vi.fn(),
}));

const api = {
  getPasskeys: vi.fn(async () => ({ data: { items: [] } })),
  generateRegistrationOptions: vi.fn(async () => ({ data: {} })),
  verifyRegistration: vi.fn(),
  deletePasskey: vi.fn(),
};
const toast = { error: vi.fn(), success: vi.fn() };
const storage = { getItem: vi.fn(), setItem: vi.fn(), removeItem: vi.fn() };
const userStore = { user: { email: "user@example.com" } };

beforeEach(() => {
  iocContainer.bind(IMainApi.Tid).toConstantValue(api);
  iocContainer.bind(INotificationService.Tid).toConstantValue(toast);
  iocContainer.bind(IStorageService.Tid).toConstantValue(storage);
  iocContainer.bind(IUserStore.Tid).toConstantValue(userStore);
  vi.mocked(startRegistration).mockResolvedValue({} as never);
});

afterEach(() => {
  iocContainer.unbind(IMainApi.Tid);
  iocContainer.unbind(INotificationService.Tid);
  iocContainer.unbind(IStorageService.Tid);
  iocContainer.unbind(IUserStore.Tid);
  vi.clearAllMocks();
});

describe("useManagePasskeysVM", () => {
  it("сервер не подтвердил passkey — ошибка, ключ не сохраняется", async () => {
    api.verifyRegistration.mockResolvedValue({ data: { verified: false } });

    const { result } = renderHook(() => useManagePasskeysVM());

    await waitFor(() => expect(api.getPasskeys).toHaveBeenCalled());
    await act(() => result.current.add());

    expect(toast.error).toHaveBeenCalledWith("Сервер не подтвердил passkey");
    expect(toast.success).not.toHaveBeenCalled();
    expect(storage.setItem).not.toHaveBeenCalled();
  });

  it("пустые параметры регистрации без ошибки — ошибка, не успех", async () => {
    api.generateRegistrationOptions.mockResolvedValueOnce({
      data: null,
    } as never);

    const { result } = renderHook(() => useManagePasskeysVM());

    await act(() => result.current.add());

    expect(startRegistration).not.toHaveBeenCalled();
    expect(toast.success).not.toHaveBeenCalled();
    expect(toast.error).toHaveBeenCalledWith(
      "Сервер не выдал параметры passkey",
    );
  });

  it("подтверждённый passkey — успех", async () => {
    api.verifyRegistration.mockResolvedValue({ data: { verified: true } });

    const { result } = renderHook(() => useManagePasskeysVM());

    await act(() => result.current.add());

    expect(toast.success).toHaveBeenCalledWith("Passkey добавлен");
    expect(storage.setItem).toHaveBeenCalled();
  });
});
