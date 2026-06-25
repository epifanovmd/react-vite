import { FC } from "react";

import { AlertsSection } from "./AlertsSection";
import { AvatarsSection } from "./AvatarsSection";
import { ButtonsSection } from "./ButtonsSection";
import { CardsSection } from "./CardsSection";
import { ControlsSection } from "./ControlsSection";
import { DatePickersSection } from "./DatePickersSection";
import { EmptySection } from "./EmptySection";
import { FormSection } from "./FormSection";
import { InputsSection } from "./InputsSection";
import { ModalsSection } from "./ModalsSection";
import { PaginationSection } from "./PaginationSection";
import { PopoverSection } from "./PopoverSection";
import { SegmentedSection } from "./SegmentedSection";
import { SelectSection } from "./SelectSection";
import { SeparatorsSection } from "./SeparatorsSection";
import { SpinnerSection } from "./SpinnerSection";
import { TableSection } from "./TableSection";
import { TabsSection } from "./TabsSection";
import { TagsBadgesSection } from "./TagsBadgesSection";
import { TooltipSection } from "./TooltipSection";

export interface UISection {
  value: string;
  label: string;
  Component: FC;
}

export const UI_SECTIONS: UISection[] = [
  { value: "buttons", label: "Кнопки", Component: ButtonsSection },
  { value: "inputs", label: "Поля ввода", Component: InputsSection },
  { value: "tags", label: "Теги и бейджи", Component: TagsBadgesSection },
  { value: "controls", label: "Переключатели", Component: ControlsSection },
  { value: "avatars", label: "Аватары", Component: AvatarsSection },
  { value: "alerts", label: "Алерты", Component: AlertsSection },
  { value: "separators", label: "Разделители", Component: SeparatorsSection },
  { value: "select", label: "Селекты", Component: SelectSection },
  { value: "segmented", label: "Segmented", Component: SegmentedSection },
  { value: "tabs", label: "Вкладки", Component: TabsSection },
  { value: "pagination", label: "Пагинация", Component: PaginationSection },
  { value: "date", label: "Даты", Component: DatePickersSection },
  { value: "table", label: "Таблица", Component: TableSection },
  { value: "modals", label: "Модалки и Drawer", Component: ModalsSection },
  { value: "tooltip", label: "Тултипы", Component: TooltipSection },
  { value: "popover", label: "Popover", Component: PopoverSection },
  { value: "cards", label: "Карточки", Component: CardsSection },
  { value: "spinner", label: "Спиннеры", Component: SpinnerSection },
  { value: "empty", label: "Пустые состояния", Component: EmptySection },
  { value: "forms", label: "Формы", Component: FormSection },
];
