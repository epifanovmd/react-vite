import { ApiError } from "@api";
import {
  IRoleDto,
  IUserPrivilegesRequestDto,
  IUserUpdateRequestDto,
  PublicUserDto,
  UserDto,
} from "@api/api-gen/data-contracts";
import { ApiResponse } from "@api/api-gen/http-client";
import { createServiceDecorator } from "@di";
import { PublicUserModel, UserModel } from "@models";
import {
  CollectionHolder,
  EntityHolder,
  IHolderError,
  IMutationHolderResult,
  MutationHolder,
  PagedHolder,
} from "@store";

export interface IRoleOption {
  value: string;
  label: string;
}

export const IUsersDataStore = createServiceDecorator<IUsersDataStore>();

export interface IUsersDataStore {
  listHolder: PagedHolder<PublicUserDto>;
  userHolder: EntityHolder<UserDto, string>;
  rolesHolder: CollectionHolder<IRoleDto>;
  setPrivilegesMutation: MutationHolder<
    { id: string; params: IUserPrivilegesRequestDto },
    UserDto
  >;
  deleteUserMutation: MutationHolder<string, boolean>;
  models: PublicUserModel[];
  total: number;
  isLoading: boolean;
  user: UserDto | null;
  userModel: UserModel | null;
  roleOptions: IRoleOption[];

  load(): Promise<void>;
  loadRoles(): Promise<void>;
  loadUser(id: string): Promise<UserDto | null>;
  updateUser(
    id: string,
    params: IUserUpdateRequestDto,
  ): Promise<ApiResponse<UserDto, ApiError>>;
  setPrivileges(
    id: string,
    params: IUserPrivilegesRequestDto,
  ): Promise<IMutationHolderResult<UserDto>>;
  deleteUser(id: string): Promise<IMutationHolderResult<boolean>>;
}
