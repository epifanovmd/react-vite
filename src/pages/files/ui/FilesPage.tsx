import { FileUploader } from "@features/upload-file";
import type { EFileStatus, IFileDto } from "@shared/api/gen/main/model";
import { formatBytes, formatter } from "@shared/lib/utils";
import {
  Badge,
  type BadgeProps,
  Card,
  createColumnHelper,
  Empty,
  IconButton,
  PageHeader,
  PageLayout,
  Pagination,
  Table,
} from "@shared/ui";
import { Download, ExternalLink, File, Trash2 } from "lucide-react";
import { observer } from "mobx-react-lite";
import { FC, useMemo } from "react";

import { useFilesVM } from "../model/useFilesVM";

const STATUS: Record<
  EFileStatus,
  { label: string; variant: NonNullable<BadgeProps["variant"]> }
> = {
  pending: { label: "ожидает", variant: "muted" },
  processing: { label: "обработка", variant: "info" },
  ready: { label: "готов", variant: "success" },
  failed: { label: "ошибка", variant: "destructive" },
};

const column = createColumnHelper<IFileDto>();

const createColumns = (onDelete: (file: IFileDto) => void) => [
  column.accessor("name", {
    header: "Файл",
    cell: ({ row }) => {
      const file = row.original;

      return (
        <div className="flex min-w-0 items-center gap-3">
          {file.thumbnailUrl ? (
            <img
              src={file.thumbnailUrl}
              alt=""
              className="h-9 w-9 shrink-0 rounded-md object-cover"
            />
          ) : (
            <File
              size={20}
              aria-hidden
              className="shrink-0 text-muted-foreground"
            />
          )}
          <span className="truncate font-medium">{file.name}</span>
        </div>
      );
    },
  }),
  column.accessor("size", {
    header: "Размер",
    size: 110,
    cell: ({ getValue }) => formatBytes(getValue()),
  }),
  column.accessor("status", {
    header: "Статус",
    size: 120,
    cell: ({ getValue }) => (
      <Badge variant={STATUS[getValue()].variant}>
        {STATUS[getValue()].label}
      </Badge>
    ),
  }),
  column.accessor("createdAt", {
    header: "Загружен",
    size: 190,
    cell: ({ getValue }) => (
      <span className="whitespace-nowrap text-muted-foreground">
        {formatter.date.format(getValue())}
      </span>
    ),
  }),
  column.display({
    id: "actions",
    size: 130,
    meta: { align: "right" },
    cell: ({ row }) => {
      const file = row.original;

      return (
        <div className="flex justify-end gap-1">
          {file.url && (
            <IconButton
              aria-label="Открыть"
              onClick={() => window.open(file.url!, "_blank", "noopener")}
            >
              <ExternalLink size={15} />
            </IconButton>
          )}
          {file.downloadUrl && (
            <IconButton
              aria-label="Скачать"
              onClick={() => window.location.assign(file.downloadUrl!)}
            >
              <Download size={15} />
            </IconButton>
          )}
          <IconButton
            aria-label="Удалить"
            variant="destructive"
            onClick={() => onDelete(file)}
          >
            <Trash2 size={15} />
          </IconButton>
        </div>
      );
    },
  }),
];

const header = (
  <PageHeader title="Мои файлы" subtitle="Загруженные файлы и их статус" />
);

export const FilesPage: FC = observer(() => {
  const { files, remove, onUploaded } = useFilesVM();
  const columns = useMemo(() => createColumns(remove), [remove]);

  return (
    <PageLayout header={header}>
      <Card title="Загрузка">
        <FileUploader onUploaded={onUploaded} />
      </Card>
      <Table
        className="flex-none"
        data={files.items}
        columns={columns}
        loading={files.isLoading}
        refreshing={files.isRefreshing}
        error={
          files.error ? (
            <Empty size="sm" icon="error" title={files.error.message} />
          ) : undefined
        }
        labels={{ empty: "Файлов пока нет" }}
        getRowId={f => f.id}
        aria-label="Мои файлы"
      />
      {files.pageCount > 1 && (
        <Pagination
          className="self-center"
          currentPage={files.pagination.page}
          totalPages={files.pageCount}
          disabled={files.isBusy}
          onPageChange={page => files.goToPage(page).then()}
        />
      )}
    </PageLayout>
  );
});
