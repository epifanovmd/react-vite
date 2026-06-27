import { IStorageService } from "./Storage.types";

@IStorageService({ inSingleton: true })
export class WebStorageService implements IStorageService {
  getItem(key: string): string | null {
    return localStorage.getItem(key);
  }

  setItem(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  removeItem(key: string): void {
    localStorage.removeItem(key);
  }
}
