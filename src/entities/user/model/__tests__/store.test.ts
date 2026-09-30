import type { UserDto } from "@shared/api/gen/main/model";
import { describe, expect, it } from "vitest";

import { UserStore } from "../store";

const userDto = (id: string, roles: string[], direct: string[]) =>
  ({
    id,
    roles: roles.map(name => ({ id: name, name, permissions: [] })),
    directPermissions: direct.map(name => ({ name })),
  }) as unknown as UserDto;

const createStore = (user: UserDto) => {
  const store = new UserStore({} as never);

  store.seed(user);

  return store;
};

describe("UserStore: область прав", () => {
  it("scope — все, свои или нет; роль admin — на все", () => {
    const store = createStore(userDto("u1", ["user"], ["file:update:own"]));

    expect(store.scope("file:update")).toBe("own");
    expect(store.scope("file:delete")).toBe(null);
    expect(createStore(userDto("u1", ["admin"], [])).scope("x:y")).toBe("all");
  });

  it("canOn — право на все или своя сущность", () => {
    const store = createStore(
      userDto("u1", ["user"], ["file:update:own", "file:view"]),
    );

    expect(store.canOn("file:update", ["u1", null])).toBe(true);
    expect(store.canOn("file:update", ["u2"])).toBe(false);
    expect(store.canOn("file:view", ["u2"])).toBe(true);
    expect(store.canOn("file:delete", ["u1"])).toBe(false);
  });

  it("accessKey меняется вместе с правами", () => {
    const store = createStore(userDto("u1", ["user"], []));
    const before = store.accessKey;

    store.seed(userDto("u1", ["user"], ["file:view"]));

    expect(store.accessKey).not.toBe(before);
  });
});
