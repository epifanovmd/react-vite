import { iocHook } from "@force-dev/react";

import { IApiService } from "../Api.types.ts";
import { IApiTokenProvider } from "../ApiToken.provider.ts";

export const useApiTokenProvider = iocHook(IApiTokenProvider);
