import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  FileDrop,
  FileDropList,
  type FileDropListItemData,
  type FileRejection,
  type FileRejectionReason,
  formatFileSize,
  useFileList,
} from "@shared/ui";
import { useCallback, useEffect, useRef, useState } from "react";

const MAX_SIZE = 2 * 1024 * 1024;
const MAX_FILES = 5;
const UPLOAD_STEP = 0.1;
const UPLOAD_TICK_MS = 250;
/** Каждый четвёртый файл «падает» на сервере — чтобы показать ошибку. */
const FAIL_EVERY = 4;

const REASON_TEXT: Record<FileRejectionReason, string> = {
  type: "неподходящий тип",
  size: `больше ${formatFileSize(MAX_SIZE)}`,
  count: `не больше ${MAX_FILES} файлов`,
};

/** Имитация загрузки: прогресс по таймеру, таймеры гасятся при удалении и размонтировании. */
const useFakeUpload = () => {
  const list = useFileList({ maxFiles: MAX_FILES });
  const timers = useRef(new Map<string, ReturnType<typeof setInterval>>());
  const uploaded = useRef(0);
  const { add, update, remove } = list;

  const stop = useCallback((id: string) => {
    clearInterval(timers.current.get(id));
    timers.current.delete(id);
  }, []);

  const start = useCallback(
    (item: FileDropListItemData) => {
      uploaded.current += 1;

      const fails = uploaded.current % FAIL_EVERY === 0;
      let progress = 0;

      const timer = setInterval(() => {
        progress = Math.min(1, progress + UPLOAD_STEP);

        if (fails && progress >= 0.6) {
          stop(item.id);
          update(item.id, { error: "Сервер отклонил файл" });

          return;
        }

        update(item.id, { progress });
        if (progress >= 1) stop(item.id);
      }, UPLOAD_TICK_MS);

      timers.current.set(item.id, timer);
      update(item.id, { progress: 0 });
    },
    [stop, update],
  );

  const addFiles = useCallback(
    (files: File[]) => add(files).forEach(start),
    [add, start],
  );

  const removeItem = useCallback(
    (item: FileDropListItemData) => {
      stop(item.id);
      remove(item.id);
    },
    [remove, stop],
  );

  useEffect(() => {
    const active = timers.current;

    return () => active.forEach(timer => clearInterval(timer));
  }, []);

  return { ...list, addFiles, removeItem };
};

export const FileDropSection = () => {
  const { items, remaining, addFiles, removeItem } = useFakeUpload();
  const [rejections, setRejections] = useState<FileRejection[]>([]);
  const [lastPicked, setLastPicked] = useState<File[]>([]);

  const handleFiles = (files: File[]) => {
    setRejections([]);
    addFiles(files);
  };

  const handleReject = (_files: File[], reasons: FileRejection[]) =>
    setRejections(reasons);

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">FileDrop + FileDropList</CardTitle>
          <CardDescription className="text-xs">
            Проверка maxSize/maxFiles/accept с причинами отказа, список
            выбранных файлов с превью изображений, прогрессом и ошибкой;
            состояние списка — useFileList
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FileDrop
            onFiles={handleFiles}
            onReject={handleReject}
            accept="image/*,.pdf,.txt"
            maxSize={MAX_SIZE}
            maxFiles={remaining}
            disabled={remaining === 0}
            hint={`изображения, PDF и TXT до ${formatFileSize(MAX_SIZE)}, осталось мест: ${remaining}`}
          />

          {rejections.length > 0 && (
            <ul role="alert" className="space-y-1 text-xs text-destructive">
              {rejections.map(({ file, reason }) => (
                <li key={`${file.name}-${reason}`}>
                  {file.name}: {REASON_TEXT[reason]}
                </li>
              ))}
            </ul>
          )}

          <FileDropList items={items} onRemove={removeItem} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Варианты</CardTitle>
          <CardDescription className="text-xs">
            Выбор папки целиком и недоступное состояние
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <FileDrop
              onFiles={setLastPicked}
              directory
              title="Папка целиком"
              hint="пути файлов придут в webkitRelativePath"
            />
            <FileDrop
              onFiles={setLastPicked}
              disabled
              title="Недоступно"
              hint="disabled"
            />
          </div>

          {lastPicked.length > 0 && (
            <p className="text-xs text-muted-foreground">
              Выбрано файлов в папке: {lastPicked.length}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
