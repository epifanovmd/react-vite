import { Button, Empty } from "@shared/ui";
import { Link } from "@tanstack/react-router";

import { DEFAULT_SECTION } from "../model";

/** Неизвестный раздел в адресе. */
export const UiKitSectionNotFound = () => (
  <Empty
    icon="search"
    title="Раздел не найден"
    description="Такого компонента нет в UI Kit"
    action={
      <Button asChild size="sm" variant="outline">
        <Link to="/ui/$section" params={{ section: DEFAULT_SECTION }}>
          К первому разделу
        </Link>
      </Button>
    }
  />
);
