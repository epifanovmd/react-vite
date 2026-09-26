import { describe, expect, it } from "vitest";

import { describeUpload } from "../upload-status";

const base = { name: "photo.png", index: 1, count: 1 };

describe("describeUpload", () => {
  it("отправка — процент и определённая полоса", () => {
    expect(describeUpload({ ...base, ratio: 0.42 })).toEqual({
      title: "Загрузка photo.png",
      detail: "42%",
      indeterminate: false,
    });
  });

  it("файл отправлен целиком — обработка на сервере, бегущая полоса", () => {
    expect(describeUpload({ ...base, ratio: 1 })).toEqual({
      title: "Обработка photo.png",
      detail: "на сервере…",
      indeterminate: true,
    });
  });

  it("доля неизвестна — многоточие и бегущая полоса", () => {
    expect(describeUpload(base)).toEqual({
      title: "Загрузка photo.png",
      detail: "…",
      indeterminate: true,
    });
  });

  it("в пачке — номер файла перед стадией", () => {
    expect(
      describeUpload({ ...base, index: 2, count: 5, ratio: 1 }).detail,
    ).toBe("2 из 5 · на сервере…");
  });
});
