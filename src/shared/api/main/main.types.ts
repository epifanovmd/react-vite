import { createInjectDecorator } from "@shared/lib/di";
import type { IHttpClient } from "@shared/lib/http";

import type { getRestApi } from "../gen/main/api";

/** Клиент основного бэкенда: тосты, гонка запросов, bearer-авторизация. */
export const IMainHttpClient = createInjectDecorator<IHttpClient>();

/** Сгенерированный orval клиент основного бэкенда. */
export type IMainApi = ReturnType<typeof getRestApi>;
export const IMainApi = createInjectDecorator<IMainApi>();
