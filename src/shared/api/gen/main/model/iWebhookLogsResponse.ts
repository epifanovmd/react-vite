import type { WebhookLogDto } from "./webhookLogDto.ts";

export interface IWebhookLogsResponse {
  data: WebhookLogDto[];
  totalCount: number;
}
