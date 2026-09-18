import type { IStorageService } from "@shared/lib/storage";

import type { TokenPair } from "../session.types";
import { CrossTabTokenStorage } from "../storage/cross-tab-token-storage";
import { PersistentTokenStorage } from "../storage/persistent-token-storage";

const REFRESH_KEY = "app:refresh_token";

const tokens: TokenPair = { accessToken: "a", refreshToken: "r" };

const createBacking = (): IStorageService => ({
  getItem: key => localStorage.getItem(key),
  setItem: (key, value) => localStorage.setItem(key, value),
  removeItem: key => localStorage.removeItem(key),
});

const createStorage = () =>
  new CrossTabTokenStorage(
    new PersistentTokenStorage(createBacking(), { key: REFRESH_KEY }),
    [REFRESH_KEY],
  );

/** Событие `storage` браузер шлёт только в чужие вкладки. */
const emitStorageEvent = (key: string | null) =>
  window.dispatchEvent(new StorageEvent("storage", { key }));

describe("CrossTabTokenStorage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("делегирует чтение, запись и очистку", () => {
    const storage = createStorage();

    storage.write(tokens);
    expect(localStorage.getItem(REFRESH_KEY)).toBe("r");
    expect(storage.read()).toEqual({ accessToken: "", refreshToken: "r" });

    storage.clear();
    expect(storage.read()).toBeNull();
  });

  it("сообщает о правке следимого ключа из другой вкладки", () => {
    const storage = createStorage();
    const listener = vi.fn();

    storage.subscribe(listener);
    localStorage.setItem(REFRESH_KEY, "from-other-tab");
    emitStorageEvent(REFRESH_KEY);

    expect(listener).toHaveBeenCalledWith({
      accessToken: "",
      refreshToken: "from-other-tab",
    });
  });

  it("полная очистка хранилища тоже считается правкой", () => {
    const storage = createStorage();
    const listener = vi.fn();

    storage.write(tokens);
    storage.subscribe(listener);
    localStorage.clear();
    emitStorageEvent(null);

    expect(listener).toHaveBeenCalledWith(null);
  });

  it("чужие ключи игнорируются", () => {
    const storage = createStorage();
    const listener = vi.fn();

    storage.subscribe(listener);
    emitStorageEvent("theme");

    expect(listener).not.toHaveBeenCalled();
  });

  it("отписка снимает слушателя окна", () => {
    const storage = createStorage();
    const listener = vi.fn();

    storage.subscribe(listener)();
    emitStorageEvent(REFRESH_KEY);

    expect(listener).not.toHaveBeenCalled();
  });
});
