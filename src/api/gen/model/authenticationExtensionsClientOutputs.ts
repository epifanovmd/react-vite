import type { CredentialPropertiesOutput } from "./credentialPropertiesOutput.ts";

export interface AuthenticationExtensionsClientOutputs {
  appid?: boolean;
  credProps?: CredentialPropertiesOutput;
  hmacCreateSecret?: boolean;
}
