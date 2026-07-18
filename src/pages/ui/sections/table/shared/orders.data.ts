import type { Order, OrderStatus } from "./order.types";

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
  "Muller",
  "Rossi",
  "Novak",
  "Costa",
  "Kim",
  "Reyes",
  "Petrov",
  "Hansen",
] as const;

const STATUSES: OrderStatus[] = ["paid", "pending", "failed", "refunded"];

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
      items: Math.floor(rand() * 12) + 1,
      createdAt: new Date(createdMs).toISOString(),
    };
  });
};

/** Deterministic mock dataset shared by every Table example. */
export const ORDERS: Order[] = generateOrders(47);
