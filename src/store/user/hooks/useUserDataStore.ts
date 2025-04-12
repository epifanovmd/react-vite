import { iocHook } from "@force-dev/react";

import { IUserDataStore } from "../UserData.types.ts";

export const useUserDataStore = iocHook(IUserDataStore);
