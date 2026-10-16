import { renderHook } from "@testing-library/react";

import { iocContainer } from "../container";
import { createInjectDecorator } from "../create-inject-decorator";

interface IProbe {
  id: number;
}

const IProbe = createInjectDecorator<IProbe>("IProbe:create-inject-decorator");

describe("createInjectDecorator.useInstance", () => {
  beforeEach(() => {
    if (!iocContainer.isBound(IProbe.Tid)) {
      iocContainer.bind(IProbe.Tid).toConstantValue({ id: 1 });
    }
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("берёт экземпляр из контейнера один раз, а не на каждом рендере", () => {
    const get = vi.spyOn(iocContainer, "get");
    const { result, rerender } = renderHook(() => IProbe.useInstance());

    rerender();
    rerender();

    expect(result.current).toEqual({ id: 1 });
    expect(get).toHaveBeenCalledTimes(1);
  });
});
