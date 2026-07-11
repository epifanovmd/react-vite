import { ApiError, ApiResponse } from "@api";
import {
  IProfileUpdateRequestDto,
  IRoleDto,
  ProfileDto,
  TPermission,
  TRole,
  UserDto,
} from "@api/gen/model";
import { createServiceDecorator, SupportInitialize } from "@di";
import { IEntityHolderResult, IHolderError } from "@store/holders";

import { ProfileModel, UserModel } from "../models";

export const IUserStore = createServiceDecorator<IUserStore>();

/**
 * Доменный стор **текущего пользователя**: профиль, роли и эффективные
 * permissions. Отвечает только за данные авторизованного юзера — поток
 * аутентификации (вход/2FA/сессия) живёт в `IAuthStore`.
 */
export interface IUserStore {
  readonly user: UserDto | null;
  /** User-центричная view-модель (имя, инициалы, даты). */
  readonly model: UserModel | null;
  readonly profile: ProfileModel | null;
  readonly roles: IRoleDto[];
  /** Объединение permissions из всех ролей и прямых permissions пользователя. */
  readonly permissions: TPermission[];
  readonly error: string | undefined;
  readonly isLoading: boolean;
  readonly isReady: boolean;

  /** Есть ли у пользователя указанный permission (через роль или напрямую). */
  can(permission: TPermission): boolean;
  /** Есть ли у пользователя указанная роль. */
  hasRole(role: TRole): boolean;

  /** Мгновенно положить пользователя без запроса (например, из ответа login). */
  seed(user: UserDto): void;
  /** Точечно обновить поля текущего пользователя (например, из socket-события). */
  patchUser(patch: Partial<UserDto>): void;
  /** Точечно обновить профиль текущего пользователя. */
  patchProfile(patch: Partial<ProfileDto>): void;
  /**
   * Загрузить текущего пользователя с сервера. Если данные уже есть —
   * обновляет их «тихо» (не сбрасывая видимое состояние).
   */
  load(): Promise<IEntityHolderResult<UserDto, IHolderError>>;
  /** Принудительное фоновое обновление. */
  refresh(): Promise<IEntityHolderResult<UserDto, IHolderError>>;
  updateProfile(
    data: IProfileUpdateRequestDto,
  ): Promise<ApiResponse<ProfileDto, ApiError>>;
  reset(): void;
}

export const IUserRealtime = createServiceDecorator<IUserRealtime>();

/**
 * Realtime-мост: подписывается на socket-события текущего пользователя и
 * синхронизирует `IUserStore` без поллинга. Запускается на время авторизованной
 * сессии (см. `AppDataStore.initialize`), `initialize()` возвращает отписку.
 */
export type IUserRealtime = SupportInitialize;
