import { iocContainer } from "@shared/lib/di";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { IPermissionCatalogGroup } from "../../model/types";
import { IPermissionCatalogStore } from "../../model/types";
import { PermissionMatrix } from "../PermissionMatrix";

const scopedGroup: IPermissionCatalogGroup = {
  key: "file",
  label: "Файлы",
  permissions: [
    { name: "file:view", label: "Просмотр", own: "file:view:own" },
    { name: "file:create", label: "Создание" },
    { name: "file:update", label: "Изменение", own: "file:update:own" },
  ],
};

const plainGroup: IPermissionCatalogGroup = {
  key: "role",
  label: "Роли",
  permissions: [
    { name: "role:view", label: "Просмотр" },
    { name: "role:update", label: "Изменение" },
  ],
};

const bindCatalog = (groups: IPermissionCatalogGroup[]) =>
  iocContainer.bind(IPermissionCatalogStore.Tid).toConstantValue({
    groups,
    isLoading: false,
    error: null,
    load: vi.fn(),
    labelOf: (name: string) => name,
  });

afterEach(() => {
  iocContainer.unbind(IPermissionCatalogStore.Tid);
});

describe("PermissionMatrix", () => {
  it("«Свои» у изменения — право :own и просмотр своих", () => {
    bindCatalog([scopedGroup]);
    const onChange = vi.fn();

    render(<PermissionMatrix value={[]} onChange={onChange} />);

    const update = screen.getByRole("radiogroup", {
      name: "Файлы: Изменение",
    });

    fireEvent.click(within(update).getByRole("radio", { name: "Свои" }));

    expect([...onChange.mock.calls[0][0]].sort()).toEqual([
      "file:update:own",
      "file:view:own",
    ]);
  });

  it("действие без области — переключатель", () => {
    bindCatalog([scopedGroup]);
    const onChange = vi.fn();

    render(<PermissionMatrix value={[]} onChange={onChange} />);
    fireEvent.click(screen.getByRole("switch", { name: "Файлы: Создание" }));

    expect(onChange).toHaveBeenCalledWith(["file:create"]);
  });

  it("wildcard — уровни унаследованы и заблокированы", () => {
    bindCatalog([scopedGroup]);

    render(<PermissionMatrix value={["file:*"]} onChange={vi.fn()} />);

    expect(
      screen.getByRole("switch", { name: "Файлы: Создание" }),
    ).toBeDisabled();
    expect(screen.getAllByText(/через wildcard/)).toHaveLength(3);
  });

  it("шаблон «Всё смотреть — своё менять»", async () => {
    bindCatalog([scopedGroup]);
    const onChange = vi.fn();

    render(<PermissionMatrix value={[]} onChange={onChange} />);
    fireEvent.keyDown(screen.getByRole("button", { name: /Шаблон/ }), {
      key: "Enter",
    });
    fireEvent.click(
      await screen.findByRole("menuitem", {
        name: "Всё смотреть — своё менять",
      }),
    );

    expect([...onChange.mock.calls[0][0]].sort()).toEqual([
      "file:create",
      "file:update:own",
      "file:view",
    ]);
  });

  it("каталог без области — переключатели, без шаблонов и подсказки", () => {
    bindCatalog([plainGroup]);
    const onChange = vi.fn();

    render(<PermissionMatrix value={["role:view"]} onChange={onChange} />);

    expect(screen.queryByRole("radiogroup")).toBeNull();
    expect(screen.queryByRole("button", { name: /Шаблон/ })).toBeNull();
    expect(screen.queryByText(/«Свои»/)).toBeNull();
    expect(
      screen.getByRole("switch", { name: "Роли: Просмотр" }),
    ).toBeChecked();

    fireEvent.click(screen.getByRole("switch", { name: "Роли: Изменение" }));

    expect(onChange).toHaveBeenCalledWith(["role:view", "role:update"]);
  });

  it("только чтение и заблокированные права", () => {
    bindCatalog([plainGroup]);

    const { rerender } = render(
      <PermissionMatrix value={[]} onChange={vi.fn()} readOnly />,
    );

    expect(
      screen.getByRole("switch", { name: "Роли: Изменение" }),
    ).toBeDisabled();

    rerender(
      <PermissionMatrix
        value={[]}
        onChange={vi.fn()}
        isLocked={name => name === "role:update"}
      />,
    );

    expect(
      screen.getByRole("switch", { name: "Роли: Изменение" }),
    ).toBeDisabled();
    expect(
      screen.getByRole("switch", { name: "Роли: Просмотр" }),
    ).toBeEnabled();
  });
});
