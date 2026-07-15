import type {
  IApiResponse,
  IOffsetParams,
  IPagedResponse,
} from "@store/holders";

import type {
  Order,
  OrderQuery,
  OrderSortDir,
  OrderSortField,
  OrderStatus,
} from "./table.types";

/**
 * Mock «сервера» заказов.
 *
 * Эмулирует серверную пагинацию, полнотекстовый поиск и сортировку с
 * искусственной задержкой — чтобы реально прокачать loading/refreshing
 * состояния PagedHolder. Контракт функции совпадает с настоящим
 * orval-клиентом: достаточно заменить тело на `api.getOrders(...)` и
 * таблица продолжит работать без изменений (Dependency Inversion —
 * страница зависит от абстракции `PagedFetchFn`, а не от источника).
 */

const FIRST_NAMES = [
  "Alex",
  "Maria",
  "John",
  "Olga",
  "David",
  "Elena",
  "Chris",
  "Anna",
  "Maxim",
  "Sara",
] as const;

const LAST_NAMES = [
  "Doe",
  "Smith",
  "Müller",
  "Rossi",
  "Novak",
  "Costa",
  "Kim",
  "Reyes",
  "Petrov",
  "Hansen",
] as const;

const STATUSES: OrderStatus[] = ["paid", "pending", "failed", "refunded"];

const CURRENCY = "USD";

const NETWORK_DELAY_MS = 450;

const TOTAL_ORDERS = 137;

/** Детерминированный ГПСЧ (LCG) — воспроизводимые данные между запусками. */
const createSeededRandom = (seed: number) => {
  let state = seed >>> 0;

  return () => {
    state = (state * 1103515245 + 12345) & 0x7fffffff;

    return state / 0x7fffffff;
  };
};

const pick = <T>(rand: () => number, arr: readonly T[]): T =>
  arr[Math.floor(rand() * arr.length)]!;

const generateOrders = (count: number): Order[] => {
  const rand = createSeededRandom(1337);

  const orders: Order[] = [];

  for (let i = 0; i < count; i++) {
    const first = pick(rand, FIRST_NAMES);

    const last = pick(rand, LAST_NAMES);

    const createdMs =
      Date.UTC(2024, 0, 1) + i * 86_400_000 + (i % 7) * 3_600_000;

    orders.push({
      id: `ORD-${String(i + 1).padStart(4, "0")}`,
      customer: `${first} ${last}`,
      email: `${first}.${last}@example.com`.toLowerCase(),
      status: pick(rand, STATUSES),
      amount: Math.floor(rand() * 49_950) + 500,
      currency: CURRENCY,
      items: Math.floor(rand() * 12) + 1,
      createdAt: new Date(createdMs).toISOString(),
    });
  }

  return orders;
};

/** Неизменяемый «датасет сервера». */
const ORDERS: Order[] = generateOrders(TOTAL_ORDERS);

const matchesSearch = (order: Order, search: string): boolean => {
  if (!search) return true;

  const q = search.toLowerCase();

  return (
    order.id.toLowerCase().includes(q) ||
    order.customer.toLowerCase().includes(q) ||
    order.email.toLowerCase().includes(q) ||
    order.status.toLowerCase().includes(q)
  );
};

const sortOrders = (
  orders: Order[],
  sortBy?: OrderSortField,
  sortDir?: OrderSortDir,
): Order[] => {
  if (!sortBy) return orders;

  const dir = sortDir === "desc" ? -1 : 1;

  const copy = [...orders];

  copy.sort((a, b) => {
    const av = a[sortBy];

    const bv = b[sortBy];

    if (typeof av === "number" && typeof bv === "number") return (av - bv) * dir;

    return String(av).localeCompare(String(bv)) * dir;
  });

  return copy;
};

const delay = (ms: number): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, ms));

/**
 * Серверная функция загрузки страницы заказов.
 *
 * Реализует контракт `PagedFetchFn<Order, OrderQuery>`: принимает
 * offset/limit и параметры запроса, возвращает срез страницы и
 * общее количество после применения фильтра.
 */
export const fetchOrders = async (
  { offset, limit }: IOffsetParams,
  { search, sortBy, sortDir, customer, statuses }: OrderQuery,
): Promise<IApiResponse<IPagedResponse<Order>>> => {
  await delay(NETWORK_DELAY_MS);

  const q = search.toLowerCase();

  const customerQ = customer?.trim().toLowerCase() ?? "";

  const filtered = ORDERS.filter(order => {
    if (q && !matchesSearch(order, search)) return false;

    // Пер-колоночный фильтр по клиенту.
    if (customerQ && !order.customer.toLowerCase().includes(customerQ))
      return false;

    // Пер-колоночный фильтр по статусам (multiselect).
    if (statuses && statuses.length > 0 && !statuses.includes(order.status))
      return false;

    return true;
  });

  const sorted = sortOrders(filtered, sortBy, sortDir);

  const page = sorted.slice(offset, offset + limit);

  return {
    data: {
      data: page,
      count: page.length,
      totalCount: sorted.length,
      offset,
      limit,
    },
  };
};
