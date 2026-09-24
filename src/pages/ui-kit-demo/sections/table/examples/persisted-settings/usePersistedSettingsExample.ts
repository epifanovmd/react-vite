import { createLocalStorageTableSettings, useTableSettings } from "@shared/ui";
import { useMemo } from "react";

import { createOrderColumns, type Order, ORDERS } from "../../shared";

const storage = createLocalStorageTableSettings("ui-kit-demo:orders-table");

/** Настройки колонок переживают перезагрузку страницы: хранилище — localStorage. */
export const usePersistedSettingsExample = () => {
  const columns = useMemo(() => createOrderColumns(), []);
  const data = useMemo(() => ORDERS.slice(0, 8), []);

  const { features, settings, reset } = useTableSettings<Order>({
    defaultValue: storage.load,
    onChange: storage.save,
  });

  return { data, columns, features, settings, reset };
};
