import { IAuthJwtService, type JwtPayload } from "./AuthJwt.types";

@IAuthJwtService({ inSingleton: true })
export class AuthJwtService implements IAuthJwtService {
  parse(token: string): JwtPayload | null {
    try {
      const encoded = token.split(".")[1];

      if (!encoded) return null;

      const raw = atob(encoded);
      const payload = JSON.parse(raw) as Record<string, unknown>;

      if (typeof payload.exp !== "number" || typeof payload.sub !== "string") {
        return null;
      }

      return payload as JwtPayload;
    } catch {
      return null;
    }
  }

  isExpired(token: string, bufferSeconds = 60): boolean {
    const payload = this.parse(token);

    if (!payload) return true;

    return Date.now() / 1000 > payload.exp - bufferSeconds;
  }

  getExpiresIn(token: string, bufferSeconds = 60): number {
    const payload = this.parse(token);

    if (!payload) return 0;

    return Math.max(0, payload.exp - Date.now() / 1000 - bufferSeconds);
  }
}
