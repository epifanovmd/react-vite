import type { MediaItemDto } from "./mediaItemDto.ts";

export interface IMediaGalleryDto {
  data: MediaItemDto[];
  totalCount: number;
}
