import { IAuthStore } from "@entities/auth";
import { ISessionStore } from "@entities/user";
import { IMainApi } from "@shared/api";
import { IAuthSessionGuard } from "@shared/lib/contracts";
import { iocContainer } from "@shared/lib/di";
import { HttpError, NetworkError } from "@shared/lib/http";
import { INotificationService } from "@shared/lib/notifications";
import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useManageSessionsVM } from "../useManageSessionsVM";

const confirm = vi.fn();

vi.mock("@shared/ui", async importOriginal => ({
  ...(await importOriginal<object>()),
  useConfirm: () => confirm,
}));

const createDeferred = <T>() => {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>(r => {
    resolve = r;
  });

  return { promise, resolve };
};

const sessionModels = [{ id: "s-1" }, { id: "s-2" }];
const sessions = {
  sessionModels,
  isLoading: false,
  load: vi.fn(),
  terminateSession: vi.fn(),
  terminateOtherSessions: vi.fn(),
};
const auth = { signOut: vi.fn() };
const api = { signOutAll: vi.fn() };
const guard = { isCurrentSession: vi.fn(), signOut: vi.fn() };
const toast = { error: vi.fn(), success: vi.fn() };

beforeEach(() => {
  sessions.isLoading = false;
  sessions.load.mockResolvedValue(undefined);
  iocContainer.bind(ISessionStore.Tid).toConstantValue(sessions);
  iocContainer.bind(IAuthStore.Tid).toConstantValue(auth);
  iocContainer.bind(IMainApi.Tid).toConstantValue(api);
  iocContainer.bind(IAuthSessionGuard.Tid).toConstantValue(guard);
  iocContainer.bind(INotificationService.Tid).toConstantValue(toast);
});

afterEach(() => {
  iocContainer.unbind(ISessionStore.Tid);
  iocContainer.unbind(IAuthStore.Tid);
  iocContainer.unbind(IMainApi.Tid);
  iocContainer.unbind(IAuthSessionGuard.Tid);
  iocContainer.unbind(INotificationService.Tid);
  vi.clearAllMocks();
});

const render = () => renderHook(() => useManageSessionsVM());

describe("useManageSessionsVM", () => {
  describe("список", () => {
    it("при монтировании сессии загружаются один раз", () => {
      const { rerender } = render();

      rerender();

      expect(sessions.load).toHaveBeenCalledTimes(1);
    });

    it("список и загрузка — из стора сессий", () => {
      sessions.isLoading = true;

      const { result } = render();

      expect(result.current.sessions).toBe(sessionModels);
      expect(result.current.isLoading).toBe(true);
    });

    it("текущая сессия определяется через guard", () => {
      guard.isCurrentSession.mockImplementation(id => id === "s-1");

      const { result } = render();

      expect(result.current.isCurrent("s-1")).toBe(true);
      expect(result.current.isCurrent("s-2")).toBe(false);
    });
  });

  describe("завершение одной сессии", () => {
    it("во время запроса terminatingId — id сессии, после — null, тоста нет", async () => {
      const deferred = createDeferred<unknown>();

      sessions.terminateSession.mockReturnValue(deferred.promise);

      const { result } = render();

      expect(result.current.terminatingId).toBeNull();

      let pending!: Promise<void>;

      act(() => {
        pending = result.current.terminate("s-2");
      });

      expect(result.current.terminatingId).toBe("s-2");
      expect(sessions.terminateSession).toHaveBeenCalledWith("s-2");

      deferred.resolve(null);
      await act(() => pending);

      expect(result.current.terminatingId).toBeNull();
      expect(toast.error).not.toHaveBeenCalled();
    });

    it("ошибка (4xx) — тост с сообщением сервера, спиннер снят", async () => {
      sessions.terminateSession.mockResolvedValue(
        new HttpError({ status: 404, message: "Сессия не найдена" }),
      );

      const { result } = render();

      await act(() => result.current.terminate("s-2"));

      expect(toast.error).toHaveBeenCalledWith("Сессия не найдена");
      expect(result.current.terminatingId).toBeNull();
    });

    it("без сети — тоста нет (его показал notifyErrors)", async () => {
      sessions.terminateSession.mockResolvedValue(new NetworkError());

      const { result } = render();

      await act(() => result.current.terminate("s-2"));

      expect(toast.error).not.toHaveBeenCalled();
    });
  });

  describe("завершение остальных сессий", () => {
    it("успех — тост, флаг загрузки снят", async () => {
      sessions.terminateOtherSessions.mockResolvedValue({ data: undefined });

      const { result } = render();

      await act(() => result.current.terminateOthers());

      expect(sessions.terminateOtherSessions).toHaveBeenCalledTimes(1);
      expect(toast.success).toHaveBeenCalledWith("Остальные сессии завершены");
      expect(result.current.isTerminatingOthers).toBe(false);
    });

    it("во время запроса isTerminatingOthers — true на следующем рендере", async () => {
      const deferred = createDeferred<unknown>();

      sessions.terminateOtherSessions.mockReturnValue(deferred.promise);

      const { result, rerender } = render();

      let pending!: Promise<unknown>;

      act(() => {
        pending = result.current.terminateOthers();
      });
      rerender();

      expect(result.current.isTerminatingOthers).toBe(true);

      deferred.resolve({ data: undefined });
      await act(() => pending);
      rerender();

      expect(result.current.isTerminatingOthers).toBe(false);
    });

    it("ошибка (4xx) — тост с сообщением сервера, без тоста успеха", async () => {
      sessions.terminateOtherSessions.mockResolvedValue({
        error: new HttpError({ status: 403, message: "Недостаточно прав" }),
      });

      const { result } = render();

      await act(() => result.current.terminateOthers());

      expect(toast.error).toHaveBeenCalledWith("Недостаточно прав");
      expect(toast.success).not.toHaveBeenCalled();
    });
  });

  describe("выход на всех устройствах", () => {
    it("спрашивает подтверждение с destructive-кнопкой", async () => {
      confirm.mockResolvedValue(false);

      const { result } = render();

      await act(() => result.current.signOutAll());

      expect(confirm).toHaveBeenCalledWith({
        title: "Выйти на всех устройствах?",
        description: "Все сессии, включая текущую, будут завершены.",
        confirmLabel: "Выйти везде",
        confirmVariant: "destructive",
      });
    });

    it("отказ в подтверждении — запроса и выхода нет", async () => {
      confirm.mockResolvedValue(false);

      const { result } = render();

      await act(() => result.current.signOutAll());

      expect(api.signOutAll).not.toHaveBeenCalled();
      expect(auth.signOut).not.toHaveBeenCalled();
    });

    it("успех — локальный выход", async () => {
      confirm.mockResolvedValue(true);
      api.signOutAll.mockResolvedValue({ data: undefined });

      const { result } = render();

      await act(() => result.current.signOutAll());

      expect(api.signOutAll).toHaveBeenCalledTimes(1);
      expect(auth.signOut).toHaveBeenCalledTimes(1);
      expect(toast.error).not.toHaveBeenCalled();
    });

    it("ошибка (4xx) — тост, пользователь не выходит", async () => {
      confirm.mockResolvedValue(true);
      api.signOutAll.mockResolvedValue({
        error: new HttpError({ status: 400, message: "Не удалось выйти" }),
      });

      const { result } = render();

      await act(() => result.current.signOutAll());

      expect(toast.error).toHaveBeenCalledWith("Не удалось выйти");
      expect(auth.signOut).not.toHaveBeenCalled();
    });
  });
});
