import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  type ColumnDef,
  Table,
} from "@components/ui";
import { FC } from "react";

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
        <Badge size="sm" variant={statusVariant[v]}>
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

export const TableSection: FC = () => (
  <Card>
    <CardHeader>
      <CardTitle className="text-base">Table</CardTitle>
      <CardDescription className="text-xs">
        TanStack Table — сортировка, выбор строк, пагинация
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <div>
        <p className="text-xs text-muted-foreground mb-2">
          Default + sorting + selection + pagination
        </p>
        <Table
          data={tableData}
          columns={tableColumns}
          size="sm"
          sorting
          selection
          onRowClick={row => console.log("clicked", row)}
          caption="Recent transactions"
        />
      </div>
      <div>
        <p className="text-xs text-muted-foreground mb-2">Striped variant</p>
        <Table
          data={tableData}
          columns={tableColumns}
          size="sm"
          variant="striped"
          sorting
        />
      </div>
      <div>
        <p className="text-xs text-muted-foreground mb-2">Loading state</p>
        <Table data={[]} columns={tableColumns} size="sm" loading />
      </div>
      <div>
        <p className="text-xs text-muted-foreground mb-2">Empty state</p>
        <Table data={[]} columns={tableColumns} size="sm" />
      </div>
    </CardContent>
  </Card>
);
