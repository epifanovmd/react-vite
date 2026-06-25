import {
  AsyncButton,
  AsyncIconButton,
  Card,
  Empty,
  Spinner,
} from "@components/ui";
import { useNotification } from "@core/notifications";
import { useSessionsStore } from "@store";
import { LogOut, Monitor } from "lucide-react";
import { observer } from "mobx-react-lite";
import { FC, useEffect } from "react";

export const SessionsTab: FC = observer(() => {
  const store = useSessionsStore();
  const toast = useNotification();

  useEffect(() => {
    store.load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTerminate = async (id: string) => {
    const ok = await store.terminate(id);

    if (ok) toast.success("Сессия завершена");
    else toast.error("Не удалось завершить сессию");
  };

  const handleTerminateOthers = async () => {
    const ok = await store.terminateOthers();

    if (ok) toast.success("Остальные сессии завершены");
    else toast.error("Не удалось завершить сессии");
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
        title="Нет активных сессий"
        description="Активные сессии появятся здесь"
      />
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-end">
        <AsyncButton
          size="sm"
          variant="outline"
          onClick={handleTerminateOthers}
        >
          Завершить остальные
        </AsyncButton>
      </div>

      {store.models.map(session => (
        <Card key={session.id} className="p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                <Monitor size={16} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground">
                  {session.deviceLabel}
                </p>
                <p className="text-xs text-muted-foreground">
                  IP: {session.ip} · активна {session.lastActive}
                </p>
              </div>
            </div>
            <AsyncIconButton
              variant="destructive"
              title="Завершить"
              onClick={() => handleTerminate(session.id)}
            >
              <LogOut size={15} />
            </AsyncIconButton>
          </div>
        </Card>
      ))}
    </div>
  );
});
