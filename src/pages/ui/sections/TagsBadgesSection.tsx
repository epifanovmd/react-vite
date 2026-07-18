import {
  Avatar,
  Badge,
  BadgeAnchor,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Chips,
  IconButton,
} from "@components/ui";
import { Bell } from "lucide-react";
import { type FC, type ReactNode } from "react";

const Row = ({ children }: { children: ReactNode }) => (
  <div className="flex flex-wrap gap-2 items-center">{children}</div>
);

export const TagsBadgesSection: FC = () => (
  <Card>
    <CardHeader>
      <CardTitle className="text-base">Tags & Badges</CardTitle>
      <CardDescription className="text-xs">
        Badge и Chips — общая палитра вариантов
      </CardDescription>
    </CardHeader>
    <CardContent className="flex flex-col gap-4">
      <div>
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
          Badge — счётчик / индикатор (без remove)
        </p>
        <Row>
          <Badge>Default</Badge>
          <Badge variant="primary">Primary</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="danger">Danger</Badge>
          <Badge variant="info">Info</Badge>
          <Badge variant="gray">Gray</Badge>
          <Badge variant="purple">Purple</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="muted">Muted</Badge>
          <Badge variant="primary" dot>
            Dot
          </Badge>
          <Badge variant="success" dot>
            Online
          </Badge>
        </Row>
      </div>

      <hr className="border-border" />

      <div>
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-4">
          BadgeAnchor — счётчик / точка поверх элемента
        </p>
        <Row>
          <BadgeAnchor content={3}>
            <IconButton aria-label="Уведомления" variant="default">
              <Bell className="h-4 w-4" />
            </IconButton>
          </BadgeAnchor>
          <BadgeAnchor content={150} max={99} variant="destructive">
            <IconButton aria-label="Уведомления" variant="default">
              <Bell className="h-4 w-4" />
            </IconButton>
          </BadgeAnchor>
          <BadgeAnchor content={0}>
            <IconButton aria-label="Уведомления" variant="default">
              <Bell className="h-4 w-4" />
            </IconButton>
          </BadgeAnchor>
          <BadgeAnchor content={5} variant="info" placement="top-left">
            <IconButton aria-label="Уведомления" variant="default">
              <Bell className="h-4 w-4" />
            </IconButton>
          </BadgeAnchor>
          <BadgeAnchor dot variant="success">
            <Avatar name="Alex Doe" />
          </BadgeAnchor>
        </Row>
      </div>

      <hr className="border-border" />

      <div>
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
          Chips — active (active=true, default)
        </p>
        <Row>
          <Chips>Default</Chips>
          <Chips variant="primary">Primary</Chips>
          <Chips variant="secondary">Secondary</Chips>
          <Chips variant="success">Success</Chips>
          <Chips variant="warning">Warning</Chips>
          <Chips variant="destructive">Destructive</Chips>
          <Chips variant="danger">Danger</Chips>
          <Chips variant="info">Info</Chips>
          <Chips variant="gray">Gray</Chips>
          <Chips variant="outline">Outline</Chips>
          <Chips variant="muted">Muted</Chips>
          <Chips onRemove={() => {}}>Removable</Chips>
          <Chips variant="primary" onRemove={() => {}}>
            Primary ×
          </Chips>
          <Chips variant="success" leftIcon={<span>✓</span>}>
            Icon
          </Chips>
        </Row>
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mt-2 mb-2">
          Chips — inactive (active=false)
        </p>
        <Row>
          <Chips active={false}>Default</Chips>
          <Chips variant="primary" active={false}>
            Primary
          </Chips>
          <Chips variant="secondary" active={false}>
            Secondary
          </Chips>
          <Chips variant="success" active={false}>
            Success
          </Chips>
          <Chips variant="warning" active={false}>
            Warning
          </Chips>
          <Chips variant="destructive" active={false}>
            Destructive
          </Chips>
          <Chips variant="danger" active={false}>
            Danger
          </Chips>
          <Chips variant="info" active={false}>
            Info
          </Chips>
          <Chips variant="gray" active={false}>
            Gray
          </Chips>
          <Chips variant="outline" active={false}>
            Outline
          </Chips>
          <Chips variant="muted" active={false}>
            Muted
          </Chips>
          <Chips onRemove={() => {}} active={false}>
            Removable
          </Chips>
          <Chips variant="primary" onRemove={() => {}} active={false}>
            Primary ×
          </Chips>
        </Row>
      </div>
    </CardContent>
  </Card>
);
