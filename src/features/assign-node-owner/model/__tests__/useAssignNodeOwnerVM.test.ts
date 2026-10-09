import { IUserStore } from "@entities/user";
import { IMainApi } from "@shared/api";
import type { NodeDto } from "@shared/api/gen/main/model";
import { createFakeAccess } from "@shared/lib/access/testing";
import { iocContainer } from "@shared/lib/di";
import { INotificationService } from "@shared/lib/notifications";
import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useAssignNodeOwnerVM } from "../useAssignNodeOwnerVM";

const node = {
  id: "n-1",
  name: "alpha",
  ownerId: "u-1",
  ownerName: "Анна",
} as NodeDto;

const api = {
  getUserOptions: vi.fn(async () => ({
    data: {
      data: [
        { id: "u-1", name: "Анна" },
        { id: "u-2", name: null },
      ],
    },
  })),
  assignNodeOwner: vi.fn(),
  unassignNodeOwner: vi.fn(),
};
const toast = { success: vi.fn(), error: vi.fn() };
let permissions: string[];

beforeEach(() => {
  permissions = ["node:assign", "user:view"];
  iocContainer.bind(IMainApi.Tid).toConstantValue(api);
  iocContainer.bind(INotificationService.Tid).toConstantValue(toast);
  iocContainer
    .bind(IUserStore.Tid)
    .toConstantValue(createFakeAccess({ userId: "me", permissions }));
});

afterEach(() => {
  iocContainer.unbind(IMainApi.Tid);
  iocContainer.unbind(INotificationService.Tid);
  iocContainer.unbind(IUserStore.Tid);
  vi.clearAllMocks();
});

describe("useAssignNodeOwnerVM", () => {
  it("с правом на пользователей — их список без повторов", async () => {
    const { result, rerender } = renderHook(() =>
      useAssignNodeOwnerVM({ onSaved: vi.fn() }),
    );

    act(() => result.current.openFor(node));
    expect(result.current.userId).toBe("u-1");

    // Хук читает холдер вне observer — новый рендер показывает загруженное.
    await waitFor(() => {
      rerender();
      expect(result.current.userOptions.map(o => o.value)).toEqual([
        "u-1",
        "me",
        "u-2",
      ]);
    });
  });

  it("без права на пользователей — текущий владелец и сам пользователь", () => {
    permissions.splice(permissions.indexOf("user:view"), 1);

    const { result } = renderHook(() =>
      useAssignNodeOwnerVM({ onSaved: vi.fn() }),
    );

    act(() => result.current.openFor(node));
    expect(api.getUserOptions).not.toHaveBeenCalled();
    expect(result.current.canListUsers).toBe(false);
    expect(result.current.userOptions.map(o => o.value)).toEqual(["u-1", "me"]);
  });

  it("назначение, снятие и тот же владелец — без запроса", async () => {
    const onSaved = vi.fn();
    const updated = { ...node, ownerId: "u-2" };

    api.assignNodeOwner.mockResolvedValue({ data: updated });
    api.unassignNodeOwner.mockResolvedValue({ data: node });

    const { result } = renderHook(() => useAssignNodeOwnerVM({ onSaved }));

    act(() => result.current.openFor(node));
    await act(() => result.current.save());
    expect(api.assignNodeOwner).not.toHaveBeenCalled();
    expect(result.current.node).toBeNull();

    act(() => result.current.openFor(node));
    act(() => result.current.setUserId("u-2"));
    await act(() => result.current.save());
    expect(api.assignNodeOwner).toHaveBeenCalledWith("n-1", { userId: "u-2" });
    expect(onSaved).toHaveBeenCalledWith(updated);

    act(() => result.current.openFor(node));
    act(() => result.current.setUserId(null));
    await act(() => result.current.save());
    expect(api.unassignNodeOwner).toHaveBeenCalledWith("n-1");
    expect(toast.success).toHaveBeenLastCalledWith("Владелец снят");
  });
});
