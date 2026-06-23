import { iocHook } from "@di";

import { IPrivacyStore } from "../Privacy.types";

export const usePrivacyStore = iocHook(IPrivacyStore);
