import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  type ColumnDef,
  Table,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  usePaginationFeature,
  useRowSelectionFeature,
  useSortingFeature,
} from "@components/ui";
import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";

type Transaction = {
  id: string;
  name: string;
  email: string;
  status: "paid" | "pending" | "failed";
  amount: number;
  date: string;
};

const statusVariant: Record<
  Transaction["status"],
  "success" | "warning" | "destructive"
> = {
  paid: "success",
  pending: "warning",
  failed: "destructive",
};

const tableData: Transaction[] = [
  {
    id: "001",
    name: "John Doe",
    email: "john@example.com",
    status: "paid",
    amount: 250,
    date: "2024-01-15",
  },
  {
    id: "002",
    name: "Jane Smith",
    email: "jane@example.com",
    status: "pending",
    amount: 150,
    date: "2024-01-16",
  },
  {
    id: "003",
    name: "Bob Johnson",
    email: "bob@example.com",
    status: "failed",
    amount: 350,
    date: "2024-01-17",
  },
  {
    id: "004",
    name: "Alice Brown",
    email: "alice@example.com",
    status: "paid",
    amount: 420,
    date: "2024-01-18",
  },
  {
    id: "005",
    name: "Charlie Wilson",
    email: "charlie@example.com",
    status: "paid",
    amount: 180,
    date: "2024-01-19",
  },
  {
    id: "006",
    name: "Diana Prince",
    email: "diana@example.com",
    status: "pending",
    amount: 560,
    date: "2024-01-20",
  },
  {
    id: "007",
    name: "Edward Norton",
    email: "edward@example.com",
    status: "failed",
    amount: 90,
    date: "2024-01-21",
  },
  {
    id: "008",
    name: "Fiona Green",
    email: "fiona@example.com",
    status: "paid",
    amount: 730,
    date: "2024-01-22",
  },
];

const INFINITE_PAGE_SIZE = 20;
const INFINITE_TOTAL = 140;

const infiniteStatuses: Transaction["status"][] = ["paid", "pending", "failed"];

const allInfiniteTransactions: Transaction[] = Array.from(
  { length: INFINITE_TOTAL },
  (_, i) => ({
    id: String(i + 1).padStart(3, "0"),
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    status: infiniteStatuses[i % infiniteStatuses.length],
    amount: 50 + ((i * 37) % 950),
    date: "2024-01-01",
  }),
);

const tableColumns: ColumnDef<Transaction>[] = [
  { accessorKey: "id", header: "ID", size: 60 },
  { accessorKey: "name", header: "Name" },
  { accessorKey: "email", header: "Email" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ getValue }) => {
      const v = getValue<Transaction["status"]>();

      return (
        <Badge variant={statusVariant[v]}>
          {v}
        </Badge>
      );
    },
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ getValue }) => `$${getValue<number>().toFixed(2)}`,
  },
  { accessorKey: "date", header: "Date" },
];

export const TableSection: FC = () => {
  const sorting = useSortingFeature<Transaction>();
  const selection = useRowSelectionFeature<Transaction>();
  const defaultFeatures = useMemo(
    () => [sorting, selection],
    [sorting, selection],
  );

  const stripedSorting = useSortingFeature<Transaction>();
  const stripedFeatures = useMemo(() => [stripedSorting], [stripedSorting]);

  const [loadedCount, setLoadedCount] = useState(INFINITE_PAGE_SIZE);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);
  const loadMoreTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const infiniteData = useMemo(
    () => allInfiniteTransactions.slice(0, loadedCount),
    [loadedCount],
  );
  const hasNextPage = loadedCount < allInfiniteTransactions.length;

  const handleLoadMore = useCallback(() => {
    setIsFetchingNextPage(true);
    loadMoreTimeoutRef.current = setTimeout(() => {
      setLoadedCount(count =>
        Math.min(count + INFINITE_PAGE_SIZE, allInfiniteTransactions.length),
      );
      setIsFetchingNextPage(false);
    }, 800);
  }, []);

  const infinitePagination = usePaginationFeature<Transaction>({
    hasNextPage,
    isFetchingNextPage,
    onLoadMore: handleLoadMore,
  });
  const infiniteFeatures = useMemo(
    () => [infinitePagination],
    [infinitePagination],
  );

  useEffect(() => () => clearTimeout(loadMoreTimeoutRef.current), []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Table</CardTitle>
        <CardDescription className="text-xs">
          TanStack Table — сортировка, выбор строк, пагинация
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="default">
          <TabsList variant="underline" size="sm">
            <TabsTrigger value="default" variant="underline" size="sm">
              Default
            </TabsTrigger>
            <TabsTrigger value="striped" variant="underline" size="sm">
              Striped
            </TabsTrigger>
            <TabsTrigger value="infinite" variant="underline" size="sm">
              Бесконечная прокрутка
            </TabsTrigger>
            <TabsTrigger value="loading" variant="underline" size="sm">
              Loading
            </TabsTrigger>
            <TabsTrigger value="empty" variant="underline" size="sm">
              Empty
            </TabsTrigger>
          </TabsList>

          <TabsContent value="default" className="pt-3">
            <p className="text-xs text-muted-foreground mb-2">
              Default + sorting + selection + pagination
            </p>
            <Table
              data={tableData}
              columns={tableColumns}
              size="sm"
              features={defaultFeatures}
              onRowClick={row => console.log("clicked", row)}
            />
          </TabsContent>

          <TabsContent value="striped" className="pt-3">
            <p className="text-xs text-muted-foreground mb-2">
              Striped variant
            </p>
            <Table
              data={tableData}
              columns={tableColumns}
              size="sm"
              variant="striped"
              features={stripedFeatures}
            />
          </TabsContent>

          <TabsContent value="infinite" className="pt-3">
            <p className="text-xs text-muted-foreground mb-2">
              Infinite scroll ({infiniteData.length}/
              {allInfiniteTransactions.length} loaded)
            </p>
            <Table
              data={infiniteData}
              columns={tableColumns}
              size="sm"
              features={infiniteFeatures}
              containerClassName="max-h-64"
            />
          </TabsContent>

          <TabsContent value="loading" className="pt-3">
            <p className="text-xs text-muted-foreground mb-2">
              Loading state
            </p>
            <Table data={[]} columns={tableColumns} size="sm" loading />
          </TabsContent>

          <TabsContent value="empty" className="pt-3">
            <p className="text-xs text-muted-foreground mb-2">Empty state</p>
            <Table data={[]} columns={tableColumns} size="sm" />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
