import {
  PrivacySettingsDto,
  UpdatePrivacySettingsPayload,
} from "@api/api-gen/data-contracts";
import { createServiceDecorator } from "@di";
import { EntityHolder, MutationHolder } from "@store";

export const IPrivacyStore = createServiceDecorator<IPrivacyStore>();

export interface IPrivacyStore {
  privacyHolder: EntityHolder<PrivacySettingsDto>;
  deleteMutation: MutationHolder<void, boolean>;
  settings: PrivacySettingsDto | null;
  isLoading: boolean;

  load(): Promise<void>;
  update(payload: UpdatePrivacySettingsPayload): Promise<boolean>;
  deleteAccount(): Promise<boolean>;
}
