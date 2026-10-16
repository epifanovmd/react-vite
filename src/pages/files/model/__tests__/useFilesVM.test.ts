import { IMainApi } from "@shared/api";
import type { IFileDto } from "@shared/api/gen/main/model";
import { iocContainer } from "@shared/lib/di";
import { INotificationService } from "@shared/lib/notifications";
import { ISocketTransport } from "@shared/lib/socket";
import { createFakeSocket, type IFakeSocket } from "@shared/lib/socket/testing";
import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useFilesVM } from "../useFilesVM";

vi.mock("@shared/ui", async importOriginal => ({
  ...(await importOriginal<object>()),
  useConfirm: () => vi.fn(async () => true),
}));

const file = (id: string, status = "processing") =>
  ({ id, name: `${id}.txt`, size: 1, status }) as unknown as IFileDto;

const api = { getMyFiles: vi.fn(), deleteFile: vi.fn() };
let socket: IFakeSocket;

const bindSocket = (value: IFakeSocket) =>
  iocContainer.bind(ISocketTransport.Tid).toConstantValue(value);

beforeEach(() => {
  socket = createFakeSocket();
  api.getMyFiles.mockResolvedValue({
    data: { items: [file("f1")], total: 1 },
  });
  iocContainer.bind(IMainApi.Tid).toConstantValue(api);
  iocContainer
    .bind(INotificationService.Tid)
    .toConstantValue({ error: vi.fn(), success: vi.fn() });
});

afterEach(() => {
  iocContainer.unbind(ISocketTransport.Tid);
  iocContainer.unbind(IMainApi.Tid);
  iocContainer.unbind(INotificationService.Tid);
  vi.clearAllMocks();
});

describe("useFilesVM", () => {
  it("грузит список при открытии; итог обработки — на месте", async () => {
    bindSocket(socket);

    const { result } = renderHook(() => useFilesVM());

    await waitFor(() => expect(result.current.files.items).toHaveLength(1));
    expect(api.getMyFiles).toHaveBeenCalledTimes(1);

    act(() => socket.fire("file:processed", file("f1", "ready")));
    expect(result.current.files.items[0].status).toBe("ready");
  });

  it("загрузка и удаление на другом устройстве — перечитать страницу", async () => {
    bindSocket(socket);

    const { result } = renderHook(() => useFilesVM());

    await waitFor(() => expect(result.current.files.items).toHaveLength(1));

    api.getMyFiles.mockResolvedValueOnce({
      data: { items: [file("f2"), file("f1")], total: 2 },
    });
    act(() => socket.fire("file:uploaded"));
    await waitFor(() => expect(result.current.files.items).toHaveLength(2));
  });

  it("после переподключения список перечитывается (события за обрыв потеряны)", async () => {
    bindSocket(socket);

    const { result } = renderHook(() => useFilesVM());

    await waitFor(() => expect(result.current.files.items).toHaveLength(1));

    api.getMyFiles.mockResolvedValueOnce({
      data: { items: [file("f1", "ready")], total: 1 },
    });
    act(() => socket.reconnect());
    await waitFor(() =>
      expect(result.current.files.items[0].status).toBe("ready"),
    );
    expect(api.getMyFiles).toHaveBeenCalledTimes(2);
  });

  it("первое подключение сокета после открытия — без лишнего перезапроса", async () => {
    bindSocket({
      ...socket,
      state: { status: "connecting", error: null },
    });

    const { result } = renderHook(() => useFilesVM());

    await waitFor(() => expect(result.current.files.items).toHaveLength(1));
    act(() => socket.reconnect());
    await act(async () => undefined);
    expect(api.getMyFiles).toHaveBeenCalledTimes(1);
  });
});
