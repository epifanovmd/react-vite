import type { ITokenStorage, TokenPair } from "../session.types";

/**
 * Обёртка над постоянным хранилищем, которая слышит правки из других вкладок.
 * Событие `storage` приходит только в чужие вкладки, поэтому собственные
 * записи петлю не создают.
 */
export class CrossTabTokenStorage implements ITokenStorage {
  constructor(
    private readonly _inner: ITokenStorage,
    /** Ключи, за которыми следим; правки остальных игнорируем. */
    private readonly _keys: readonly string[],
  ) {}

  read(): TokenPair | null {
    return this._inner.read();
  }

  write(tokens: TokenPair): void {
    this._inner.write(tokens);
  }

  clear(): void {
    this._inner.clear();
  }

  subscribe(listener: (tokens: TokenPair | null) => void): () => void {
    const onStorage = (event: StorageEvent) => {
      // key === null — хранилище очистили целиком.
      if (event.key !== null && !this._keys.includes(event.key)) return;

      listener(this._inner.read());
    };

    window.addEventListener("storage", onStorage);

    return () => window.removeEventListener("storage", onStorage);
  }
}
