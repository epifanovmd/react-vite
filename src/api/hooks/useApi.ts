import { iocHook } from "@force-dev/react";

import { IApiService } from "../Api.service.ts";

export const useApi = iocHook(IApiService);
