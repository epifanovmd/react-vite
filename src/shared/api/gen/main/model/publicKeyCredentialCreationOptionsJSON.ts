import type { AttestationConveyancePreference } from "./attestationConveyancePreference.ts";
import type { AuthenticationExtensionsClientInputs } from "./authenticationExtensionsClientInputs.ts";
import type { AuthenticatorSelectionCriteria } from "./authenticatorSelectionCriteria.ts";
import type { Base64URLString } from "./base64URLString.ts";
import type { PublicKeyCredentialDescriptorJSON } from "./publicKeyCredentialDescriptorJSON.ts";
import type { PublicKeyCredentialParameters } from "./publicKeyCredentialParameters.ts";
import type { PublicKeyCredentialRpEntity } from "./publicKeyCredentialRpEntity.ts";
import type { PublicKeyCredentialUserEntityJSON } from "./publicKeyCredentialUserEntityJSON.ts";

/**
 * A variant of PublicKeyCredentialCreationOptions suitable for JSON transmission to the browser to
 * (eventually) get passed into navigator.credentials.create(...) in the browser.
 *
 * This should eventually get replaced with official TypeScript DOM types when WebAuthn L3 types
 * eventually make it into the language:
 *
 * https://w3c.github.io/webauthn/#dictdef-publickeycredentialcreationoptionsjson
 */
export interface PublicKeyCredentialCreationOptionsJSON {
  rp: PublicKeyCredentialRpEntity;
  user: PublicKeyCredentialUserEntityJSON;
  challenge: Base64URLString;
  pubKeyCredParams: PublicKeyCredentialParameters[];
  timeout?: number;
  excludeCredentials?: PublicKeyCredentialDescriptorJSON[];
  authenticatorSelection?: AuthenticatorSelectionCriteria;
  attestation?: AttestationConveyancePreference;
  extensions?: AuthenticationExtensionsClientInputs;
}
