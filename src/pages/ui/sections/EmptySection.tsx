import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Empty,
} from "@components/ui";
import { FC } from "react";

export const EmptySection: FC = () => (
  <div className="flex flex-col gap-4">
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Empty State</CardTitle>
        <CardDescription className="text-xs">
          Состояния пустых данных
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Empty
          size="sm"
          icon="inbox"
          title="No messages"
          description="Start a conversation to see messages here"
          action={<Button size="sm">New Message</Button>}
        />
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle className="text-base">Empty Variants</CardTitle>
        <CardDescription className="text-xs">
          Разные варианты пустых состояний
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border rounded-lg">
            <Empty
              size="sm"
              icon="search"
              title="No results"
              description="Try adjusting your search"
            />
          </div>
          <div className="border rounded-lg">
            <Empty
              size="sm"
              icon="package"
              title="No orders"
              description="Your order history is empty"
              action={
                <Button size="sm" variant="primary">
                  Shop Now
                </Button>
              }
            />
          </div>
          <div className="border rounded-lg">
            <Empty
              size="sm"
              icon="database"
              title="No data"
              description="Database is empty"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);
