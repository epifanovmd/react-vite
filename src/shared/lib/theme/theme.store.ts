import { IStorageService } from "@shared/lib/storage";
import { injectable } from "inversify";
import { makeAutoObservable } from "mobx";

import { IColorSchemeProvider } from "./color-scheme.types";
import { IThemeStore, ThemeMode } from "./theme.types";

const THEME_STORAGE_KEY = "theme";

const isThemeMode = (value: string | null): value is ThemeMode =>
  value === "light" || value === "dark";

/**
 * Тема интерфейса. Пока пользователь не выбрал тему сам, она следует за системной,
 * включая её смену на лету; ручной выбор сохраняется и отключает слежение.
 */
@injectable()
export class ThemeStore implements IThemeStore {
  private _theme: ThemeMode;
  private _stopFollowingSystem: (() => void) | null = null;

  constructor(
    @IStorageService() private _storage: IStorageService,
    @IColorSchemeProvider() private _colorScheme: IColorSchemeProvider,
  ) {
    const saved = this._storage.getItem(THEME_STORAGE_KEY);

    this._theme = isThemeMode(saved)
      ? saved
      : this._colorScheme.getPreferredScheme();

    makeAutoObservable<this, "_stopFollowingSystem">(
      this,
      { _stopFollowingSystem: false },
      { autoBind: true },
    );

    if (!isThemeMode(saved)) {
      this._stopFollowingSystem = this._colorScheme.onSchemeChange(
        this._applySystemScheme,
      );
    }
  }

  get theme(): ThemeMode {
    return this._theme;
  }

  get isDark(): boolean {
    return this._theme === "dark";
  }

  get isLight(): boolean {
    return this._theme === "light";
  }

  setTheme(theme: ThemeMode): void {
    this._stopFollowingSystem?.();
    this._stopFollowingSystem = null;
    this._theme = theme;
    this._storage.setItem(THEME_STORAGE_KEY, theme);
  }

  toggleTheme(): void {
    this.setTheme(this._theme === "dark" ? "light" : "dark");
  }

  private _applySystemScheme(scheme: ThemeMode): void {
    this._theme = scheme;
  }
}
