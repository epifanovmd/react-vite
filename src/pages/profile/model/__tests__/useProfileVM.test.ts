import { IUserStore } from "@entities/user";
import { iocContainer } from "@shared/lib/di";
import { renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useProfileVM } from "../useProfileVM";

const userStore = {
  profile: null,
  user: null,
  load: vi.fn(async () => undefined),
};

beforeEach(() => {
  iocContainer.bind(IUserStore.Tid).toConstantValue(userStore);
});

afterEach(() => {
  iocContainer.unbind(IUserStore.Tid);
  vi.clearAllMocks();
});

describe("useProfileVM", () => {
  it("профиль грузится один раз при открытии, не на каждый render", () => {
    const { rerender } = renderHook(() => useProfileVM());

    rerender();
    rerender();

    expect(userStore.load).toHaveBeenCalledTimes(1);
  });
});
