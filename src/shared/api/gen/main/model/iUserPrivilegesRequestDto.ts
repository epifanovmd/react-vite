import type { TPermission } from "./tPermission.ts";
import type { TRole } from "./tRole.ts";

export interface IUserPrivilegesRequestDto {
  /** Роли для назначения пользователю (заменяет текущие роли). */
  roles: TRole[];
  /**
   * Прямые разрешения, выданные этому пользователю дополнительно к разрешениям ролей.
   * Заменяет текущие прямые разрешения.
   */
  permissions: TPermission[];
}
