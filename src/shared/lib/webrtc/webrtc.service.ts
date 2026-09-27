import { injectable } from "inversify";

import { IWebRTCService } from "./webrtc.types";

const DEFAULT_ICE_SERVERS: RTCIceServer[] = [
  { urls: "stun:stun.l.google.com:19302" },
  { urls: "stun:stun1.l.google.com:19302" },
];

@injectable()
export class WebRTCService implements IWebRTCService {
  createPeerConnection(config?: RTCConfiguration): RTCPeerConnection {
    return new RTCPeerConnection({
      iceServers: DEFAULT_ICE_SERVERS,
      ...config,
    });
  }

  async createOffer(pc: RTCPeerConnection): Promise<RTCSessionDescriptionInit> {
    const offer = await pc.createOffer();

    await pc.setLocalDescription(offer);

    return offer;
  }

  async createAnswer(
    pc: RTCPeerConnection,
  ): Promise<RTCSessionDescriptionInit> {
    const answer = await pc.createAnswer();

    await pc.setLocalDescription(answer);

    return answer;
  }

  async setRemoteDescription(
    pc: RTCPeerConnection,
    sdp: RTCSessionDescriptionInit,
  ): Promise<void> {
    await pc.setRemoteDescription(new RTCSessionDescription(sdp));
  }

  async addIceCandidate(
    pc: RTCPeerConnection,
    candidate: RTCIceCandidateInit,
  ): Promise<void> {
    await pc.addIceCandidate(new RTCIceCandidate(candidate));
  }
}
