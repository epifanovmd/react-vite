import { iocHook } from "@di";

import { IUserSocketService } from "../User.socket.types";

export const useUserSocket = iocHook(IUserSocketService);
