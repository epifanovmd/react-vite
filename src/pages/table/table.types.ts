/**
 * Доменная модель таблицы заказов.
 *
 * Чистые типы без зависимостей от UI- и инфра-слоёв — ядро, на которое
 * опираются mock-API, определения колонок и view-model. Соответствует
 * правилу зависимостей чистой архитектуры: внешние слои зависят от ядра,
 * но не наоборот.
 */

/** Статус заказа — источник правды для Badge и серверной фильтрации. */
export type OrderStatus = "paid" | "pending" | "failed" | "refunded";

/** Заказ — одна строка таблицы. */
export interface Order {
  id: string;

  customer: string;

  email: string;

  status: OrderStatus;

  /** Сумма в минорных единицах (центах) — без float-неточностей. */
  amount: number;

  currency: string;

  /** Количество позиций в заказе. */
  items: number;

  /** ISO-8601 дата создания. */
  createdAt: string;
}

/** Поля, по которым разрешена серверная сортировка. */
export type OrderSortField = "customer" | "amount" | "items" | "createdAt";

export type OrderSortDir = "asc" | "desc";

/**
 * Аргументы запроса списка заказов.
 *
 * Передаются в `usePaged` как `watch`-аргумент и доходят до mock-API,
 * который выполняет серверные фильтрацию и сортировку. Состав полей
 * сознательно совпадает с тем, что реально обрабатывается на «сервере».
 */
export interface OrderQuery {
  search: string;

  sortBy?: OrderSortField;

  sortDir?: OrderSortDir;

  /** Пер-колоночный фильтр: подстрока по имени клиента. */
  customer?: string;

  /** Пер-колоночный фильтр: разрешённые статусы (multiselect). */
  statuses?: OrderStatus[];
}
