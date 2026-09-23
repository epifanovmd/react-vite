import { cn } from "@shared/lib/utils/cn";
import { UploadCloud } from "lucide-react";
import * as React from "react";

export interface FileDropProps {
  onFiles: (files: File[]) => void;
  /** Значение атрибута `accept` у input. */
  accept?: string;
  multiple?: boolean;
  /** Выбор папки целиком (Chromium/WebKit); пути файлов — в `webkitRelativePath`. */
  directory?: boolean;
  disabled?: boolean;
  title?: React.ReactNode;
  hint?: React.ReactNode;
  className?: string;
}

const collect = (list: FileList | null): File[] =>
  list ? Array.from(list) : [];

/** Область для перетаскивания файлов; клик открывает системный диалог. */
export const FileDrop: React.FC<FileDropProps> = ({
  onFiles,
  accept,
  multiple = true,
  directory,
  disabled,
  title = "Перетащите файлы сюда",
  hint = "или нажмите, чтобы выбрать",
  className,
}) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [isOver, setOver] = React.useState(false);

  const open = () => {
    if (!disabled) inputRef.current?.click();
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setOver(false);

    if (disabled) return;

    const files = collect(e.dataTransfer.files);

    if (files.length) onFiles(multiple ? files : files.slice(0, 1));
  };

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      onClick={open}
      onKeyDown={e => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          open();
        }
      }}
      onDragOver={e => {
        e.preventDefault();
        if (!disabled) setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={onDrop}
      className={cn(
        "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-muted/30 px-4 py-8 text-center transition-colors",
        "hover:border-brand/60 hover:bg-brand/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40",
        isOver && "border-brand bg-brand/10",
        disabled &&
          "cursor-not-allowed opacity-60 hover:border-border hover:bg-muted/30",
        className,
      )}
    >
      <UploadCloud className="text-muted-foreground" size={28} />
      <p className="text-sm font-medium text-foreground">{title}</p>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      <input
        ref={inputRef}
        type="file"
        className="sr-only"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        // Нестандартный атрибут выбора папки; React знает его как webkitdirectory.
        {...(directory ? { webkitdirectory: "" } : {})}
        onChange={e => {
          const files = collect(e.target.files);

          e.target.value = "";
          if (files.length) onFiles(files);
        }}
      />
    </div>
  );
};
