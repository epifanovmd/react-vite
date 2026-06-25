import { AsyncIconButton, Card, Empty, Spinner } from "@components/ui";
import { useConfirm } from "@components/ui";
import { useNotification } from "@core/notifications";
import { useDevicesStore } from "@store";
import { Smartphone, Trash2 } from "lucide-react";
import { observer } from "mobx-react-lite";
import { FC, useEffect } from "react";

export const DevicesTab: FC = observer(() => {
  const store = useDevicesStore();
  const confirm = useConfirm();
  const toast = useNotification();

  useEffect(() => {
    store.load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRemove = async (deviceId: string, name: string) => {
    const ok = await confirm({
      title: "Удалить устройство",
      message: `Отозвать доступ для «${name}»?`,
      variant: "danger",
    });

    if (!ok) return;
    const removed = await store.remove(deviceId);

    if (removed) toast.success("Устройство удалено");
    else toast.error("Не удалось удалить устройство");
  };

  if (store.isLoading && store.models.length === 0) {
    return (
      <div className="flex justify-center py-10">
        <Spinner size="lg" />
      </div>
    );
  }

  if (store.models.length === 0) {
    return (
      <Empty
        icon="inbox"
        title="Нет привязанных устройств"
        description="Биометрические устройства появятся здесь после регистрации passkey"
      />
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {store.models.map(device => (
        <Card key={device.id} className="p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                <Smartphone size={16} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground">
                  {device.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  Добавлено {device.createdAt} · использовано {device.lastUsed}
                </p>
              </div>
            </div>
            <AsyncIconButton
              variant="destructive"
              title="Удалить"
              onClick={() => handleRemove(device.deviceId, device.name)}
            >
              <Trash2 size={15} />
            </AsyncIconButton>
          </div>
        </Card>
      ))}
    </div>
  );
});
