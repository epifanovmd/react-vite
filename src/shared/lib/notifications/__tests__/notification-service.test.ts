import { toast } from "react-hot-toast";

import { NotificationService } from "../notification-service";

/** Node-процесс тестового раннера: на нём видны необработанные отказы промисов. */
declare const process: {
  on(event: "unhandledRejection", listener: (reason: unknown) => void): void;
  off(event: "unhandledRejection", listener: (reason: unknown) => void): void;
};

vi.mock("react-hot-toast", () => ({
  toast: {
    custom: vi.fn(
      (_render: unknown, options?: { id?: string }) => options?.id ?? "toast-1",
    ),
    dismiss: vi.fn(),
  },
}));

const flush = () => new Promise(resolve => setTimeout(resolve, 0));

const catchUnhandled = () => {
  const onUnhandled = vi.fn();

  process.on("unhandledRejection", onUnhandled);

  return {
    onUnhandled,
    stop: () => process.off("unhandledRejection", onUnhandled),
  };
};

describe("NotificationService.promise", () => {
  beforeEach(() => {
    vi.mocked(toast.custom).mockClear();
    vi.mocked(toast.dismiss).mockClear();
  });

  it("заменяет тост загрузки на успех с тем же id", async () => {
    const service = new NotificationService();

    await service.promise(Promise.resolve(2), {
      loading: "Сохраняем",
      success: value => `Готово: ${value}`,
      error: "Ошибка",
    });
    await flush();

    expect(toast.custom).toHaveBeenCalledTimes(2);
    expect(vi.mocked(toast.custom).mock.calls[1][1]).toMatchObject({
      id: "toast-1",
    });
  });

  it("исключение в messages.success не даёт unhandled rejection и снимает тост загрузки", async () => {
    const service = new NotificationService();
    const unhandled = catchUnhandled();

    await service.promise(Promise.resolve(1), {
      loading: "Сохраняем",
      success: () => {
        throw new Error("format failed");
      },
      error: "Ошибка",
    });
    await flush();
    unhandled.stop();

    expect(unhandled.onUnhandled).not.toHaveBeenCalled();
    expect(toast.dismiss).toHaveBeenCalledWith("toast-1");
  });

  it("исключение в messages.error не даёт unhandled rejection и снимает тост загрузки", async () => {
    const service = new NotificationService();
    const unhandled = catchUnhandled();
    const failing = Promise.reject(new Error("request failed"));

    await expect(
      service.promise(failing, {
        loading: "Сохраняем",
        success: "Готово",
        error: () => {
          throw new Error("format failed");
        },
      }),
    ).rejects.toThrow("request failed");
    await flush();
    unhandled.stop();

    expect(unhandled.onUnhandled).not.toHaveBeenCalled();
    expect(toast.dismiss).toHaveBeenCalledWith("toast-1");
  });
});
