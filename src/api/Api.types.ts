import { createServiceDecorator } from "@di";

import type { getRestApi } from "./gen/api";

export type IApiService = ReturnType<typeof getRestApi>;
export const IApiService = createServiceDecorator<IApiService>();
