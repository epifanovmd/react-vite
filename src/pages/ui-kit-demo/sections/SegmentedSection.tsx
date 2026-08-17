import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Segmented,
} from "@shared/ui";
import {
  AlignLeft,
  Calendar,
  Grid,
  Home,
  List,
  Settings,
  User,
} from "lucide-react";
import { FC, useState } from "react";

const periodOptions = [
  { label: "Day", value: "day" },
  { label: "Week", value: "week" },
  { label: "Month", value: "month" },
];

const monthOptions = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
].map(month => ({ label: month, value: month.toLowerCase() }));

export const SegmentedSection: FC = () => {
  const [view, setView] = useState("list");
  const [month, setMonth] = useState("aug");

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Варианты</CardTitle>
          <CardDescription className="text-xs">
            default, primary, secondary, outline
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-xs text-muted-foreground mb-2">Default</p>
            <Segmented defaultValue="day" size="sm" options={periodOptions} />
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-2">Primary</p>
            <Segmented
              defaultValue="week"
              size="sm"
              variant="primary"
              options={periodOptions}
            />
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-2">Secondary</p>
            <Segmented
              defaultValue="month"
              size="sm"
              variant="secondary"
              options={periodOptions}
            />
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-2">Outline</p>
            <Segmented
              defaultValue="day"
              size="sm"
              variant="outline"
              options={periodOptions}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Размеры</CardTitle>
          <CardDescription className="text-xs">sm, md, lg</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-xs text-muted-foreground mb-2">Small</p>
            <Segmented defaultValue="day" size="sm" options={periodOptions} />
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-2">Medium</p>
            <Segmented defaultValue="day" size="md" options={periodOptions} />
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-2">Large</p>
            <Segmented defaultValue="day" size="lg" options={periodOptions} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Иконки и состояния</CardTitle>
          <CardDescription className="text-xs">
            Опции с иконками, недоступные опции
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-xs text-muted-foreground mb-2">With icons</p>
            <Segmented
              defaultValue="home"
              size="md"
              variant="primary"
              options={[
                {
                  label: "Home",
                  value: "home",
                  icon: <Home className="h-4 w-4" />,
                },
                {
                  label: "User",
                  value: "user",
                  icon: <User className="h-4 w-4" />,
                },
                {
                  label: "Settings",
                  value: "settings",
                  icon: <Settings className="h-4 w-4" />,
                },
              ]}
            />
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-2">
              Disabled option
            </p>
            <Segmented
              defaultValue="day"
              size="sm"
              variant="secondary"
              options={[
                ...periodOptions,
                { label: "Year", value: "year", disabled: true },
              ]}
            />
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-2">Disabled</p>
            <Segmented
              defaultValue="week"
              size="sm"
              disabled
              options={periodOptions}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Управляемый режим</CardTitle>
          <CardDescription className="text-xs">
            Внешнее состояние и прокрутка при переполнении
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-xs text-muted-foreground mb-2">
              Controlled — выбрано: {view}
            </p>
            <Segmented
              value={view}
              onChange={setView}
              size="sm"
              options={[
                {
                  label: "List",
                  value: "list",
                  icon: <List className="h-3.5 w-3.5" />,
                },
                {
                  label: "Grid",
                  value: "grid",
                  icon: <Grid className="h-3.5 w-3.5" />,
                },
                {
                  label: "Compact",
                  value: "compact",
                  icon: <AlignLeft className="h-3.5 w-3.5" />,
                },
              ]}
            />
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-2">
              <Calendar className="mr-1 inline h-3.5 w-3.5" />
              Много опций — активная прокручивается в центр
            </p>
            <Segmented
              value={month}
              onChange={setMonth}
              size="sm"
              variant="outline"
              options={monthOptions}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
