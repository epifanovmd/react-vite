import { DateFormatter } from "../formatter/date-formatter";

const formatter = new DateFormatter();

describe("DateFormatter.formatDiff", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("вчерашняя дата меньше суток назад — «вчера»", () => {
    vi.useFakeTimers({ now: new Date(2026, 8, 28, 0, 30) });

    expect(
      formatter.formatDiff(new Date(2026, 8, 27, 23, 0).toISOString()),
    ).toBe("вчера");
  });

  it("вчерашняя дата больше суток назад — тоже «вчера»", () => {
    vi.useFakeTimers({ now: new Date(2026, 8, 28, 12, 0) });

    expect(
      formatter.formatDiff(new Date(2026, 8, 27, 10, 0).toISOString()),
    ).toBe("вчера");
  });

  it("позавчера меньше 48 часов назад — не «вчера»", () => {
    vi.useFakeTimers({ now: new Date(2026, 8, 28, 0, 30) });

    expect(
      formatter.formatDiff(new Date(2026, 8, 26, 23, 0).toISOString()),
    ).toBe("2 дня назад");
  });
});

describe("DateFormatter: невалидная дата", () => {
  it("форматтеры возвращают пустую строку, а не бросают", () => {
    expect(formatter.format("не дата")).toBe("");
    expect(formatter.formatDate("не дата")).toBe("");
    expect(formatter.formatTime("не дата")).toBe("");
    expect(formatter.formatChartTime("не дата")).toBe("");
    expect(formatter.formatInputDate("не дата")).toBe("");
    expect(formatter.formatDiff("не дата")).toBe("");
  });

  it("isExpired для невалидной даты — false", () => {
    expect(formatter.isExpired("не дата")).toBe(false);
  });
});
