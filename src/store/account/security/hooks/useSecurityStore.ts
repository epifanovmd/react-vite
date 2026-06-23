import { iocHook } from "@di";

import { ISecurityStore } from "../Security.types";

export const useSecurityStore = iocHook(ISecurityStore);
