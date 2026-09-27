import { FC } from "react";

import { AlertsSection } from "./AlertsSection";
import { AvatarsSection } from "./AvatarsSection";
import { ButtonsSection } from "./ButtonsSection";
import { CardsSection } from "./CardsSection";
import { ChartsSection } from "./ChartsSection";
import { CollapseSection } from "./CollapseSection";
import { CommandSection } from "./CommandSection";
import { ControlsSection } from "./ControlsSection";
import { CopyableTextSection } from "./CopyableTextSection";
import { DatePickersSection } from "./DatePickersSection";
import { DropdownMenuSection } from "./DropdownMenuSection";
import { EmptySection } from "./EmptySection";
import { FieldsSection } from "./FieldsSection";
import { FileDropSection } from "./FileDropSection";
import { FormsSection } from "./FormsSection";
import { InputsSection } from "./InputsSection";
import { KanbanSection } from "./KanbanSection";
import { MaskedInputsSection } from "./MaskedInputsSection";
import { ModalsSection } from "./ModalsSection";
import { NotificationsSection } from "./NotificationsSection";
import { NumberInputSection } from "./NumberInputSection";
import { OtpInputSection } from "./OtpInputSection";
import { PageStatesSection } from "./PageStatesSection";
import { PaginationSection } from "./PaginationSection";
import { PopoverSection } from "./PopoverSection";
import { ProgressSection } from "./ProgressSection";
import { ScrollAreaSection } from "./ScrollAreaSection";
import { SegmentedSection } from "./SegmentedSection";
import { SelectSection } from "./SelectSection";
import { SeparatorsSection } from "./SeparatorsSection";
import { SkeletonSection } from "./SkeletonSection";
import { SliderSection } from "./SliderSection";
import { SpinnerSection } from "./SpinnerSection";
import { StatCardSection } from "./StatCardSection";
import { TableSection } from "./TableSection";
import { TabsSection } from "./TabsSection";
import { TagsBadgesSection } from "./TagsBadgesSection";
import { TooltipSection } from "./TooltipSection";
import { VirtualListSection } from "./VirtualListSection";

export type UISectionGroup =
  "foundation" | "inputs" | "navigation" | "feedback" | "data";

export interface UISection {
  /** Сегмент адреса: `/ui/<value>`. */
  value: string;
  label: string;
  group: UISectionGroup;
  description: string;
  Component: FC;
}

