import { describe, expect, it, vi } from "vitest";

import type { IColorSchemeProvider } from "../color-scheme.types";
import { ThemeStore } from "../theme.store";
import type { ThemeMode } from "../theme.types";

const createStorage = (saved: string | null = null) => {
  const items = new Map<string, string>(saved ? [["theme", saved]] : []);

  return {
    getItem: (key: string) => items.get(key) ?? null,
    setItem: vi.fn((key: string, value: string) => void items.set(key, value)),
    removeItem: (key: string) => void items.delete(key),
  };
};

const createColorScheme = (initial: ThemeMode) => {
  const listeners = new Set<(scheme: ThemeMode) => void>();
  const provider: IColorSchemeProvider = {
    getPreferredScheme: () => initial,
    onSchemeChange: callback => {
      listeners.add(callback);

      return () => listeners.delete(callback);
    },
  };

  return {
    provider,
    change: (scheme: ThemeMode) =>
      listeners.forEach(listener => listener(scheme)),
  };
};

describe("ThemeStore", () => {
  it("без выбора пользователя — системная тема и её смена на лету", () => {
    const scheme = createColorScheme("light");
    const store = new ThemeStore(createStorage(), scheme.provider);

    expect(store.theme).toBe("light");

    scheme.change("dark");

    expect(store.theme).toBe("dark");
  });

  it("после ручного выбора смена системной темы не применяется", () => {
    const scheme = createColorScheme("light");
    const storage = createStorage();
    const store = new ThemeStore(storage, scheme.provider);

    store.setTheme("light");
    scheme.change("dark");

    expect(store.theme).toBe("light");
    expect(storage.setItem).toHaveBeenCalledWith("theme", "light");
  });

  it("сохранённый выбор важнее системной темы", () => {
    const scheme = createColorScheme("light");
    const store = new ThemeStore(createStorage("dark"), scheme.provider);

    scheme.change("light");

    expect(store.theme).toBe("dark");
  });

  it("toggleTheme — ручной выбор", () => {
    const scheme = createColorScheme("dark");
    const store = new ThemeStore(createStorage(), scheme.provider);

    store.toggleTheme();
    scheme.change("dark");

    expect(store.theme).toBe("light");
  });
});
