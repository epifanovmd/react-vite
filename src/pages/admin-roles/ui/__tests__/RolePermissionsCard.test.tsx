import type { IRoleDto } from "@shared/api/gen/main/model";
import { TooltipProvider } from "@shared/ui";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { RolePermissionsCard } from "../RolePermissionsCard";

vi.mock("@entities/permission", () => ({
  PermissionMatrix: ({
    value,
    onChange,
  }: {
    value: string[];
    onChange: (next: string[]) => void;
  }) => (
    <div>
      <span data-testid="selected">{value.join(",")}</span>
      <button type="button" onClick={() => onChange([...value, "b"])}>
        добавить b
      </button>
    </div>
  ),
}));

const role = (permissions: string[]) =>
  ({
    id: "r1",
    name: "moderator",
    permissions: permissions.map(name => ({ name })),
  }) as unknown as IRoleDto;

const card = (value: IRoleDto) => (
  <TooltipProvider>
    <RolePermissionsCard
      role={value}
      canUpdate
      canDelete={false}
      canGrantAll
      onSave={vi.fn()}
      onDelete={vi.fn()}
    />
  </TooltipProvider>
);

describe("RolePermissionsCard", () => {
  it("новый объект роли с тем же набором прав не стирает несохранённые правки", () => {
    const { rerender } = render(card(role(["a"])));

    fireEvent.click(screen.getByRole("button", { name: "добавить b" }));
    rerender(card(role(["a"])));

    expect(screen.getByTestId("selected")).toHaveTextContent("a,b");
    expect(screen.getByRole("button", { name: "Сохранить" })).toBeEnabled();
  });

  it("набор прав роли изменился — показывается новый", () => {
    const { rerender } = render(card(role(["a"])));

    fireEvent.click(screen.getByRole("button", { name: "добавить b" }));
    rerender(card(role(["c"])));

    expect(screen.getByTestId("selected")).toHaveTextContent(/^c$/);
    expect(screen.getByRole("button", { name: "Сохранить" })).toBeDisabled();
  });
});
