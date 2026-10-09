import { describe, expect, it } from "vitest";

import {
  fillRoutePath,
  isTextBody,
  missingParams,
  parseHeaderLines,
  responseFileName,
  routeParams,
} from "../route-path";

describe("route path", () => {
  it("подстановки по порядку, без повторов; значения экранируются", () => {
    expect(routeParams("/renders/{id}/files/{name}/{id}")).toEqual([
      "id",
      "name",
    ]);
    expect(fillRoutePath("/items/{id}?q=1", { id: "a b/c" })).toBe(
      "/items/a%20b%2Fc?q=1",
    );
    expect(missingParams("/items/{id}/{part}", { id: "1", part: " " })).toEqual(
      ["part"],
    );
  });

  it("заголовки из строк; без двоеточия — ошибка", () => {
    expect(parseHeaderLines("Accept: text/plain\n\nX-Trace: 1")).toEqual({
      headers: { accept: "text/plain", "x-trace": "1" },
    });
    expect(parseHeaderLines("плохо")).toEqual({ error: "плохо" });
  });

  it("текст или двоичное: по типу, без типа — по UTF-8", () => {
    expect(isTextBody("application/json; charset=utf-8", undefined)).toBe(true);
    expect(isTextBody("application/problem+json", undefined)).toBe(true);
    expect(isTextBody("image/png", undefined)).toBe(false);
    expect(isTextBody(undefined, new TextEncoder().encode("привет"))).toBe(
      true,
    );
    expect(isTextBody(undefined, new Uint8Array([0xff, 0xfe, 0xfd]))).toBe(
      false,
    );
  });

  it("имя файла — из content-disposition или по воркеру", () => {
    expect(
      responseFileName(
        { "content-disposition": 'attachment; filename="report.pdf"' },
        "echo",
      ),
    ).toBe("report.pdf");
    expect(responseFileName({}, "echo")).toBe("echo-response.bin");
  });
});
