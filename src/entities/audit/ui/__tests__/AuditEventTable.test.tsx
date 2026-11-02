import type { AuditEventDto } from "@shared/api/gen/main/model";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { AuditFeed } from "../../model/audit-feed";
import { AuditEventTable } from "../AuditEventTable";

const event = (id: string): AuditEventDto => ({
  id,
  type: "auth.login.succeeded",
  actorId: "u-1",
  subjectId: null,
  ip: `10.0.0.${id.length}`,
  userAgent: null,
  meta: {},
  createdAt: "2026-09-26T10:00:00.000Z",
});

describe("AuditEventTable", () => {
  it("ошибка «Показать ещё» не скрывает загруженные события и видна у кнопки", async () => {
    const fetch = vi
      .fn()
      .mockResolvedValueOnce({
        data: { items: [event("e-1"), event("e-22")], nextCursor: "c-1" },
        error: null,
      })
      .mockResolvedValueOnce({
        data: null,
        error: { message: "Сбой подгрузки" },
      });
    const feed = new AuditFeed(fetch);

    await feed.load();
    render(<AuditEventTable feed={feed} />);

    const rowsBefore = screen.getAllByRole("row").length;

    fireEvent.click(screen.getByRole("button", { name: "Показать ещё" }));

    await waitFor(() =>
      expect(screen.getByText("Сбой подгрузки")).toBeInTheDocument(),
    );

    expect(screen.getAllByRole("row")).toHaveLength(rowsBefore);
    expect(
      screen.getByRole("button", { name: "Показать ещё" }),
    ).toBeInTheDocument();
  });
});
