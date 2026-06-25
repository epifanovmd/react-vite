import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  DatePicker,
  DateRange,
  DateRangePicker,
} from "@components/ui";
import { FC, useState } from "react";

export const DatePickersSection: FC = () => {
  const [date, setDate] = useState<Date | undefined>();
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Date Pickers</CardTitle>
        <CardDescription className="text-xs">
          Выбор даты и диапазона — размеры, варианты, clearable
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 grid grid-cols-1 sm:grid-cols-2">
        {/* Sizes */}
        <div>
          <p className="text-xs text-muted-foreground mb-3">Размеры</p>
          <div className="flex flex-col gap-2 space-y-2 max-w-xs">
            <DatePicker
              value={date}
              onChange={setDate}
              size="sm"
              placeholder="sm — выберите дату"
            />
            <DatePicker
              value={date}
              onChange={setDate}
              size="md"
              placeholder="md — выберите дату"
            />
            <DatePicker
              value={date}
              onChange={setDate}
              size="lg"
              placeholder="lg — выберите дату"
            />
          </div>
        </div>

        {/* Variants */}
        <div>
          <p className="text-xs text-muted-foreground mb-3">Варианты</p>
          <div className="flex flex-col gap-2 space-y-2 max-w-xs">
            <DatePicker
              value={date}
              onChange={setDate}
              variant="default"
              placeholder="default"
            />
            <DatePicker
              value={date}
              onChange={setDate}
              variant="filled"
              placeholder="filled"
            />
            <DatePicker
              value={date}
              onChange={setDate}
              variant="filled-error"
              placeholder="filled error"
            />
            <DatePicker
              value={date}
              onChange={setDate}
              variant="filled-success"
              placeholder="filled success"
            />
            <DatePicker
              value={date}
              onChange={setDate}
              variant="error"
              placeholder="error — ошибка валидации"
            />
            <DatePicker
              value={date}
              onChange={setDate}
              variant="success"
              placeholder="success — успешно"
            />
            <DatePicker
              value={date}
              onChange={setDate}
              disabled
              placeholder="disabled"
            />
          </div>
        </div>

        {/* Clearable */}
        <div>
          <p className="text-xs text-muted-foreground mb-3">
            С кнопкой очистки
          </p>
          <div className="space-y-2 max-w-xs">
            <DatePicker
              value={date}
              onChange={setDate}
              clearable
              placeholder="Выберите дату"
            />
          </div>
        </div>

        {/* DateRangePicker */}
        <div>
          <p className="text-xs text-muted-foreground mb-3">Диапазон дат</p>
          <div className="flex flex-col gap-2 space-y-2 max-w-xs">
            <DateRangePicker
              value={dateRange}
              onChange={setDateRange}
              size="sm"
              placeholder="sm — период"
            />
            <DateRangePicker
              value={dateRange}
              onChange={setDateRange}
              size="md"
              placeholder="md — период"
            />
            <DateRangePicker
              value={dateRange}
              onChange={setDateRange}
              size="lg"
              placeholder="lg — период"
            />
            <DateRangePicker
              value={dateRange}
              onChange={setDateRange}
              variant="filled"
              placeholder="filled"
            />
            <DateRangePicker
              value={dateRange}
              onChange={setDateRange}
              variant="filled-error"
              placeholder="filled error"
            />
            <DateRangePicker
              value={dateRange}
              onChange={setDateRange}
              variant="filled-success"
              placeholder="filled success"
            />
            <DateRangePicker
              value={dateRange}
              onChange={setDateRange}
              variant="error"
              placeholder="error — ошибка"
            />
            <DateRangePicker
              value={dateRange}
              onChange={setDateRange}
              clearable
              placeholder="clearable"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
