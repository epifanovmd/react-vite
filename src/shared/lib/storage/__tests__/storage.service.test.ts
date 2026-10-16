import { StorageService } from "../storage.service";

const fail = () => {
  throw new DOMException("denied", "SecurityError");
};

describe("StorageService", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it("читает, пишет и удаляет значения localStorage", () => {
    const storage = new StorageService();

    storage.setItem("k", "v");
    expect(storage.getItem("k")).toBe("v");

    storage.removeItem("k");
    expect(storage.getItem("k")).toBeNull();
  });

  it("недоступный localStorage не роняет вызовы: чтение — null, запись — no-op", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(fail);
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("full", "QuotaExceededError");
    });
    vi.spyOn(Storage.prototype, "removeItem").mockImplementation(fail);
    const storage = new StorageService();

    expect(storage.getItem("k")).toBeNull();
    expect(() => storage.setItem("k", "v")).not.toThrow();
    expect(() => storage.removeItem("k")).not.toThrow();
  });

  it("запрет доступа к самому localStorage не роняет вызовы", () => {
    vi.spyOn(window, "localStorage", "get").mockImplementation(fail);
    const storage = new StorageService();

    expect(storage.getItem("k")).toBeNull();
    expect(() => storage.setItem("k", "v")).not.toThrow();
    expect(() => storage.removeItem("k")).not.toThrow();
  });
});
