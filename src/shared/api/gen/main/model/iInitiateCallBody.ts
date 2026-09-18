import type { ECallType } from "./eCallType.ts";

export interface IInitiateCallBody {
  calleeId: string;
  chatId?: string;
  type?: ECallType;
}
