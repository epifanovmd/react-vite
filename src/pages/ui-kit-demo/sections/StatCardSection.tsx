import { INotificationService } from "@shared/lib/notifications";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  StatCard,
} from "@shared/ui";
import { AlertTriangle, Clock, TrendingUp, Users } from "lucide-react";

export const StatCardSection = () => {
  const toast = INotificationService.useInstance();

  const openUsers = () => toast.info("Переход к списку пользователей");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">StatCard</CardTitle>
        <CardDescription className="text-xs">
          Карточка показателя на базе Card: variant красит значок, HTML-атрибуты
          и onClick прокидываются
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Пользователи"
            value="1 284"
            description="+12 % за месяц"
            icon={<Users size={18} />}
            variant="info"
            role="button"
            tabIndex={0}
            onClick={openUsers}
            className="cursor-pointer hover:shadow-md"
          />
          <StatCard
            title="Выручка"
            value="₽ 2,4 млн"
            description="план выполнен на 96 %"
            icon={<TrendingUp size={18} />}
            variant="success"
          />
          <StatCard
            title="Ожидают"
            value={0}
            description="заявок в очереди"
            icon={<Clock size={18} />}
            variant="warning"
          />
          <StatCard
            title="Инциденты"
            value={3}
            description="за последние сутки"
            icon={<AlertTriangle size={18} />}
            variant="destructive"
          />
        </div>
      </CardContent>
    </Card>
  );
};
