import { FC } from "react";

import { AlertsSection } from "./AlertsSection";
import { AvatarsSection } from "./AvatarsSection";
import { ButtonsSection } from "./ButtonsSection";
import { CardsSection } from "./CardsSection";
import { ChartsSection } from "./ChartsSection";
import { CollapseSection } from "./CollapseSection";
import { ControlsSection } from "./ControlsSection";
import { CopyableTextSection } from "./CopyableTextSection";
import { DatePickersSection } from "./DatePickersSection";
import { EmptySection } from "./EmptySection";
import { FieldsSection } from "./FieldsSection";
import { FileDropSection } from "./FileDropSection";
import { FormsSection } from "./FormsSection";
import { InputsSection } from "./InputsSection";
import { KanbanSection } from "./KanbanSection";
import { MaskedInputsSection } from "./MaskedInputsSection";
import { ModalsSection } from "./ModalsSection";
import { NotificationsSection } from "./NotificationsSection";
import { PageStatesSection } from "./PageStatesSection";
import { PaginationSection } from "./PaginationSection";
import { PopoverSection } from "./PopoverSection";
import { ProgressSection } from "./ProgressSection";
import { SegmentedSection } from "./SegmentedSection";
import { SelectSection } from "./SelectSection";
import { SeparatorsSection } from "./SeparatorsSection";
import { SpinnerSection } from "./SpinnerSection";
import { StatCardSection } from "./StatCardSection";
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
  { value: "forms", label: "Формы", Component: FormsSection },
  { value: "controls", label: "Переключатели", Component: ControlsSection },
  { value: "tags", label: "Теги и бейджи", Component: TagsBadgesSection },
  { value: "avatars", label: "Аватары", Component: AvatarsSection },
  { value: "alerts", label: "Алерты", Component: AlertsSection },
  {
    value: "notifications",
    label: "Уведомления",
    Component: NotificationsSection,
  },
  { value: "separators", label: "Разделители", Component: SeparatorsSection },
  { value: "select", label: "Селекты", Component: SelectSection },
  { value: "segmented", label: "Segmented", Component: SegmentedSection },
  { value: "tabs", label: "Вкладки", Component: TabsSection },
  { value: "pagination", label: "Пагинация", Component: PaginationSection },
  { value: "date", label: "Даты", Component: DatePickersSection },
  { value: "masked", label: "Маски ввода", Component: MaskedInputsSection },
  { value: "table", label: "Таблица", Component: TableSection },
  { value: "charts", label: "Графики", Component: ChartsSection },
  { value: "kanban", label: "Kanban", Component: KanbanSection },
  { value: "modals", label: "Модалки и Drawer", Component: ModalsSection },
  { value: "tooltip", label: "Тултипы", Component: TooltipSection },
  { value: "popover", label: "Popover", Component: PopoverSection },
  { value: "cards", label: "Карточки", Component: CardsSection },
  { value: "spinner", label: "Спиннеры", Component: SpinnerSection },
  { value: "progress", label: "Прогресс", Component: ProgressSection },
  { value: "file-drop", label: "Загрузка файлов", Component: FileDropSection },
  { value: "empty", label: "Пустые состояния", Component: EmptySection },
  {
    value: "page-states",
    label: "Состояния страницы",
    Component: PageStatesSection,
  },
  { value: "collapse", label: "Collapse", Component: CollapseSection },
  { value: "copyable", label: "Копирование", Component: CopyableTextSection },
  { value: "stat-cards", label: "Показатели", Component: StatCardSection },
  { value: "fields", label: "Подписи и поля", Component: FieldsSection },
];
