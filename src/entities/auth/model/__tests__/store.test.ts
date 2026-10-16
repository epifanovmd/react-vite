import { describe, expect, it, vi } from "vitest";

import { AuthStore } from "../store";
import { AuthStatus } from "../types";

const TOKENS = { accessToken: "a", refreshToken: "r" };

const createSession = () => {
  let accessToken = "";
  const tokenListeners = new Set<(token: string) => void>();
  const expiredListeners = new Set<() => void>();
  const emit = (token: string) => {
    accessToken = token;
    tokenListeners.forEach(listener => listener(token));
  };

  return {
    get accessToken() {
      return accessToken;
    },
    setTokens: vi.fn((tokens: { accessToken: string }) =>
      emit(tokens.accessToken),
    ),
    clear: vi.fn(() => emit("")),
    restoreSession: vi.fn(async () => false),
    onTokenChange: (listener: (token: string) => void) => {
      tokenListeners.add(listener);
      listener(accessToken);

      return () => tokenListeners.delete(listener);
    },
    onSessionExpired: (listener: () => void) => {
      expiredListeners.add(listener);

      return () => expiredListeners.delete(listener);
    },
    emit,
  };
};

const setup = (api: Record<string, unknown> = {}) => {
  const session = createSession();
  const store = new AuthStore(api as never, session as never);

  return { store, session, api };
};

describe("AuthStore.logout", () => {
  it("завершает сессию на сервере без тоста, затем выходит локально", async () => {
    const calls: string[] = [];
    const signOut = vi.fn(async () => {
      calls.push("server");

      return { data: undefined };
    });
    const { store, session } = setup({ signOut });

    session.clear.mockImplementation(() => {
      calls.push("local");
      session.emit("");
    });

    await store.logout();

    expect(signOut).toHaveBeenCalledWith({ notifyErrors: false });
    expect(calls).toEqual(["server", "local"]);
    expect(store.status).toBe(AuthStatus.Unauthenticated);
  });

  it("ошибка сервера не мешает локальному выходу", async () => {
    const signOut = vi.fn(async () => ({ error: { message: "нет сети" } }));
    const { store, session } = setup({ signOut });

    await store.logout();

    expect(session.clear).toHaveBeenCalledOnce();
    expect(store.status).toBe(AuthStatus.Unauthenticated);
    expect(store.error).toBeUndefined();
  });
});

describe("AuthStore.signUp", () => {
  it("ошибка регистрации попадает в error", async () => {
    const signUp = vi.fn(async () => ({
      error: { message: "Логин занят" },
    }));
    const { store } = setup({ signUp });

    await store.signUp({} as never);

    expect(store.status).toBe(AuthStatus.Unauthenticated);
    expect(store.error).toBe("Логин занят");
  });

  it("новая попытка сбрасывает прежнюю ошибку", async () => {
    const signIn = vi.fn(async () => ({
      error: { message: "Неверный пароль" },
    }));
    const signUp = vi.fn(async () => ({ data: { tokens: TOKENS } }));
    const { store } = setup({ signIn, signUp });

    await store.signIn({} as never);
    expect(store.error).toBe("Неверный пароль");

    await store.signUp({} as never);

    expect(store.error).toBeUndefined();
    expect(store.status).toBe(AuthStatus.Authenticated);
  });

  it("пустой ответ — ошибка по-русски", async () => {
    const signUp = vi.fn(async () => ({}));
    const { store } = setup({ signUp });

    await store.signUp({} as never);

    expect(store.error).toBe("Неизвестная ошибка");
  });
});

describe("AuthStore — токен пришёл после неудачного восстановления", () => {
  it("временная ошибка restore, затем успешный повтор refresh — вход", async () => {
    const { store, session } = setup();

    await store.restore();
    expect(store.status).toBe(AuthStatus.Unauthenticated);

    session.emit("fresh");

    expect(store.status).toBe(AuthStatus.Authenticated);
  });

  it("первичный вызов подписки с пустым токеном не меняет статус", () => {
    const { store } = setup();

    expect(store.status).toBe(AuthStatus.Idle);
  });

  it("после выхода пустой токен не входит обратно", () => {
    const { store } = setup({});

    store.signOut();

    expect(store.status).toBe(AuthStatus.Unauthenticated);
  });

  it("ждём второй фактор — токен не переводит во вход", async () => {
    const signIn = vi.fn(async () => ({
      data: { require2FA: true, twoFactorToken: "t" },
    }));
    const { store, session } = setup({ signIn });

    await store.signIn({} as never);
    session.emit("other-tab");

    expect(store.status).toBe(AuthStatus.Unauthenticated);
  });

  it("во время загрузки токен не меняет статус — его выставит сам вызов", async () => {
    let resolve!: (value: unknown) => void;
    const signIn = vi.fn(
      () =>
        new Promise(r => {
          resolve = r;
        }),
    );
    const { store, session } = setup({ signIn });

    const pending = store.signIn({} as never);

    session.emit("x");
    expect(store.status).toBe(AuthStatus.Loading);

    resolve({ error: { message: "Неверный пароль" } });
    await pending;

    expect(store.status).toBe(AuthStatus.Unauthenticated);
  });
});
