import { describe, expect, it } from "vitest";

import type { IPermissionCatalogGroup } from "../../model/types";
import {
  applyPreset,
  hasScopedActions,
  levelOf,
  setLevel,
} from "../permission-levels";

const group: IPermissionCatalogGroup = {
  key: "file",
  label: "Файлы",
  permissions: [
    { name: "file:view", label: "Просмотр", own: "file:view:own" },
    { name: "file:create", label: "Создание" },
    { name: "file:update", label: "Изменение", own: "file:update:own" },
    { name: "file:delete", label: "Удаление", own: "file:delete:own" },
  ],
};
const [view, create, update, remove] = group.permissions;
const sorted = (list: string[]) => [...list].sort();

/** Каталог сервера без области: поле `own` не приходит. */
const plainGroup: IPermissionCatalogGroup = {
  key: "role",
  label: "Роли",
  permissions: [
    { name: "role:view", label: "Просмотр" },
    { name: "role:update", label: "Изменение" },
  ],
};

describe("levelOf", () => {
  it("явный уровень: все, свои, нет", () => {
    expect(levelOf(["file:view"], view)).toEqual({
      level: "all",
      inherited: false,
    });
    expect(levelOf(["file:view:own"], view)).toEqual({
      level: "own",
      inherited: false,
    });
    expect(levelOf([], view)).toEqual({ level: "none", inherited: false });
  });

  it("wildcard — уровень унаследован", () => {
    expect(levelOf(["file:*"], update)).toEqual({
      level: "all",
      inherited: true,
    });
    expect(levelOf(["*"], create)).toEqual({ level: "all", inherited: true });
  });
});

describe("setLevel", () => {
  it("заменяет право действия, не трогая остальные", () => {
    expect(sorted(setLevel(["x:y", "file:view"], group, view, "own"))).toEqual([
      "file:view:own",
      "x:y",
    ]);
    expect(setLevel(["file:view:own"], group, view, "none")).toEqual([]);
  });

  it("действие шире просмотра поднимает просмотр", () => {
    expect(sorted(setLevel([], group, update, "own"))).toEqual([
      "file:update:own",
      "file:view:own",
    ]);
    expect(sorted(setLevel(["file:view:own"], group, remove, "all"))).toEqual([
      "file:delete",
      "file:view",
    ]);
  });

  it("понижение просмотра ограничивает действия группы", () => {
    const next = setLevel(
      ["file:view", "file:update", "file:delete:own", "file:create"],
      group,
      view,
      "own",
    );

    expect(sorted(next)).toEqual([
      "file:create",
      "file:delete:own",
      "file:update:own",
      "file:view:own",
    ]);
  });

  it("действие без области — вкл/выкл без связи с просмотром", () => {
    expect(setLevel([], group, create, "all")).toEqual(["file:create"]);
  });

  it("каталог без области — обычные вкл/выкл", () => {
    const [roleView, roleUpdate] = plainGroup.permissions;

    expect(setLevel([], plainGroup, roleUpdate, "all")).toEqual([
      "role:update",
    ]);
    expect(setLevel(["role:view"], plainGroup, roleView, "own")).toEqual([]);
  });
});

describe("applyPreset", () => {
  it("«Всё смотреть — своё менять»", () => {
    expect(sorted(applyPreset(["x:y"], group, "view-all-edit-own"))).toEqual([
      "file:create",
      "file:delete:own",
      "file:update:own",
      "file:view",
      "x:y",
    ]);
  });

  it("«Только свои», «Просмотр всех», «Нет», «Полный»", () => {
    expect(sorted(applyPreset([], group, "own"))).toEqual([
      "file:create",
      "file:delete:own",
      "file:update:own",
      "file:view:own",
    ]);
    expect(applyPreset(["file:update"], group, "view-all")).toEqual([
      "file:view",
    ]);
    expect(applyPreset(["file:update", "x:y"], group, "none")).toEqual(["x:y"]);
    expect(sorted(applyPreset([], group, "full"))).toEqual([
      "file:create",
      "file:delete",
      "file:update",
      "file:view",
    ]);
  });
});

describe("hasScopedActions", () => {
  it("есть ли в группе действия с областью", () => {
    expect(hasScopedActions(group)).toBe(true);
    expect(hasScopedActions(plainGroup)).toBe(false);
  });
});
