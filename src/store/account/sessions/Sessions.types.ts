import { SessionDto } from "@api/api-gen/data-contracts";
import { createServiceDecorator } from "@di";
import { SessionModel } from "@models";
import { CollectionHolder } from "@store";

export const ISessionsStore = createServiceDecorator<ISessionsStore>();

export interface ISessionsStore {
  sessionsHolder: CollectionHolder<SessionDto>;
  models: SessionModel[];
  isLoading: boolean;

  load(): Promise<void>;
  terminate(id: string): Promise<boolean>;
  terminateOthers(): Promise<boolean>;
}
