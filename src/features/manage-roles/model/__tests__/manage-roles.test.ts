import { IMainApi } from "@shared/api";
import type { IRoleDto } from "@shared/api/gen/main/model";
import { iocContainer } from "@shared/lib/di";
import { INotificationService } from "@shared/lib/notifications";
import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useCreateRoleVM } from "../useCreateRoleVM";
import { useDeleteRole } from "../useDeleteRole";
import { useSaveRolePermissions } from "../useSaveRolePermissions";
import { newRoleSchema } from "../validation";

const confirm = vi.fn();

vi.mock("@shared/ui", async importOriginal => ({
  ...(await importOriginal<object>()),
  useConfirm: () => confirm,
}));

const role = (permissions?: string[]) =>
  ({
    id: "r-1",
    name: "moderator",
    permissions: permissions?.map(name => ({ name })),
  }) as unknown as IRoleDto;

const api = {
  createRole: vi.fn(),
  setRolePermissions: vi.fn(),
  deleteRole: vi.fn(),
};
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

describe("newRoleSchema", () => {
  it("строчная латиница с буквы; иначе — ошибка", () => {
    expect(newRoleSchema.safeParse({ name: " moderator " }).data).toEqual({
      name: "moderator",
    });
    expect(newRoleSchema.safeParse({ name: "1role" }).success).toBe(false);
    expect(newRoleSchema.safeParse({ name: "Role" }).success).toBe(false);
  });
});

describe("useCreateRoleVM", () => {
  it("новая роль без прав в ответе — с пустым набором; форма сброшена", async () => {
    const onCreated = vi.fn();

    api.createRole.mockResolvedValue({ data: role() });

    const { result } = renderHook(() => useCreateRoleVM({ onCreated }));

    act(() => result.current.form.setValue("name", "moderator"));
    await act(() => result.current.create({ name: "moderator" }));

    expect(api.createRole).toHaveBeenCalledWith({ name: "moderator" });
    expect(onCreated).toHaveBeenCalledWith({ ...role(), permissions: [] });
    expect(result.current.form.getValues("name")).toBe("");
    expect(toast.success).toHaveBeenCalledWith("Роль moderator создана");
  });

  it("ошибка сервера — тост, роль не добавляется", async () => {
    const onCreated = vi.fn();

    api.createRole.mockResolvedValue({ error: { message: "Занято" } });

    const { result } = renderHook(() => useCreateRoleVM({ onCreated }));

    await act(() => result.current.create({ name: "moderator" }));

    expect(onCreated).not.toHaveBeenCalled();
    expect(toast.error).toHaveBeenCalled();
  });
});

describe("useSaveRolePermissions", () => {
  it("сохранено — роль из ответа и тост", async () => {
    const onSaved = vi.fn();
    const saved = role(["a", "b"]);

    api.setRolePermissions.mockResolvedValue({ data: saved });

    const { result } = renderHook(() => useSaveRolePermissions({ onSaved }));

    expect(await result.current(role(["a"]), ["a", "b"])).toBe(true);
    expect(api.setRolePermissions).toHaveBeenCalledWith("r-1", {
      permissions: ["a", "b"],
    });
    expect(onSaved).toHaveBeenCalledWith(saved);
    expect(toast.success).toHaveBeenCalledWith(
      "Права роли moderator сохранены",
    );
  });

  it("ошибка сервера — false и тост", async () => {
    const onSaved = vi.fn();

    api.setRolePermissions.mockResolvedValue({ error: { message: "Нет" } });

    const { result } = renderHook(() => useSaveRolePermissions({ onSaved }));

    expect(await result.current(role(["a"]), [])).toBe(false);
    expect(onSaved).not.toHaveBeenCalled();
    expect(toast.error).toHaveBeenCalled();
  });
});

describe("useDeleteRole", () => {
  it("после подтверждения — удаление и уборка из списка", async () => {
    const onDeleted = vi.fn();

    confirm.mockResolvedValue(true);
    api.deleteRole.mockResolvedValue({});

    const { result } = renderHook(() => useDeleteRole({ onDeleted }));

    expect(await result.current(role())).toBe(true);
    expect(api.deleteRole).toHaveBeenCalledWith("r-1");
    expect(onDeleted).toHaveBeenCalledWith(role());
  });

  it("отказ в подтверждении — запроса нет", async () => {
    const onDeleted = vi.fn();

    confirm.mockResolvedValue(false);

    const { result } = renderHook(() => useDeleteRole({ onDeleted }));

    expect(await result.current(role())).toBe(false);
    expect(api.deleteRole).not.toHaveBeenCalled();
  });

  it("ошибка сервера — тост, роль остаётся", async () => {
    const onDeleted = vi.fn();

    confirm.mockResolvedValue(true);
    api.deleteRole.mockResolvedValue({ error: { message: "Системная" } });

    const { result } = renderHook(() => useDeleteRole({ onDeleted }));

    expect(await result.current(role())).toBe(false);
    expect(onDeleted).not.toHaveBeenCalled();
    expect(toast.error).toHaveBeenCalled();
  });
});
