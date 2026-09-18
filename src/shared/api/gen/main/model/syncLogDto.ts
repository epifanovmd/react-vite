import type { ESyncAction } from "./eSyncAction.ts";
import type { ESyncEntityType } from "./eSyncEntityType.ts";
import type { RecordStringUnknown } from "./recordStringUnknown.ts";

export interface SyncLogDto {
  version: string;
  entityType: ESyncEntityType;
  entityId: string;
  entityKey: string;
  action: ESyncAction;
  /** @nullable */
  scopeId: string | null;
  payload: RecordStringUnknown | null;
  createdAt: string;
}
