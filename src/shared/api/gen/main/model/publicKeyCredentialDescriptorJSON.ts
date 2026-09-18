import type { AuthenticatorTransportFuture } from "./authenticatorTransportFuture.ts";
import type { Base64URLString } from "./base64URLString.ts";
import type { PublicKeyCredentialType } from "./publicKeyCredentialType.ts";

/**
 * https://w3c.github.io/webauthn/#dictdef-publickeycredentialdescriptorjson
 */
export interface PublicKeyCredentialDescriptorJSON {
  id: Base64URLString;
  type: PublicKeyCredentialType;
  transports?: AuthenticatorTransportFuture[];
}
