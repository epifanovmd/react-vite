import { type IHolderError, usePaged } from "@store/holders";
import type {
  ColumnFiltersState,
  OnChangeFn,
  RowSelectionState,
  SortingState,
} from "@tanstack/react-table";
import { useCallback, useEffect, useMemo, useState } from "react";

import { fetchOrders } from "./table.mock";
import type {
  Order,
  OrderQuery,
  OrderSortField,
  OrderStatus,
} from "./table.types";

const DEFAULT_PAGE_SIZE = 10;

const SEARCH_DEBOUNCE_MS = 300;

/** Поля, по которым сервер умеет сортировать (совпадает с OrderSortField). */
const SORTABLE_FIELDS: readonly OrderSortField[] = [
  "customer",
  "amount",
  "items",
  "createdAt",
];

/**
 * Перевод состояния сортировки TanStack в серверные параметры.
 * Возвращает пустой объект, если активной сортировки нет или колонка
 * не поддерживает серверную сортировку.
 */
const toServerSort = (
  sorting: SortingState,
): Pick<OrderQuery, "sortBy" | "sortDir"> => {
  const first = sorting[0];

  if (!first) return {};

  const sortBy = first.id as OrderSortField;

  if (!SORTABLE_FIELDS.includes(sortBy)) return {};

  return { sortBy, sortDir: first.desc ? "desc" : "asc" };
};

/**
 * Перевод пер-колоночных фильтров TanStack в серверные параметры OrderQuery.
 * Идентификаторы фильтров совпадают с accessorKey колонок (customer, status).
 */
const toServerFilters = (
  columnFilters: ColumnFiltersState,
): Pick<OrderQuery, "customer" | "statuses"> => {
  const byId = Object.fromEntries(columnFilters.map(f => [f.id, f.value]));

  const customer =
    typeof byId.customer === "string" && byId.customer.trim()
      ? byId.customer.trim()
      : undefined;

  const statusesValue = byId.status as OrderStatus[] | undefined;

  const statuses =
    statusesValue && statusesValue.length > 0 ? statusesValue : undefined;

  return { customer, statuses };
};

/**
 * View-model таблицы заказов.
 *
 * Оркестрирует серверную пагинацию (usePaged), дебаунс поиска, ручную
 * (серверную) сортировку, выбор строк и детализацию. Возвращает
 * неизменный контракт `TableDemoViewModel` — страница зависит от этой
 * абстракции, а не от внутренних деталей holder'а (Dependency Inversion).
 */
export interface TableDemoViewModel {
  /** Заказы текущей страницы. */
  orders: Order[];

  isLoading: boolean;

  isRefreshing: boolean;

  isBusy: boolean;

  isError: boolean;

  error: IHolderError | null;

  /** Общее количество заказов на сервере (с учётом фильтра). */
  totalCount: number;

  pageCount: number;

  currentPage: number;

  pageSize: number;

  goToPage: (page: number) => void;

  setPageSize: (size: number) => void;

  reload: () => void;

  /** Поле ввода поиска (немедленное). */
  searchInput: string;

  /** Дебаунсированный поисковый запрос, активный на сервере. */
  search: string;

  onSearchInputChange: (value: string) => void;

  onClearSearch: () => void;

  onGlobalFilterChange: OnChangeFn<string>;

  /** Состояние сортировки TanStack (manual — обрабатывается на сервере). */
  sorting: SortingState;

  onSortingChange: OnChangeFn<SortingState>;

  /** Выбор строк. */
  rowSelection: RowSelectionState;

  onRowSelectionChange: OnChangeFn<RowSelectionState>;

  /** Пер-колоночные фильтры (controlled) — отправляются на сервер. */
  columnFilters: ColumnFiltersState;

  onColumnFiltersChange: OnChangeFn<ColumnFiltersState>;

  /** Колбэк изменения выбранных строк (current page) — драйвит selectedOrders. */
  onSelectedRowsChange: (rows: Order[]) => void;

  /** Выбранные строки текущей страницы (для bulk-действий). */
  selectedOrders: Order[];

  clearSelection: () => void;

  removeSelected: () => void;

  /** Детализация строки (drawer). */
  activeOrder: Order | null;

  onRowClick: (order: Order) => void;

  openDetails: (order: Order) => void;

  closeDetails: () => void;

  /** Стабильный идентификатор строки для TanStack. */
  getRowId: (order: Order) => string;
}

