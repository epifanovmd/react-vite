import { IMainApi } from "@shared/api";
import { iocContainer } from "@shared/lib/di";
import { INotificationService } from "@shared/lib/notifications";
import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useCreateApiKeyVM } from "../useCreateApiKeyVM";

const apiKey = { id: "k-1", name: "reports" };
const api = { createApiKey: vi.fn() };
const toast = { error: vi.fn(), success: vi.fn() };

beforeEach(() => {
  iocContainer.bind(IMainApi.Tid).toConstantValue(api);
  iocContainer.bind(INotificationService.Tid).toConstantValue(toast);
});

afterEach(() => {
  iocContainer.unbind(IMainApi.Tid);
  iocContainer.unbind(INotificationService.Tid);
  vi.clearAllMocks();
});

describe("useCreateApiKeyVM", () => {
  it("во время создания окно не закрывается — секрет не теряется", async () => {
    let finish: (value: unknown) => void = () => undefined;

    api.createApiKey.mockImplementation(
      () => new Promise(resolve => (finish = resolve)),
    );

    const onCreated = vi.fn();
    const { result } = renderHook(() => useCreateApiKeyVM({ onCreated }));

    act(() => result.current.openDialog());

    let submitting: Promise<void> = Promise.resolve();

    act(() => {
      submitting = result.current.submit({
        name: "reports",
        scopes: ["reports:export"],
      });
    });
    act(() => result.current.setOpen(false));
    expect(result.current.open).toBe(true);

    await act(async () => {
      finish({ data: { key: "secret-1", apiKey } });
      await submitting;
    });

    expect(result.current.open).toBe(true);
    expect(result.current.secret).toBe("secret-1");
    expect(onCreated).toHaveBeenCalledWith(apiKey);

    act(() => result.current.setOpen(false));
    expect(result.current.open).toBe(false);
  });
});
