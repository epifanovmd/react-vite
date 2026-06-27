import { iocHook } from "@di";

import { IUserStore } from "../User.types";

export const useUserStore = iocHook(IUserStore);
