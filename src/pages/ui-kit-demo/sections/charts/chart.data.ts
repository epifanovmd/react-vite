import { startOfDay, subDays, subMonths } from "date-fns";

export interface TrafficPoint {
  date: Date;
  visits: number;
  signups: number;
  orders: number;
}

export interface RevenuePoint {
  month: Date;
  subscriptions: number;
  services: number;
  ads: number;
}

export interface ChannelPoint {
  channel: string;
  mobile: number;
  desktop: number;
}

/** Линейный конгруэнтный генератор: демо-данные не должны прыгать на каждый рендер. */
const createRandom = (seed: number) => {
  let state = seed;

  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;

    return state / 4294967296;
  };
};

const today = startOfDay(new Date());

const trafficRandom = createRandom(2026);

export const TRAFFIC: TrafficPoint[] = Array.from(
  { length: 30 },
  (_, index) => {
    const wave = Math.sin(index / 4.5) * 0.18;
    const visits = Math.round(
      3800 * (1 + wave + trafficRandom() * 0.22) + index * 55,
    );
    const signups = Math.round(visits * (0.07 + trafficRandom() * 0.03));

    return {
      date: subDays(today, 29 - index),
      visits,
      signups,
      orders: Math.round(signups * (0.32 + trafficRandom() * 0.18)),
    };
  },
);

const revenueRandom = createRandom(77);

export const REVENUE: RevenuePoint[] = Array.from(
  { length: 12 },
  (_, index) => ({
    month: subMonths(today, 11 - index),
    subscriptions: Math.round(
      920000 + index * 48000 + revenueRandom() * 160000,
    ),
    services: Math.round(380000 + index * 12000 + revenueRandom() * 120000),
    ads: Math.round(150000 + revenueRandom() * 90000),
  }),
);

export const CHANNELS: ChannelPoint[] = [
  { channel: "Поиск", mobile: 4120, desktop: 3280 },
  { channel: "Реклама", mobile: 2870, desktop: 1640 },
  { channel: "Соцсети", mobile: 3310, desktop: 780 },
  { channel: "Почта", mobile: 940, desktop: 1520 },
  { channel: "Рефералы", mobile: 610, desktop: 890 },
  { channel: "Прямые", mobile: 1480, desktop: 2050 },
];

/** Скользящее среднее за 7 точек — вторая серия combo-графика на той же шкале. */
export const movingAverage = (values: number[], window: number): number[] =>
  values.map((_, index) => {
    const slice = values.slice(Math.max(0, index - window + 1), index + 1);

    return Math.round(
      slice.reduce((sum, value) => sum + value, 0) / slice.length,
    );
  });
