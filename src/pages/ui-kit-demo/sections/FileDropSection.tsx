import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  FileDrop,
} from "@shared/ui";
import { useState } from "react";

const formatSize = (bytes: number) =>
  bytes > 1024 * 1024
    ? `${(bytes / 1024 / 1024).toFixed(1)} МБ`
    : `${Math.max(1, Math.round(bytes / 1024))} КБ`;

export const FileDropSection = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [rejected, setRejected] = useState<File[]>([]);

  const handleFiles = (accepted: File[]) => {
    setFiles(accepted);
    setRejected([]);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">FileDrop</CardTitle>
        <CardDescription className="text-xs">
          Перетаскивание файлов; клик открывает системный диалог. accept
          применяется и к перетащенным файлам — отклонённые уходят в onReject
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FileDrop
          onFiles={handleFiles}
          onReject={setRejected}
          accept="image/*"
          hint="только изображения"
        />

        {files.length > 0 && (
          <ul className="space-y-1 text-xs text-muted-foreground">
            {files.slice(0, 5).map(file => (
              <li key={file.name} className="flex justify-between gap-3">
                <span className="truncate">{file.name}</span>
                <span className="shrink-0 font-mono">
                  {formatSize(file.size)}
                </span>
              </li>
            ))}
            {files.length > 5 && <li>…и ещё {files.length - 5}</li>}
          </ul>
        )}

        {rejected.length > 0 && (
          <p className="text-xs text-destructive">
            Отклонено: {rejected.map(file => file.name).join(", ")}
          </p>
        )}

        <div className="grid gap-3 sm:grid-cols-2">
          <FileDrop
            onFiles={handleFiles}
            directory
            title="Папка целиком"
            hint="пути файлов придут в webkitRelativePath"
          />
          <FileDrop
            onFiles={handleFiles}
            disabled
            title="Недоступно"
            hint="disabled"
          />
        </div>
      </CardContent>
    </Card>
  );
};
