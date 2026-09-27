import {
  Avatar,
  Badge,
  BadgeAnchor,
  Button,
  Chip,
  type ChipProps,
  CodeChip,
  IconButton,
  Kbd,
  Separator,
} from "@shared/ui";
import { Bell, Check } from "lucide-react";
import { type FC, useState } from "react";

import { DemoBlock, DemoCard, DemoInline } from "./shared";

type ChipVariant = NonNullable<ChipProps["variant"]>;

const CHIP_VARIANTS: ChipVariant[] = [
  "default",
  "primary",
  "secondary",
  "success",
  "warning",
  "destructive",
  "info",
  "outline",
  "muted",
];

const FILTERS = ["Все", "Активные", "Архив"];

const DEFAULT_TAGS = ["React", "MobX", "Vite"];

const noop = () => {};

export const TagsBadgesSection: FC = () => {
  const [filter, setFilter] = useState(FILTERS[0]);
  const [tags, setTags] = useState(DEFAULT_TAGS);

  const removeTag = (tag: string) =>
    setTags(current => current.filter(item => item !== tag));

  const restoreTags = () => setTags(DEFAULT_TAGS);

  return (
    <DemoCard
      title="Tags & Badges"
      description="Badge, Chip, Kbd, CodeChip — общая палитра вариантов"
    >
      <DemoBlock title="Badge — счётчик / индикатор">
        <DemoInline>
          <Badge>Default</Badge>
          <Badge variant="primary">Primary</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="info">Info</Badge>
          <Badge variant="purple">Purple</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="muted">Muted</Badge>
          <Badge variant="primary" dot>
            Dot
          </Badge>
          <Badge variant="success" dot>
            Online
          </Badge>
        </DemoInline>
      </DemoBlock>

      <DemoBlock title="BadgeAnchor — счётчик / точка поверх элемента">
        <DemoInline>
          <BadgeAnchor content={3}>
            <IconButton aria-label="Уведомления">
              <Bell aria-hidden className="h-4 w-4" />
            </IconButton>
          </BadgeAnchor>
          <BadgeAnchor content={150} max={99} variant="destructive">
            <IconButton aria-label="Уведомления">
              <Bell aria-hidden className="h-4 w-4" />
            </IconButton>
          </BadgeAnchor>
          <BadgeAnchor content={0}>
            <IconButton aria-label="Уведомления">
              <Bell aria-hidden className="h-4 w-4" />
            </IconButton>
          </BadgeAnchor>
          <BadgeAnchor content={5} variant="info" placement="top-left">
            <IconButton aria-label="Уведомления">
              <Bell aria-hidden className="h-4 w-4" />
            </IconButton>
          </BadgeAnchor>
          <BadgeAnchor dot variant="success" label="В сети">
            <Avatar name="Alex Doe" />
          </BadgeAnchor>
        </DemoInline>
      </DemoBlock>

      <Separator />

      <DemoBlock title="Chip — active (по умолчанию)">
        <DemoInline>
          {CHIP_VARIANTS.map(variant => (
            <Chip key={variant} variant={variant}>
              {variant}
            </Chip>
          ))}
        </DemoInline>
      </DemoBlock>

      <DemoBlock title="Chip — inactive">
        <DemoInline>
          {CHIP_VARIANTS.map(variant => (
            <Chip key={variant} variant={variant} active={false}>
              {variant}
            </Chip>
          ))}
        </DemoInline>
      </DemoBlock>

      <DemoBlock title="Chip — размеры, иконка, аватар, disabled">
        <DemoInline>
          <Chip size="sm" variant="primary">
            sm
          </Chip>
          <Chip size="md" variant="primary">
            md
          </Chip>
          <Chip
            variant="success"
            leftIcon={<Check aria-hidden className="h-3 w-3" />}
          >
            Icon
          </Chip>
          <Chip variant="info" avatar={<Avatar size="xs" name="A D" />}>
            Avatar
          </Chip>
          <Chip disabled onRemove={noop}>
            Disabled
          </Chip>
        </DemoInline>
      </DemoBlock>

      <DemoBlock title="Chip — фильтр (clickable)">
        <DemoInline>
          {FILTERS.map(item => (
            <Chip
              key={item}
              variant="primary"
              active={filter === item}
              onClick={() => setFilter(item)}
            >
              {item}
            </Chip>
          ))}
        </DemoInline>
      </DemoBlock>

      <DemoBlock title="Chip — теги (removable)">
        <DemoInline>
          {tags.map(tag => (
            <Chip key={tag} variant="secondary" onRemove={() => removeTag(tag)}>
              {tag}
            </Chip>
          ))}
          {tags.length === 0 && (
            <Button variant="link" size="sm" onClick={restoreTags}>
              Вернуть теги
            </Button>
          )}
        </DemoInline>
      </DemoBlock>

      <Separator />

      <DemoBlock title="Kbd и CodeChip">
        <DemoInline>
          <span className="text-xs text-muted-foreground">
            Сохранить: <Kbd>⌘</Kbd> + <Kbd>S</Kbd>
          </span>
          <CodeChip>gpt-4o-mini</CodeChip>
          <CodeChip muted>legacy-v1</CodeChip>
        </DemoInline>
      </DemoBlock>
    </DemoCard>
  );
};
