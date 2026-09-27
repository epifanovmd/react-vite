import { describe, expect, it } from "vitest";

import { describeUpload } from "../upload-status";

const base = { name: "photo.png", index: 1, count: 1 };

describe("describeUpload", () => {
  it("отправка — процент в стадии, определённая полоса", () => {
    expect(describeUpload({ ...base, ratio: 0.42 })).toEqual({
      stage: "Загрузка 42%",
      position: null,
      indeterminate: false,
    });
  });

  it("файл отправлен целиком — обработка на сервере, бегущая полоса", () => {
    expect(describeUpload({ ...base, ratio: 1 })).toEqual({
      stage: "Обработка на сервере…",
      position: null,
      indeterminate: true,
    });
  });

  it("доля неизвестна — бегущая полоса", () => {
    expect(describeUpload(base)).toEqual({
      stage: "Загрузка…",
      position: null,
      indeterminate: true,
    });
  });

  it("в пачке — номер файла отдельно от стадии", () => {
    expect(describeUpload({ ...base, index: 2, count: 5, ratio: 1 })).toEqual({
      stage: "Обработка на сервере…",
      position: "2 из 5",
      indeterminate: true,
    });
  });
});
