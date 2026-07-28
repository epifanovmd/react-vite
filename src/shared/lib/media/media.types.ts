import { createInjectDecorator } from "@shared/lib/di";

/**
 * Абстракция доступа к медиа-устройствам.
 * Web: navigator.mediaDevices. React Native: react-native-webrtc mediaDevices.
 */
export const IMediaService = createInjectDecorator<IMediaService>();

export interface IMediaService {
  getUserMedia(constraints?: MediaStreamConstraints): Promise<MediaStream>;
  stopStream(stream: MediaStream): void;
}
