import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  IconButton,
} from "@components/ui";
import { Download, Edit, Heart, Mail, Power, Trash2 } from "lucide-react";
import { FC } from "react";

const variants = [
  "default",
  "primary",
  "secondary",
  "destructive",
  "success",
  "warning",
  "info",
  "outline",
  "ghost",
];

export const ButtonsSection: FC = () => (
  <Card>
    <CardHeader>
      <CardTitle className="text-base">Buttons</CardTitle>
      <CardDescription className="text-xs">Варианты и размеры</CardDescription>
    </CardHeader>
    <CardContent className="space-y-3">
      <div className="flex items-center gap-1.5 flex-wrap">
        {variants.map(variant => (
          <Button key={variant} variant={variant as any} size="sm">
            {variant}
          </Button>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <Button leftIcon={<Mail className="h-3.5 w-3.5" />} size="sm">
          Icon
        </Button>
        <Button loading size="sm">
          Loading
        </Button>
        <Button disabled size="sm">
          Disabled
        </Button>
      </div>
      <div>
        <p className="text-xs text-muted-foreground mb-2">Icon Buttons</p>
        <div className="flex items-center gap-2 flex-wrap">
          <IconButton variant="default" size="sm" title="Heart">
            <Heart size={14} />
          </IconButton>
          <IconButton variant="default" size="md" title="Edit">
            <Edit size={16} />
          </IconButton>
          <IconButton variant="destructive" size="md" title="Delete">
            <Trash2 size={16} />
          </IconButton>
          <IconButton variant="primary" size="md" title="Download">
            <Download size={16} />
          </IconButton>
          <IconButton variant="enable" size="md" title="Enable">
            <Power size={16} />
          </IconButton>
          <IconButton variant="disable" size="md" title="Disable">
            <Power size={16} />
          </IconButton>
        </div>
      </div>
    </CardContent>
  </Card>
);
