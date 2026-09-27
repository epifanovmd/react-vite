import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@shared/ui";
import { Bell, CreditCard, User } from "lucide-react";
import { FC, useState } from "react";

const monthTabs = [
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

export const TabsSection: FC = () => {
  const [section, setSection] = useState("account");
  const [month, setMonth] = useState("aug");

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Варианты</CardTitle>
          <CardDescription className="text-xs">
            default, underline — с контентом вкладок
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-xs text-muted-foreground mb-2">Default</p>
            <Tabs defaultValue="home">
              <TabsList size="sm">
                <TabsTrigger value="home">Home</TabsTrigger>
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              <TabsContent
                value="home"
                className="text-xs text-muted-foreground"
              >
                Home content
              </TabsContent>
              <TabsContent
                value="profile"
                className="text-xs text-muted-foreground"
              >
                Profile content
              </TabsContent>
              <TabsContent
                value="settings"
                className="text-xs text-muted-foreground"
              >
                Settings content
              </TabsContent>
            </Tabs>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-2">Underline</p>
            <Tabs defaultValue="overview">
              <TabsList variant="underline" size="sm">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="reports">Reports</TabsTrigger>
              </TabsList>
              <TabsContent
                value="overview"
                className="text-xs text-muted-foreground"
              >
                Overview content
              </TabsContent>
              <TabsContent
                value="analytics"
                className="text-xs text-muted-foreground"
              >
                Analytics content
              </TabsContent>
              <TabsContent
                value="reports"
                className="text-xs text-muted-foreground"
              >
                Reports content
              </TabsContent>
            </Tabs>
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
            <Tabs defaultValue="day">
              <TabsList size="sm">
                <TabsTrigger value="day">Day</TabsTrigger>
                <TabsTrigger value="week">Week</TabsTrigger>
                <TabsTrigger value="month">Month</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-2">Medium</p>
            <Tabs defaultValue="day">
              <TabsList size="md">
                <TabsTrigger value="day">Day</TabsTrigger>
                <TabsTrigger value="week">Week</TabsTrigger>
                <TabsTrigger value="month">Month</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-2">Large</p>
            <Tabs defaultValue="day">
              <TabsList size="lg">
                <TabsTrigger value="day">Day</TabsTrigger>
                <TabsTrigger value="week">Week</TabsTrigger>
                <TabsTrigger value="month">Month</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Иконки и состояния</CardTitle>
          <CardDescription className="text-xs">
            Вкладки с иконками, недоступная вкладка
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-xs text-muted-foreground mb-2">With icons</p>
            <Tabs defaultValue="account">
              <TabsList size="md">
                <TabsTrigger value="account">
                  <User className="mr-1.5 inline h-4 w-4" />
                  Account
                </TabsTrigger>
                <TabsTrigger value="billing">
                  <CreditCard className="mr-1.5 inline h-4 w-4" />
                  Billing
                </TabsTrigger>
                <TabsTrigger value="notifications">
                  <Bell className="mr-1.5 inline h-4 w-4" />
                  Alerts
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-2">
              Disabled trigger
            </p>
            <Tabs defaultValue="active">
              <TabsList size="sm">
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="archived" disabled>
                  Archived
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-2">
              Disabled trigger — underline
            </p>
            <Tabs defaultValue="general">
              <TabsList variant="underline" size="sm">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
                <TabsTrigger value="danger" disabled>
                  Danger zone
                </TabsTrigger>
              </TabsList>
            </Tabs>
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
              Controlled — выбрано: {section}
            </p>
            <Tabs value={section} onValueChange={setSection}>
              <TabsList size="sm">
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="billing">Billing</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-2">
              Много вкладок — активная прокручивается в центр
            </p>
            <Tabs value={month} onValueChange={setMonth}>
              <TabsList variant="underline" size="sm">
                {monthTabs.map(tab => (
                  <TabsTrigger key={tab.value} value={tab.value}>
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
