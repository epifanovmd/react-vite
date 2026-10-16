import { createDisposer, disposer } from "../disposer";

/** Node-процесс тестового раннера: на нём видны необработанные отказы промисов. */
declare const process: {
  on(event: "unhandledRejection", listener: (reason: unknown) => void): void;
  off(event: "unhandledRejection", listener: (reason: unknown) => void): void;
};

const flush = () => new Promise(resolve => setTimeout(resolve, 0));

describe("disposer", () => {
  it("вызывает функцию и массив функций", () => {
    const a = vi.fn();
    const b = vi.fn();

    disposer([a, b]);
    disposer(a);

    expect(a).toHaveBeenCalledTimes(2);
    expect(b).toHaveBeenCalledTimes(1);
  });

  it("дожидается промиса и вызывает то, что он вернул", async () => {
    const a = vi.fn();
    const b = vi.fn();

    disposer(Promise.resolve(a));
    disposer(Promise.resolve([b]));
    await flush();

    expect(a).toHaveBeenCalledTimes(1);
    expect(b).toHaveBeenCalledTimes(1);
  });

  it("отклонённый промис не даёт unhandled rejection", async () => {
    const onUnhandled = vi.fn();

    process.on("unhandledRejection", onUnhandled);
    disposer(Promise.reject(new Error("initialize failed")));
    await flush();
    process.off("unhandledRejection", onUnhandled);

    expect(onUnhandled).not.toHaveBeenCalled();
  });
});

describe("Disposer", () => {
  it("копит функции и вызывает их один раз", () => {
    const a = vi.fn();
    const instance = createDisposer().add(a, [vi.fn()]);

    expect(instance.size).toBe(2);
    instance.dispose();
    instance.dispose();

    expect(a).toHaveBeenCalledTimes(1);
    expect(instance.size).toBe(0);
  });
});
