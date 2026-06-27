import { IApiService } from "@api";
import {
  IProfileUpdateRequestDto,
  ProfileDto,
  TPermission,
  TRole,
  UserDto,
} from "@api/gen/model";
import { ProfileModel, UserModel } from "@models";
import { EntityHolder } from "@store/holders";
import { makeAutoObservable } from "mobx";

import { IUserStore } from "./User.types";

@IUserStore({ inSingleton: true })
class UserStore implements IUserStore {
  private _holder = new EntityHolder<UserDto>({
    onFetch: () => this._api.getMyUser(),
  });

  constructor(@IApiService() private _api: IApiService) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get user() {
    return this._holder.data;
  }

  get model() {
    return this.user ? new UserModel(this.user) : null;
  }

  get profile() {
    return this.user?.profile
      ? new ProfileModel({ user: this.user, ...this.user.profile })
      : null;
  }

  get roles() {
    return this.user?.roles ?? [];
  }

  get permissions(): TPermission[] {
    const user = this.user;

    if (!user) return [];

    const fromRoles = user.roles.flatMap(role =>
      role.permissions.map(p => p.name),
    );
    const direct = user.directPermissions.map(p => p.name);

    return Array.from(new Set([...fromRoles, ...direct]));
  }

  get error() {
    return this._holder.error?.message;
  }

  get isLoading() {
    return this._holder.isLoading;
  }

  get isReady() {
    return this._holder.isReady;
  }

  can(permission: TPermission): boolean {
    return this.permissions.includes(permission);
  }

  hasRole(role: TRole): boolean {
    return this.roles.some(r => r.name === role);
  }

  seed(user: UserDto) {
    this._holder.setData(user);
  }

  /** Точечно обновить поля текущего пользователя (например, из socket-события). */
  patchUser(patch: Partial<UserDto>) {
    const user = this._holder.data;

    if (!user) return;

    this._holder.setData({ ...user, ...patch });
  }

  /** Точечно обновить профиль текущего пользователя. */
  patchProfile(patch: Partial<ProfileDto>) {
    const user = this._holder.data;

    if (!user?.profile) return;

    this._holder.setData({
      ...user,
      profile: { ...user.profile, ...patch },
    });
  }

  load() {
    // Уже есть данные — обновляем «тихо», иначе полная загрузка со спиннером.
    return this._holder.isFilled ? this._holder.refresh() : this._holder.load();
  }

  refresh() {
    return this._holder.refresh();
  }

  async updateProfile(data: IProfileUpdateRequestDto) {
    const res = await this._api.updateMyProfile(data);
    const user = this._holder.data;

    if (res.data && user) {
      this._holder.setData({ ...user, profile: res.data });
    }

    return res;
  }

  reset() {
    this._holder.reset();
  }
}

export { UserStore };
