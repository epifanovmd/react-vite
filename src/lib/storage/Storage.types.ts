import { createServiceDecorator } from "@di";

export const IStorageService = createServiceDecorator<IStorageService>();

export interface IStorageService {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}
