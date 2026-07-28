import { injectable } from "inversify";

import { IMediaService } from "./media.types";

@injectable()
export class MediaService implements IMediaService {
  async getUserMedia(
    constraints?: MediaStreamConstraints,
  ): Promise<MediaStream> {
    return navigator.mediaDevices.getUserMedia(
      constraints ?? { audio: true, video: false },
    );
  }

  stopStream(stream: MediaStream): void {
    stream.getTracks().forEach(track => track.stop());
  }
}
