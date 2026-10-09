import { IMainApi } from "@shared/api";
import type { NodeDto } from "@shared/api/gen/main/model";
import { iocContainer } from "@shared/lib/di";
import { INotificationService } from "@shared/lib/notifications";
import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useDeleteNode } from "../useDeleteNode";
import { useNodeFormVM } from "../useNodeFormVM";
import { nodeFormSchema } from "../validation";

const confirm = vi.fn();

vi.mock("@shared/ui", async importOriginal => ({
  ...(await importOriginal<object>()),
  useConfirm: () => confirm,
}));

const node = {
  id: "n-1",
  name: "alpha",
  host: "203.0.113.10",
  description: null,
  agentId: "a-1",
} as NodeDto;

const api = { createNode: vi.fn(), updateNode: vi.fn(), deleteNode: vi.fn() };
const toast = { success: vi.fn(), error: vi.fn() };

beforeEach(() => {
  iocContainer.bind(IMainApi.Tid).toConstantValue(api);
  iocContainer.bind(INotificationService.Tid).toConstantValue(toast);
});

afterEach(() => {
  iocContainer.unbind(IMainApi.Tid);
  iocContainer.unbind(INotificationService.Tid);
  vi.clearAllMocks();
});

describe("nodeFormSchema", () => {
  it("название обязательно, адрес — имя хоста или IP", () => {
    expect(
      nodeFormSchema.safeParse({ name: " ", host: "", description: "" })
        .success,
    ).toBe(false);
    expect(
      nodeFormSchema.safeParse({
        name: "alpha",
        host: "bad host!",
        description: "",
      }).success,
    ).toBe(false);
    expect(
      nodeFormSchema.safeParse({
        name: "alpha",
        host: "2001:db8::1",
        description: "",
      }).success,
    ).toBe(true);
  });
});

describe("useNodeFormVM", () => {
  it("создание: пустые поля уходят как null, окно закрывается", async () => {
    const onSaved = vi.fn();

    api.createNode.mockResolvedValue({ data: node });

    const { result } = renderHook(() => useNodeFormVM({ onSaved }));

    act(() => result.current.openCreate());
    expect(result.current.open).toBe(true);
    expect(result.current.editing).toBeNull();

    await act(() =>
      result.current.submit({ name: "alpha", host: "", description: "" }),
    );
    expect(api.createNode).toHaveBeenCalledWith({
      name: "alpha",
      host: null,
      description: null,
    });
    expect(onSaved).toHaveBeenCalledWith(node);
    expect(result.current.open).toBe(false);
  });

  it("изменение: форма заполнена узлом, ошибка — окно остаётся", async () => {
    api.updateNode.mockResolvedValue({ error: { message: "нельзя" } });

    const { result } = renderHook(() => useNodeFormVM({ onSaved: vi.fn() }));

    act(() => result.current.openEdit(node));
    expect(result.current.form.getValues()).toEqual({
      name: "alpha",
      host: "203.0.113.10",
      description: "",
    });

    await act(() =>
      result.current.submit({
        name: "alpha-2",
        host: "203.0.113.10",
        description: "ok",
      }),
    );
    expect(api.updateNode).toHaveBeenCalledWith("n-1", {
      name: "alpha-2",
      host: "203.0.113.10",
      description: "ok",
    });
    expect(toast.error).toHaveBeenCalled();
    expect(result.current.open).toBe(true);
  });
});

describe("useDeleteNode", () => {
  it("без подтверждения — не удаляет; с ним — удаляет и сообщает", async () => {
    const onDeleted = vi.fn();
    const { result } = renderHook(() => useDeleteNode({ onDeleted }));

    confirm.mockResolvedValueOnce(false);
    expect(await result.current(node)).toBe(false);
    expect(api.deleteNode).not.toHaveBeenCalled();

    confirm.mockResolvedValueOnce(true);
    api.deleteNode.mockResolvedValue({ data: undefined });
    expect(await result.current(node)).toBe(true);
    expect(api.deleteNode).toHaveBeenCalledWith("n-1");
    expect(onDeleted).toHaveBeenCalledWith(node);
  });

  it("ошибка сервера — узел остаётся", async () => {
    const onDeleted = vi.fn();
    const { result } = renderHook(() => useDeleteNode({ onDeleted }));

    confirm.mockResolvedValueOnce(true);
    api.deleteNode.mockResolvedValue({ error: { message: "нельзя" } });
    expect(await result.current(node)).toBe(false);
    expect(onDeleted).not.toHaveBeenCalled();
  });
});
