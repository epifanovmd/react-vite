import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Chips,
  Tag,
} from "@components/ui";
import { FC } from "react";

export const TagsBadgesSection: FC = () => (
  <Card>
    <CardHeader>
      <CardTitle className="text-base">Tags & Badges</CardTitle>
      <CardDescription className="text-xs">Метки и теги</CardDescription>
    </CardHeader>
    <CardContent className="space-y-3">
      <div className="flex flex-wrap gap-1.5">
        <Tag size="sm">Default</Tag>
        <Tag size="sm" variant="primary">
          Primary
        </Tag>
        <Tag size="sm" variant="success">
          Success
        </Tag>
        <Tag size="sm" variant="warning">
          Warning
        </Tag>
        <Tag size="sm" variant="destructive">
          Error
        </Tag>
        <Tag size="sm" variant="info">
          Info
        </Tag>
      </div>
      <div className="flex flex-wrap gap-2 items-center">
        <Badge size="sm">5</Badge>
        <Badge size="sm" variant="primary">
          99+
        </Badge>
        <Badge size="sm" variant="success">
          New
        </Badge>
        <Badge size="sm" variant="destructive">
          !
        </Badge>
      </div>
      <div className="flex flex-wrap gap-1.5">
        <Chips size="sm">Chip 1</Chips>
        <Chips size="sm" variant="primary">
          Chip 2
        </Chips>
        <Chips size="sm" onRemove={() => {}}>
          Removable
        </Chips>
      </div>
    </CardContent>
  </Card>
);
