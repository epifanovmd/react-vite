import { disposer } from "@shared/lib/di";
import { observable, runInAction } from "mobx";
import { describe, expect, it, vi } from "vitest";

import { AppDataStore } from "../app-data.store";

vi.mock("../router", () => ({ router: { navigate: vi.fn() } }));

const setup = () => {
  const auth = observable(
    {
      isAuthenticated: false,
      isIdle: false,
      restore: vi.fn(async () => undefined),
    },
    { restore: false },
  );
  const userStore = { load: vi.fn(), reset: vi.fn() };
  const sessionStore = { reset: vi.fn() };
  const jobStore = { reset: vi.fn() };
  const agentsStore = { reset: vi.fn() };
  const nodesStore = { reset: vi.fn() };
  const initializer = { initialize: vi.fn(() => vi.fn()) };
  const store = new AppDataStore(
    auth as any,
    initializer as any,
    initializer as any,
    userStore as any,
    sessionStore as any,
    initializer as any,
    jobStore as any,
    agentsStore as any,
    nodesStore as any,
  );

  store.initialize();
  runInAction(() => (auth.isAuthenticated = true));

  return { auth, userStore, sessionStore, jobStore, agentsStore, nodesStore };
};

describe("AppDataStore", () => {
  it("выход сбрасывает данные пользователя: следующий вход не видит прежних прав", () => {
    const { auth, userStore, sessionStore, jobStore, agentsStore, nodesStore } =
      setup();

    expect(userStore.load).toHaveBeenCalledOnce();

    runInAction(() => (auth.isAuthenticated = false));

    expect(userStore.reset).toHaveBeenCalledOnce();
    expect(sessionStore.reset).toHaveBeenCalledOnce();
    expect(jobStore.reset).toHaveBeenCalledOnce();
    expect(agentsStore.reset).toHaveBeenCalledOnce();
    expect(nodesStore.reset).toHaveBeenCalledOnce();
  });
});

describe("AppDataStore — восстановление сессии", () => {
  /**
   * Жалоба: после 401 на refresh — пустой экран на /sign-in.
   *
   * Сессия восстанавливалась в async beforeLoad корневого маршрута: роутер
   * успевал показать экран ожидания, а редирект с `_app` попадал в гонку
   * перехода, где маршрут бросал undefined. Теперь сессия восстанавливается до
   * того, как роутер вообще появится, и его beforeLoad синхронны.
   */
  it("до конца restore роутер не запускается — isRestored ждёт его", async () => {
    let finish!: () => void;
    const auth = observable(
      {
        isAuthenticated: false,
        isIdle: true,
        restore: vi.fn(
          () =>
            new Promise<void>(resolve => {
              finish = resolve;
            }),
        ),
      },
      { restore: false },
    );
    const stub = {
      initialize: vi.fn(() => vi.fn()),
      reset: vi.fn(),
      load: vi.fn(),
    };
    const store = new AppDataStore(
      auth as any,
      stub as any,
      stub as any,
      stub as any,
      stub as any,
      stub as any,
      stub as any,
      stub as any,
      stub as any,
    );

    store.initialize();

    expect(auth.restore).toHaveBeenCalledOnce();
    expect(store.isRestored).toBe(false);

    finish();
    await Promise.resolve();
    await Promise.resolve();

    expect(store.isRestored).toBe(true);
  });

  it("сессия уже восстановлена — роутер сразу", () => {
    const auth = observable(
      {
        isAuthenticated: true,
        isIdle: false,
        restore: vi.fn(),
      },
      { restore: false },
    );
    const stub = {
      initialize: vi.fn(() => vi.fn()),
      reset: vi.fn(),
      load: vi.fn(),
    };
    const store = new AppDataStore(
      auth as any,
      stub as any,
      stub as any,
      stub as any,
      stub as any,
      stub as any,
      stub as any,
      stub as any,
      stub as any,
    );

    store.initialize();

    expect(auth.restore).not.toHaveBeenCalled();
    expect(store.isRestored).toBe(true);
  });
});

describe("AppDataStore — повторная инициализация", () => {
  const create = () => {
    const auth = observable(
      { isAuthenticated: true, isIdle: false, restore: vi.fn() },
      { restore: false },
    );
    const socket = { initialize: vi.fn(() => vi.fn()) };
    const userStore = { load: vi.fn(), reset: vi.fn() };
    const stub = { initialize: vi.fn(() => vi.fn()), reset: vi.fn() };
    const store = new AppDataStore(
      auth as any,
      socket as any,
      stub as any,
      userStore as any,
      stub as any,
      stub as any,
      stub as any,
      stub as any,
      stub as any,
    );

    return { auth, socket, userStore, store };
  };

  it("уже авторизован при initialize — сокет и realtime стартуют сразу", () => {
    const { socket, userStore, store } = create();

    store.initialize();

    expect(socket.initialize).toHaveBeenCalledOnce();
    expect(userStore.load).toHaveBeenCalledOnce();
  });

  it("dispose и повторный initialize (StrictMode) — сессия стартует заново", () => {
    const { socket, store } = create();
    const stopSocket = vi.fn();

    socket.initialize.mockReturnValueOnce(stopSocket);
    disposer(store.initialize());

    expect(stopSocket).toHaveBeenCalledOnce();

    store.initialize();

    expect(socket.initialize).toHaveBeenCalledTimes(2);
  });

  it("не авторизован при initialize — на вход не уводит и данные не сбрасывает", () => {
    const { auth, userStore, store } = create();

    runInAction(() => (auth.isAuthenticated = false));
    store.initialize();

    expect(userStore.reset).not.toHaveBeenCalled();
  });
});
