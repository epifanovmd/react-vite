import { observable, runInAction } from "mobx";
import { describe, expect, it, vi } from "vitest";

import { AppDataStore } from "../app-data.store";

vi.mock("../router", () => ({ router: { navigate: vi.fn() } }));

const setup = () => {
  const auth = observable({ isAuthenticated: false });
  const userStore = { load: vi.fn(), reset: vi.fn() };
  const sessionStore = { reset: vi.fn() };
  const jobStore = { reset: vi.fn() };
  const initializer = { initialize: vi.fn(() => vi.fn()) };
  const store = new AppDataStore(
    auth as any,
    initializer as any,
    initializer as any,
    userStore as any,
    sessionStore as any,
    initializer as any,
    jobStore as any,
  );

  store.initialize();
  runInAction(() => (auth.isAuthenticated = true));

  return { auth, userStore, sessionStore, jobStore };
};

describe("AppDataStore", () => {
  it("выход сбрасывает данные пользователя: следующий вход не видит прежних прав", () => {
    const { auth, userStore, sessionStore, jobStore } = setup();

    expect(userStore.load).toHaveBeenCalledOnce();

    runInAction(() => (auth.isAuthenticated = false));

    expect(userStore.reset).toHaveBeenCalledOnce();
    expect(sessionStore.reset).toHaveBeenCalledOnce();
    expect(jobStore.reset).toHaveBeenCalledOnce();
  });
});