export const UI_SECTIONS: UISection[] = [
  {
    value: "buttons",
    label: "Кнопки",
    group: "foundation",
    description:
      "Button, IconButton и асинхронные варианты: интенты, размеры, загрузка, asChild.",
    Component: ButtonsSection,
  },
  {
    value: "tags",
    label: "Теги и бейджи",
    group: "foundation",
    description:
      "Badge, BadgeAnchor, Chip, Kbd и CodeChip на общей палитре интентов.",
    Component: TagsBadgesSection,
  },
  {
    value: "avatars",
    label: "Аватары",
    group: "foundation",
    description: "Изображение с fallback-инициалами, размеры, формы и группа.",
    Component: AvatarsSection,
  },
  {
    value: "cards",
    label: "Карточки",
    group: "foundation",
    description:
      "Варианты Card, шорткат через пропсы и составная разметка из секций.",
    Component: CardsSection,
  },
  {
    value: "separators",
    label: "Разделители",
    group: "foundation",
    description:
      "Горизонтальный и вертикальный Separator, в том числе с подписью.",
    Component: SeparatorsSection,
  },
  {
    value: "spinner",
    label: "Спиннеры",
    group: "foundation",
    description: "Индикатор загрузки: размеры, варианты и подпись.",
    Component: SpinnerSection,
  },
  {
    value: "progress",
    label: "Прогресс",
    group: "foundation",
    description:
      "Полоса прогресса: размеры, варианты и неопределённое состояние.",
    Component: ProgressSection,
  },
  {
    value: "scroll-area",
    label: "Область прокрутки",
    group: "foundation",
    description:
      "ScrollArea: кастомные полосы прокрутки, обе оси и viewportRef для виртуализации.",
    Component: ScrollAreaSection,
  },

  {
    value: "inputs",
    label: "Поля ввода",
    group: "inputs",
    description:
      "Input и Textarea: варианты, слоты, пароль, счётчик и плавающая подпись.",
    Component: InputsSection,
  },
  {
    value: "masked",
    label: "Маски ввода",
    group: "inputs",
    description:
      "MaskedInput и готовые маски: телефон, карты, документы РФ, даты.",
    Component: MaskedInputsSection,
  },
  {
    value: "number-input",
    label: "Числовое поле",
    group: "inputs",
    description:
      "NumberInput: число или null, форматирование ru-RU, степпер и стрелки, границы, точность, префикс и суффикс.",
    Component: NumberInputSection,
  },
  {
    value: "otp-input",
    label: "Код подтверждения",
    group: "inputs",
    description:
      "OtpInput: ячейки кода с переходом, Backspace и стрелками, вставкой и автозаполнением из SMS, маской и разделителем.",
    Component: OtpInputSection,
  },
  {
    value: "select",
    label: "Селекты",
    group: "inputs",
    description:
      "Select, Autocomplete и GroupedSelect со стратегиями загрузки опций.",
    Component: SelectSection,
  },
  {
    value: "date",
    label: "Даты",
    group: "inputs",
    description:
      "DatePicker и DateRangePicker: размеры, варианты, ограничения и пресеты.",
    Component: DatePickersSection,
  },
  {
    value: "controls",
    label: "Переключатели",
    group: "inputs",
    description: "Switch, Checkbox и Radio с подписями и описаниями.",
    Component: ControlsSection,
  },
  {
    value: "slider",
    label: "Слайдер",
    group: "inputs",
    description:
      "Slider: одиночное значение и диапазон, метки шкалы, подпись значения, вертикальная ориентация, интенты.",
    Component: SliderSection,
  },
  {
    value: "segmented",
    label: "Segmented",
    group: "inputs",
    description:
      "Сегментированный выбор с клавиатурной навигацией и анимированным индикатором.",
    Component: SegmentedSection,
  },
  {
    value: "file-drop",
    label: "Загрузка файлов",
    group: "inputs",
    description: "FileDrop: перетаскивание, фильтр accept и выбор папки.",
    Component: FileDropSection,
  },
  {
    value: "fields",
    label: "Подписи и поля",
    group: "inputs",
    description: "InfoField и LabeledField для подписей вне форм.",
    Component: FieldsSection,
  },
  {
    value: "forms",
    label: "Формы",
    group: "inputs",
    description:
      "React Hook Form + Zod: адаптеры полей, асинхронная валидация, массивы полей.",
    Component: FormsSection,
  },

  {
    value: "tabs",
    label: "Вкладки",
    group: "navigation",
    description:
      "Tabs: варианты, размеры, иконки и прокрутка при переполнении.",
    Component: TabsSection,
  },
  {
    value: "pagination",
    label: "Пагинация",
    group: "navigation",
    description: "Окно страниц по maxVisible, крайние страницы и блокировка.",
    Component: PaginationSection,
  },
  {
    value: "collapse",
    label: "Collapse",
    group: "navigation",
    description:
      "Раскрывающийся блок: варианты триггера, размеры и управляемый режим.",
    Component: CollapseSection,
  },
  {
    value: "dropdown-menu",
    label: "Выпадающее меню",
    group: "navigation",
    description:
      "DropdownMenu и ContextMenu: шорткаты, чекбоксы, радио, вложенные и деструктивные пункты.",
    Component: DropdownMenuSection,
  },
  {
    value: "command",
    label: "Командная панель",
    group: "navigation",
    description:
      "Command на cmdk: поиск с фильтрацией, группы, шорткаты и CommandDialog по Ctrl/Cmd+K.",
    Component: CommandSection,
  },

  {
    value: "alerts",
    label: "Алерты",
    group: "feedback",
    description: "Инлайн-сообщения: варианты, заголовок и закрытие.",
    Component: AlertsSection,
  },
  {
    value: "notifications",
    label: "Уведомления",
    group: "feedback",
    description:
      "Тосты через NotificationService: действия, promise и дедупликация.",
    Component: NotificationsSection,
  },
  {
    value: "modals",
    label: "Модалки и Drawer",
    group: "feedback",
    description: "Modal, подтверждение, ModalProvider и Drawer со всех сторон.",
    Component: ModalsSection,
  },
  {
    value: "tooltip",
    label: "Тултипы",
    group: "feedback",
    description: "Подсказки при наведении и фокусе.",
    Component: TooltipSection,
  },
  {
    value: "popover",
    label: "Popover",
    group: "feedback",
    description: "Всплывающие панели: варианты, размеры и стрелка.",
    Component: PopoverSection,
  },
  {
    value: "copyable",
    label: "Копирование",
    group: "feedback",
    description: "CopyableText: копирование в буфер с подтверждением.",
    Component: CopyableTextSection,
  },
  {
    value: "empty",
    label: "Пустые состояния",
    group: "feedback",
    description: "Empty с именованными иконками, описанием и действием.",
    Component: EmptySection,
  },
  {
    value: "page-states",
    label: "Состояния страницы",
    group: "feedback",
    description: "PageLoader, PageEmpty и ErrorBoundary со сбросом.",
    Component: PageStatesSection,
  },
  {
    value: "skeleton",
    label: "Skeleton",
    group: "feedback",
    description:
      "Заглушки контента на время загрузки: блок, текст, аватар, строка.",
    Component: SkeletonSection,
  },

  {
    value: "table",
    label: "Таблица",
    group: "data",
    description:
      "Table на TanStack Table: сортировка, фильтры, выбор, закрепление, подгрузка.",
    Component: TableSection,
  },
  {
    value: "charts",
    label: "Графики",
    group: "data",
    description:
      "LineChart и AreaChart на visx: тултип по позиции, стек, состояния.",
    Component: ChartsSection,
  },
  {
    value: "kanban",
    label: "Kanban",
    group: "data",
    description: "Доска с перетаскиванием, воркфлоу переходов и WIP-лимитами.",
    Component: KanbanSection,
  },
  {
    value: "stat-cards",
    label: "Показатели",
    group: "data",
    description: "StatCard: значение, описание и значок по варианту.",
    Component: StatCardSection,
  },
  {
    value: "virtual-list",
    label: "VirtualList",
    group: "data",
    description:
      "Виртуализированный список с динамической высотой строк и догрузкой.",
    Component: VirtualListSection,
  },
];
