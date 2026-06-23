import { iocHook } from "@di";

import { ISessionsStore } from "../Sessions.types";

export const useSessionsStore = iocHook(ISessionsStore);
