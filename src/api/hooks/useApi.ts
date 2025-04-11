import { iocHook } from "@force-dev/react";

import { IApiService } from "../Api.types.ts";

export const useApi = iocHook(IApiService);