export const useTableDemo = (): TableDemoViewModel => {
  const [searchInput, setSearchInput] = useState("");

  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [sorting, setSorting] = useState<SortingState>([]);

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const [selectedOrders, setSelectedOrders] = useState<Order[]>([]);

  const [activeOrder, setActiveOrder] = useState<Order | null>(null);

  // Дебаунс поиска: серверный запрос уходит не на каждый символ.
  useEffect(() => {
    const timer = setTimeout(
      () => setDebouncedSearch(searchInput.trim()),
      SEARCH_DEBOUNCE_MS,
    );

    return () => clearTimeout(timer);
  }, [searchInput]);

  // `query` стабилен по ссылке между рендерами, пока не изменятся
  // его примитивные составляющие — поэтому watch в usePaged рефечитит
  // только при реальном изменении аргументов.
  const query = useMemo<OrderQuery>(
    () => ({
      search: debouncedSearch,
      ...toServerSort(sorting),
      ...toServerFilters(columnFilters),
    }),
    [debouncedSearch, sorting, columnFilters],
  );

  const {
    items: orders,
    isLoading,
    isRefreshing,
    isBusy,
    isError,
    error,
    pagination,
    pageCount,
    goToPage,
    setPageSize,
    reload,
    removeItem,
  } = usePaged<Order, OrderQuery>({
    queryFn: fetchOrders,
    pageSize: DEFAULT_PAGE_SIZE,
    keyExtractor: order => order.id,
    watch: [query],
  });

  const handlePageSizeChange = useCallback(
    (size: number) => {
      // setPageSize сбрасывает на 1-ю страницу, но не делает запрос —
      // поэтому перезапрашиваем вручную с новым размером.
      setPageSize(size);

      reload();
    },
    [setPageSize, reload],
  );

  // Фоновое обновление: `refresh: true` переводит holder в isRefreshing
  // (таблица остаётся видимой с opacity) вместо полной загрузки-спиннера.
  const refresh = useCallback(() => {
    void reload({ refresh: true });
  }, [reload]);

  const onRowSelectionChange = useCallback<OnChangeFn<RowSelectionState>>(
    updater => {
      setRowSelection(prev =>
        typeof updater === "function" ? updater(prev) : updater,
      );
    },
    [],
  );

  const onColumnFiltersChange = useCallback<OnChangeFn<ColumnFiltersState>>(
    updater => {
      setColumnFilters(prev =>
        typeof updater === "function" ? updater(prev) : updater,
      );
    },
    [],
  );

  const onSelectedRowsChange = useCallback((rows: Order[]) => {
    setSelectedOrders(rows);
  }, []);

  const clearSelection = useCallback(() => {
    setRowSelection({});

    setSelectedOrders([]);
  }, []);

  const removeSelected = useCallback(() => {
    if (selectedOrders.length === 0) return;

    const ids = new Set(selectedOrders.map(order => order.id));

    // Оптимистичное удаление выбранных строк текущей страницы.
    removeItem(order => ids.has(order.id));

    setRowSelection({});

    setSelectedOrders([]);
  }, [selectedOrders, removeItem]);

  const onSearchInputChange = useCallback((value: string) => {
    setSearchInput(value);
  }, []);

  const onClearSearch = useCallback(() => {
    setSearchInput("");
  }, []);

  // globalFilter синхронизирован с дебаунсированным поиском — клиентский
  // фильтр согласован с серверным (no-op поверх уже отфильтрованной страницы).
  const onGlobalFilterChange = useCallback<OnChangeFn<string>>(
    updater => {
      const next =
        typeof updater === "function"
          ? (updater as (prev: string) => string)(debouncedSearch)
          : updater;

      setSearchInput(next);
    },
    [debouncedSearch],
  );

  const onRowClick = useCallback((order: Order) => {
    setActiveOrder(order);
  }, []);

  const openDetails = useCallback((order: Order) => {
    setActiveOrder(order);
  }, []);

  const closeDetails = useCallback(() => {
    setActiveOrder(null);
  }, []);

  const getRowId = useCallback((order: Order) => order.id, []);

  return {
    orders,
    isLoading,
    isRefreshing,
    isBusy,
    isError,
    error,
    totalCount: pagination.totalCount,
    pageCount,
    currentPage: pagination.page,
    pageSize: pagination.pageSize,
    goToPage,
    setPageSize: handlePageSizeChange,
    reload: refresh,
    searchInput,
    search: debouncedSearch,
    onSearchInputChange,
    onClearSearch,
    onGlobalFilterChange,
    sorting,
    onSortingChange: setSorting,
    rowSelection,
    onRowSelectionChange,
    columnFilters,
    onColumnFiltersChange,
    onSelectedRowsChange,
    selectedOrders,
    clearSelection,
    removeSelected,
    activeOrder,
    onRowClick,
    openDetails,
    closeDetails,
    getRowId,
  };
};
