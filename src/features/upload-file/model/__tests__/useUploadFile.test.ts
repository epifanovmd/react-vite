import { IMainApi } from "@shared/api";
import { iocContainer } from "@shared/lib/di";
import type { HttpProgressListener } from "@shared/lib/http";
import { INotificationService } from "@shared/lib/notifications";
import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { useUploadFile } from "../useUploadFile";

afterEach(() => {
  iocContainer.unbind(IMainApi.Tid);
  iocContainer.unbind(INotificationService.Tid);
});

describe("useUploadFile", () => {
  it("показывает файл, номер в пачке и долю отправленного, в конце сбрасывает", async () => {
    let report: HttpProgressListener = () => {};
    let finish: (value: unknown) => void = () => {};
    const uploadFile = vi.fn(
      (_body: unknown, options: { onUploadProgress: HttpProgressListener }) => {
        report = options.onUploadProgress;

        return new Promise(resolve => {
          finish = resolve;
        });
      },
    );
    const onUploaded = vi.fn();

    iocContainer.bind(IMainApi.Tid).toConstantValue({ uploadFile });
    iocContainer
      .bind(INotificationService.Tid)
      .toConstantValue({ error: vi.fn() });

    const { result } = renderHook(() => useUploadFile({ onUploaded }));
    const file = new File(["abc"], "photo.png", { type: "image/png" });

    let done: Promise<void> = Promise.resolve();

    act(() => {
      done = result.current.upload([file]);
    });
    expect(result.current.progress).toEqual({
      name: "photo.png",
      index: 1,
      count: 1,
    });

    act(() => report({ loaded: 1, total: 2, ratio: 0.5 }));
    expect(result.current.progress?.ratio).toBe(0.5);

    await act(async () => {
      finish({ data: [{ id: "f1" }], error: null });
      await done;
    });
    expect(onUploaded).toHaveBeenCalledWith({ id: "f1" });
    expect(result.current.progress).toBeNull();
  });
});
