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
} from "@components/ui";
import { FC, useState } from "react";

export const TabsSection: FC = () => {
  const [selectedTab, setSelectedTab] = useState("tab1");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Tabs</CardTitle>
        <CardDescription className="text-xs">Вкладки</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList variant="default" size="sm">
            <TabsTrigger value="tab1" variant="default" size="sm">
              Home
            </TabsTrigger>
            <TabsTrigger value="tab2" variant="default" size="sm">
              Profile
            </TabsTrigger>
            <TabsTrigger value="tab3" variant="default" size="sm">
              Settings
            </TabsTrigger>
          </TabsList>
          <TabsContent value="tab1" className="text-xs text-muted-foreground">
            Home content
          </TabsContent>
          <TabsContent value="tab2" className="text-xs text-muted-foreground">
            Profile content
          </TabsContent>
          <TabsContent value="tab3" className="text-xs text-muted-foreground">
            Settings content
          </TabsContent>
        </Tabs>
        <Tabs defaultValue="a">
          <TabsList variant="underline" size="sm">
            <TabsTrigger value="a" variant="underline" size="sm">
              Account
            </TabsTrigger>
            <TabsTrigger value="b" variant="underline" size="sm">
              Billing
            </TabsTrigger>
            <TabsTrigger value="c" variant="underline" size="sm">
              Notifications
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardContent>
    </Card>
  );
};
