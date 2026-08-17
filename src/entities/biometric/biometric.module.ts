import { ContainerModule } from "inversify";

import { BiometricStore } from "./model/biometric-store";
import { IBiometricStore } from "./model/biometric-types";

export const biometricModule = new ContainerModule(({ bind }) => {
  bind(IBiometricStore.Tid).to(BiometricStore).inSingletonScope();
});
