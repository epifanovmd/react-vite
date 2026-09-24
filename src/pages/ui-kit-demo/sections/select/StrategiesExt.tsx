import {
  Select,
  useAsyncOptions,
  useControlledOptions,
  useEagerOptions,
  useInfiniteOptions,
  useStaticOptions,
} from "@shared/ui";
import { type FC, useState } from "react";

import { DemoCard, DemoField, DemoRow } from "../shared";
import {
  ALL_USERS,
  CITIES,
  COUNTRIES,
  delay,
  FRUITS,
} from "./select-demo-data";

const COLORS = [
  { id: "red", name: "Red" },
  { id: "green", name: "Green" },
  { id: "blue", name: "Blue" },
  { id: "purple", name: "Purple" },
];

const fetchCountries = (query: string): Promise<string[]> =>
  delay(
    COUNTRIES.filter(c => c.toLowerCase().includes(query.toLowerCase())),
    700,
  );

const fetchCities = (): Promise<string[]> => delay(CITIES, 900);

const fetchUsersPage = (query: string, page: number): Promise<string[]> =>
  delay(
    ALL_USERS.filter(u => u.toLowerCase().includes(query.toLowerCase())).slice(
      page * 20,
      page * 20 + 20,
    ),
    600,
  );

export const StrategiesExt: FC = () => {
  const [vStatic, setVStatic] = useState<string>();
  const [vControlled, setVControlled] = useState<string>();
  const [vEager, setVEager] = useState<string>();
  const [vAsync, setVAsync] = useState<string>();
  const [vOnce, setVOnce] = useState<string>();
  const [vInfinite, setVInfinite] = useState<string>();

  // Extended strategy configs
  const [vFetchMount, setVFetchMount] = useState<string>();
  const [vMinQL, setVMinQL] = useState<string>();
  const staticSearch = useStaticOptions(FRUITS, { search: true });

  const controlled = useControlledOptions({
    data: COLORS,
    getOption: c => ({ value: c.id, label: c.name }),
    search: true,
  });

  const eager = useEagerOptions({
    fetch: () => fetchCities(),
    getOption: c => ({ value: c, label: c }),
    search: true,
  });

  const asyncSearch = useAsyncOptions({
    fetch: (query, _signal) => fetchCountries(query),
    getOption: c => ({ value: c, label: c }),
  });

  const asyncOnce = useAsyncOptions({
    fetch: (_query, _signal) => fetchCountries(""),
    getOption: c => ({ value: c, label: c }),
    loadOnce: true,
  });

  const infinite = useInfiniteOptions({
    fetchPage: (query, page) => fetchUsersPage(query, page),
    getOption: u => ({ value: u, label: u }),
    pageSize: 20,
  });

  // Extended: fetchOnMount
  const asyncFetchMount = useAsyncOptions({
    fetch: (query, _signal) => fetchCountries(query),
    getOption: c => ({ value: c, label: c }),
    fetchOnMount: true,
  });

  // Extended: minQueryLength
  const asyncMinQL = useAsyncOptions({
    fetch: (query, _signal) => fetchCountries(query),
    getOption: c => ({ value: c, label: c }),
    minQueryLength: 3,
  });

  return (
    <DemoCard
      title="Стратегии загрузки"
      description="Базовые и расширенные стратегии"
    >
      <div className="flex flex-col gap-4">
        <p className="text-xs text-muted-foreground font-medium">Базовые</p>
        <DemoRow columns={2}>
          <DemoField label="useStaticOptions — массив + клиентский поиск">
            <Select
              {...staticSearch}
              value={vStatic}
              onChange={setVStatic}
              placeholder="Static + search"
            />
          </DemoField>

          <DemoField label="useControlledOptions — свои данные + map">
            <Select
              {...controlled}
              value={vControlled}
              onChange={setVControlled}
              placeholder="Bring your own data"
            />
          </DemoField>
        </DemoRow>

        <DemoRow columns={2}>
          <DemoField label="useEagerOptions — загрузка всего один раз">
            <Select
              {...eager}
              value={vEager}
              onChange={setVEager}
              placeholder="Eager (on mount)"
            />
          </DemoField>

          <DemoField label="useAsyncOptions — серверный поиск on-open">
            <Select
              {...asyncSearch}
              value={vAsync}
              onChange={setVAsync}
              placeholder="Async (server search)"
            />
          </DemoField>
        </DemoRow>

        <DemoRow columns={2}>
          <DemoField label="useAsyncOptions + loadOnce + hideEmpty">
            <Select
              {...asyncOnce}
              value={vOnce}
              onChange={setVOnce}
              placeholder="Async (load once)"
              hideEmpty
            />
          </DemoField>

          <DemoField label="useInfiniteOptions — пагинация по скроллу">
            <Select
              {...infinite}
              value={vInfinite}
              onChange={setVInfinite}
              placeholder="Infinite scroll"
            />
          </DemoField>
        </DemoRow>

        <p className="text-xs text-muted-foreground font-medium mt-2">
          Расширенные
        </p>
        <DemoRow columns={2}>
          <DemoField label="useAsyncOptions + fetchOnMount — загрузка при монтировании">
            <Select
              {...asyncFetchMount}
              value={vFetchMount}
              onChange={setVFetchMount}
              placeholder="fetchOnMount (см. console)"
            />
          </DemoField>
          <DemoField label="useAsyncOptions + minQueryLength=3 — минимум 3 символа">
            <Select
              {...asyncMinQL}
              value={vMinQL}
              onChange={setVMinQL}
              placeholder="Введите минимум 3 символа"
            />
          </DemoField>
        </DemoRow>
      </div>
    </DemoCard>
  );
};
