import {
  IApiResponse,
  IOffsetParams,
  IPagedResponse,
  PagedFetchFn,
} from "@store/holders";

import type {
  Invoice,
  InvoiceLineItem,
  Order,
  OrderQuery,
  OrderSortDir,
  OrderSortField,
  OrderStatus,
} from "./table.types";

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

  return Array.from({ length: count }, (_, i) => {
    const first = pick(rand, FIRST_NAMES);
    const last = pick(rand, LAST_NAMES);
    const createdMs =
      Date.UTC(2024, 0, 1) + i * 86_400_000 + (i % 7) * 3_600_000;

    return {
      id: `ORD-${String(i + 1).padStart(4, "0")}`,
      customer: `${first} ${last}`,
      email: `${first}.${last}@example.com`.toLowerCase(),
      status: pick(rand, STATUSES),
      amount: Math.floor(rand() * 49_950) + 500,
      currency: CURRENCY,
      items: Math.floor(rand() * 12) + 1,
      createdAt: new Date(createdMs).toISOString(),
    };
  });
};

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

  return [...orders].sort((a, b) => {
    const av = a[sortBy];
    const bv = b[sortBy];

    if (typeof av === "number" && typeof bv === "number")
      return (av - bv) * dir;

    return String(av).localeCompare(String(bv)) * dir;
  });
};

const delay = (ms: number): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, ms));

export const fetchOrders: PagedFetchFn<Order, OrderQuery> = async (
  { offset, limit },
  args,
): Promise<IApiResponse<IPagedResponse<Order>>> => {
  const { search, sortBy, sortDir, customer, statuses } = args || {};

  await delay(NETWORK_DELAY_MS);

  const q = search?.toLowerCase();
  const customerQ = customer?.trim().toLowerCase() ?? "";

  const filtered = ORDERS.filter(order => {
    if (q && search && !matchesSearch(order, search)) return false;
    if (customerQ && !order.customer.toLowerCase().includes(customerQ))
      return false;
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

const CLIENT_ORDERS: Order[] = generateOrders(500);

export const getClientOrders = (search: string): Order[] => {
  let result = CLIENT_ORDERS;

  if (search) {
    const q = search.toLowerCase();

    result = result.filter(
      order =>
        order.id.toLowerCase().includes(q) ||
        order.customer.toLowerCase().includes(q) ||
        order.email.toLowerCase().includes(q) ||
        order.status.toLowerCase().includes(q),
    );
  }

  return result;
};

const PRODUCTS = [
  "Wireless Mouse",
  "Mechanical Keyboard",
  "USB-C Hub",
  `27" Monitor`,
  "Webcam HD",
  "Noise Cancelling Headphones",
  "Laptop Stand",
  "Desk Lamp",
  "Ergonomic Chair",
  "Cable Management Kit",
] as const;

const generateLineItems = (
  rand: () => number,
  count: number,
): InvoiceLineItem[] => {
  const items: InvoiceLineItem[] = [];
  const usedProducts = new Set<string>();

  for (let i = 0; i < count; i++) {
    let product = pick(rand, PRODUCTS);

    while (usedProducts.has(product)) product = pick(rand, PRODUCTS);
    usedProducts.add(product);
    items.push({
      product,
      quantity: Math.floor(rand() * 5) + 1,
      unitPrice: Math.floor(rand() * 20000) + 500,
    });
  }

  return items;
};

const INVOICE_CUSTOMERS = [
  "Acme Corp",
  "Globex Inc",
  "Initech",
  "Hooli",
  "Stark Industries",
  "Wayne Enterprises",
  "Cyberdyne Systems",
  "Umbrella Corp",
] as const;

export const generateInvoices = (count: number): Invoice[] => {
  const rand = createSeededRandom(42);

  return Array.from({ length: count }, (_, i) => {
    const items = generateLineItems(rand, Math.floor(rand() * 5) + 1);
    const total = items.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0,
    );

    return {
      id: `INV-${String(i + 1).padStart(4, "0")}`,
      customer: pick(rand, INVOICE_CUSTOMERS),
      date: new Date(Date.UTC(2025, 0, 1) + i * 172_800_000).toISOString(),
      total,
      status: pick(rand, STATUSES),
      items,
    };
  });
};
