import { UserAvatar } from "@entities/user";
import { IconButton } from "@shared/ui";
import { Camera, Trash2 } from "lucide-react";
import { observer } from "mobx-react-lite";
import { ChangeEvent, FC, useRef } from "react";

import { useChangeAvatar } from "../model/useChangeAvatar";

/** Аватар профиля с загрузкой нового изображения и удалением. */
export const ChangeAvatar: FC = observer(() => {
  const { avatarUrl, name, isBusy, upload, remove } = useChangeAvatar();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    // Сброс, чтобы повторный выбор того же файла снова вызвал change.
    event.target.value = "";
    if (file) upload(file).then();
  };

  return (
    <div className="relative shrink-0">
      <UserAvatar name={name} src={avatarUrl} size="xl" />
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        className="hidden"
        onChange={handleFile}
      />
      <div className="absolute -bottom-1 -right-1 flex gap-1">
        <IconButton
          size="xs"
          variant="solid"
          aria-label="Загрузить аватар"
          loading={isBusy}
          onClick={() => inputRef.current?.click()}
        >
          <Camera size={13} />
        </IconButton>
        {avatarUrl && !isBusy && (
          <IconButton
            size="xs"
            variant="default"
            className="rounded-full border border-border bg-card shadow-sm"
            aria-label="Удалить аватар"
            onClick={() => remove()}
          >
            <Trash2 size={13} />
          </IconButton>
        )}
      </div>
    </div>
  );
});
