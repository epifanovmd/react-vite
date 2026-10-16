import { injectable } from "inversify";

import { IStorageService } from "./storage.types";

/** Выполняет операцию над `localStorage`; при запрете доступа или переполнении отдаёт `fallback`. */
const safely = <T>(operation: (storage: Storage) => T, fallback: T): T => {
  try {
    return operation(localStorage);
  } catch {
    return fallback;
  }
};

/**
 * `localStorage` без исключений: в приватном режиме Safari, при запрете
 * cookies или переполнении чтение даёт `null`, запись и удаление — no-op.
 */
@injectable()
export class StorageService implements IStorageService {
  getItem(key: string): string | null {
    return safely(storage => storage.getItem(key), null);
  }

  setItem(key: string, value: string): void {
    safely(storage => storage.setItem(key, value), undefined);
  }

  removeItem(key: string): void {
    safely(storage => storage.removeItem(key), undefined);
  }
}
