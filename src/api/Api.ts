import { iocContainer } from "@di";

import { IApiService } from "./Api.types";
import { getRestApi } from "./gen/api";

export const api = getRestApi();

if (!iocContainer.isBound(IApiService.Tid)) {
  iocContainer.bind(IApiService.Tid).toConstantValue(api);
}
