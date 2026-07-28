import { useCallback, useEffect, useMemo, useState } from "react";

import type { ViewMode } from "../types";
import { getDecadeStart, MONTHS } from "../utils";

const JANUARY = 0;
const DECEMBER = 11;
const MONTHS_PER_YEAR = 12;

const NEXT_MODE: Record<ViewMode, ViewMode> = {
  day: "month",
  month: "year",
  year: "year",
};

export interface UseCalendarNavigationOptions {
  initialMonth?: number;
  initialYear?: number;
}

export interface UseCalendarNavigationResult {
  viewMode: ViewMode;
  currentMonth: number;
  currentYear: number;
  headerText: string;
  handlePrevious: () => void;
  handleNext: () => void;
  handleHeaderClick: () => void;
  handleMonthSelect: (month: number) => void;
  handleYearSelect: (year: number) => void;
}

export const useCalendarNavigation = ({
  initialMonth,
  initialYear,
}: UseCalendarNavigationOptions = {}): UseCalendarNavigationResult => {
  const now = new Date();
  const [viewMode, setViewMode] = useState<ViewMode>("day");
  const [currentMonth, setCurrentMonth] = useState(
    initialMonth ?? now.getMonth(),
  );
  const [currentYear, setCurrentYear] = useState(
    initialYear ?? now.getFullYear(),
  );

  useEffect(() => {
    if (initialMonth !== undefined && initialYear !== undefined) {
      setCurrentMonth(initialMonth);
      setCurrentYear(initialYear);
    }
  }, [initialMonth, initialYear]);

  const handlePrevious = useCallback(() => {
    switch (viewMode) {
      case "day":
        if (currentMonth === JANUARY) {
          setCurrentMonth(DECEMBER);
          setCurrentYear(y => y - 1);
        } else {
          setCurrentMonth(m => m - 1);
        }
        break;
      case "month":
        setCurrentYear(y => y - 1);
        break;
      case "year":
        setCurrentYear(y => y - MONTHS_PER_YEAR);
        break;
    }
  }, [viewMode, currentMonth]);

  const handleNext = useCallback(() => {
    switch (viewMode) {
      case "day":
        if (currentMonth === DECEMBER) {
          setCurrentMonth(JANUARY);
          setCurrentYear(y => y + 1);
        } else {
          setCurrentMonth(m => m + 1);
        }
        break;
      case "month":
        setCurrentYear(y => y + 1);
        break;
      case "year":
        setCurrentYear(y => y + MONTHS_PER_YEAR);
        break;
    }
  }, [viewMode, currentMonth]);

  const handleHeaderClick = useCallback(() => {
    setViewMode(NEXT_MODE[viewMode]);
  }, [viewMode]);

  const handleMonthSelect = useCallback((month: number) => {
    setCurrentMonth(month);
    setViewMode("day");
  }, []);

  const handleYearSelect = useCallback((year: number) => {
    setCurrentYear(year);
    setViewMode("month");
  }, []);

  const headerText = useMemo(() => {
    switch (viewMode) {
      case "day":
        return `${MONTHS[currentMonth]} ${currentYear}`;
      case "month":
        return String(currentYear);
      case "year": {
        const start = getDecadeStart(currentYear);

        return `${start} — ${start + MONTHS_PER_YEAR - 1}`;
      }
    }
  }, [viewMode, currentMonth, currentYear]);

  return {
    viewMode,
    currentMonth,
    currentYear,
    headerText,
    handlePrevious,
    handleNext,
    handleHeaderClick,
    handleMonthSelect,
    handleYearSelect,
  };
};
