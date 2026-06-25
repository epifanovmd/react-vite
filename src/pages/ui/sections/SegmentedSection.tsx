import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Segmented,
} from "@components/ui";
import { Calendar, Grid, Home, List, Settings, User } from "lucide-react";
import { FC, useState } from "react";

export const SegmentedSection: FC = () => {
  const [segmentedValue, setSegmentedValue] = useState("list");
  const [segmentedNav, setSegmentedNav] = useState("home");

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Segmented</CardTitle>
          <CardDescription className="text-xs">
            Сегментированные кнопки
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-xs text-muted-foreground mb-2">
              Default variant
            </p>
            <Segmented
              value={segmentedValue}
              onChange={setSegmentedValue}
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
              ]}
            />
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-2">
              Primary variant
            </p>
            <Segmented
              value={segmentedNav}
              onChange={setSegmentedNav}
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
              With disabled option
            </p>
            <Segmented
              defaultValue="day"
              size="sm"
              variant="secondary"
              options={[
                { label: "Day", value: "day" },
                { label: "Week", value: "week" },
                { label: "Month", value: "month" },
                { label: "Year", value: "year", disabled: true },
              ]}
            />
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-2">
              Outline variant
            </p>
            <Segmented
              defaultValue="option1"
              size="sm"
              variant="outline"
              options={[
                { label: "Option 1", value: "option1" },
                { label: "Option 2", value: "option2" },
                { label: "Option 3", value: "option3" },
              ]}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Segmented Block</CardTitle>
          <CardDescription className="text-xs">
            Полноразмерные варианты
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Segmented
            defaultValue="all"
            size="md"
            options={[
              { label: "All", value: "all" },
              { label: "Active", value: "active" },
              { label: "Inactive", value: "inactive" },
            ]}
          />
          <Segmented
            defaultValue="tab1"
            size="sm"
            variant="primary"
            options={[
              {
                label: "Tab 1",
                value: "tab1",
                icon: <Calendar className="h-3.5 w-3.5" />,
              },
              {
                label: "Tab 2",
                value: "tab2",
                icon: <User className="h-3.5 w-3.5" />,
              },
              {
                label: "Tab 3",
                value: "tab3",
                icon: <Settings className="h-3.5 w-3.5" />,
              },
            ]}
          />
        </CardContent>
      </Card>
    </div>
  );
};
