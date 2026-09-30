import { hasPermission } from "@shared/lib/access";

import type {
  IPermissionCatalogGroup,
  IPermissionCatalogItem,
} from "../model/types";

/** Уровень действия в наборе прав: нет, только свои, все. */
export type PermissionLevel = "none" | "own" | "all";

/** Уровень действия и откуда он: явно выбран или получен через wildcard. */
export interface IPermissionLevelState {
  level: PermissionLevel;
  /** Уровень задан более широким правом (`file:*`, `*`) — точечно не меняется. */
  inherited: boolean;
}

/** Шаблон группы: уровни действий одной кнопкой. */
export type PermissionPreset =
  "none" | "view-all" | "own" | "view-all-edit-own" | "full";

const RANK: Record<PermissionLevel, number> = { none: 0, own: 1, all: 2 };

const isScoped = (item: IPermissionCatalogItem) => Boolean(item.own);

/** Действие просмотра группы: от него зависят остальные действия с областью. */
const viewOf = (group: IPermissionCatalogGroup) =>
  group.permissions.find(item => isScoped(item) && item.name.endsWith(":view"));

/** Уровень действия в наборе прав. */
export const levelOf = (
  selected: readonly string[],
  item: IPermissionCatalogItem,
): IPermissionLevelState => {
  if (selected.includes(item.name)) return { level: "all", inherited: false };
  if (item.own && selected.includes(item.own)) {
    return { level: "own", inherited: false };
  }
  if (hasPermission(selected, item.name)) {
    return { level: "all", inherited: true };
  }
  if (item.own && hasPermission(selected, item.own)) {
    return { level: "own", inherited: true };
  }

  return { level: "none", inherited: false };
};

const replace = (
  selected: readonly string[],
  item: IPermissionCatalogItem,
  level: PermissionLevel,
): string[] => {
  const rest = selected.filter(p => p !== item.name && p !== item.own);

  if (level === "all") return [...rest, item.name];
  if (level === "own" && item.own) return [...rest, item.own];

  return rest;
};

/**
 * Задать уровень действия. Действие с областью шире просмотра бессмысленно
 * (невидимую сущность не изменить): повышение действия поднимает просмотр,
 * понижение просмотра ограничивает остальные действия группы.
 */
export const setLevel = (
  selected: readonly string[],
  group: IPermissionCatalogGroup,
  item: IPermissionCatalogItem,
  level: PermissionLevel,
): string[] => {
  let next = replace(selected, item, level);
  const view = viewOf(group);

  if (!view || !isScoped(item)) return next;

  if (item === view) {
    for (const other of group.permissions) {
      const state = levelOf(next, other);

      if (
        other !== view &&
        isScoped(other) &&
        !state.inherited &&
        RANK[state.level] > RANK[level]
      ) {
        next = replace(next, other, level);
      }
    }

    return next;
  }

  const viewState = levelOf(next, view);

  if (!viewState.inherited && RANK[viewState.level] < RANK[level]) {
    next = replace(next, view, level);
  }

  return next;
};

const PRESET_LEVELS: Record<
  PermissionPreset,
  (item: IPermissionCatalogItem, isView: boolean) => PermissionLevel
> = {
  none: () => "none",
  "view-all": (_, isView) => (isView ? "all" : "none"),
  own: item => (isScoped(item) ? "own" : "all"),
  "view-all-edit-own": (item, isView) =>
    isView || !isScoped(item) ? "all" : "own",
  full: () => "all",
};

/** Применить шаблон к группе; остальные права набора не трогаются. */
export const applyPreset = (
  selected: readonly string[],
  group: IPermissionCatalogGroup,
  preset: PermissionPreset,
): string[] => {
  const view = viewOf(group);

  return group.permissions.reduce<string[]>(
    (next, item) =>
      replace(next, item, PRESET_LEVELS[preset](item, item === view)),
    [...selected],
  );
};

/** Есть ли в группе действия с областью «свои» — для них доступны шаблоны. */
export const hasScopedActions = (group: IPermissionCatalogGroup) =>
  group.permissions.some(isScoped);
