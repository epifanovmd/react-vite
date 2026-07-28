import type { AuthenticationExtensionsClientOutputs } from "./authenticationExtensionsClientOutputs.ts";
import type { AuthenticatorAttachment } from "./authenticatorAttachment.ts";
import type { AuthenticatorAttestationResponseJSON } from "./authenticatorAttestationResponseJSON.ts";
import type { Base64URLString } from "./base64URLString.ts";
import type { PublicKeyCredentialType } from "./publicKeyCredentialType.ts";

/**
 * A slightly-modified RegistrationCredential to simplify working with ArrayBuffers that
 * are Base64URL-encoded in the browser so that they can be sent as JSON to the server.
 *
 * https://w3c.github.io/webauthn/#dictdef-registrationresponsejson
 */
export interface RegistrationResponseJSON {
  id: Base64URLString;
  rawId: Base64URLString;
  response: AuthenticatorAttestationResponseJSON;
  authenticatorAttachment?: AuthenticatorAttachment;
  clientExtensionResults: AuthenticationExtensionsClientOutputs;
  type: PublicKeyCredentialType;
}
