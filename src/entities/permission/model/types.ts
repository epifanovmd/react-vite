import type {
  IPermissionCatalogGroupDto,
  IPermissionCatalogItemDto,
} from "@shared/api/gen/main/model";
import { createInjectDecorator } from "@shared/lib/di";
import type { IHolderError } from "@shared/lib/holders";

/** Право каталога; `own` — право «только на свои», нет — действие без области. */
export type IPermissionCatalogItem = IPermissionCatalogItemDto;

/** Группа прав каталога (обычно — сущность домена). */
export type IPermissionCatalogGroup = IPermissionCatalogGroupDto;

export const IPermissionCatalogStore =
  createInjectDecorator<IPermissionCatalogStore>("IPermissionCatalogStore");

/**
 * Каталог прав с сервера: группы с подписями для редакторов ролей и прав
 * пользователей. Каталог меняется только с деплоем — грузится один раз.
 */
export interface IPermissionCatalogStore {
  readonly groups: IPermissionCatalogGroup[];
  readonly isLoading: boolean;
  readonly error: IHolderError | null;

  /** Подпись права; неизвестное каталогу — само имя. */
  labelOf(name: string): string;
  load(): Promise<void>;
}
