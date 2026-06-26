import type { EMessageStatus } from "./eMessageStatus.ts";
import type { MessageReceiptDtoUser } from "./messageReceiptDtoUser.ts";

export interface MessageReceiptDto {
  userId: string;
  status: EMessageStatus;
  updatedAt: string;
  user?: MessageReceiptDtoUser;
}
