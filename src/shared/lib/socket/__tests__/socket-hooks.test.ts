import { iocContainer } from "@shared/lib/di";
import { act, render, renderHook, screen } from "@testing-library/react";
import { createElement, useLayoutEffect } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useSocketEvent, useSocketRoom, useSocketStatus } from "../hooks";
import { createFakeSocket, type IFakeSocket } from "../testing";
import {
  ISocketTransport,
  type SocketStatusListener,
  type SocketTransportState,
} from "../transport";

let socket: IFakeSocket;

beforeEach(() => {
  socket = createFakeSocket();
  iocContainer.bind(ISocketTransport.Tid).toConstantValue(socket);
});

afterEach(() => {
  iocContainer.unbind(ISocketTransport.Tid);
});

const rooms = (event: string) =>
  socket.emitted.filter(item => item.event === event).map(item => item.args[0]);

describe("useSocketEvent", () => {
  it("вызывает свежий обработчик и отписывается при размонтировании", () => {
    const first = vi.fn();
    const second = vi.fn();
    const hook = renderHook(
      ({ handler }) => useSocketEvent<[number]>("tick", handler),
      { initialProps: { handler: first } },
    );

    hook.rerender({ handler: second });
    socket.fire("tick", 1);
    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledWith(1);

    hook.unmount();
    socket.fire("tick", 2);
    expect(second).toHaveBeenCalledOnce();
  });

  it("не подписывается при enabled: false", () => {
    const handler = vi.fn();

    renderHook(() => useSocketEvent("tick", handler, false));
    socket.fire("tick");

    expect(handler).not.toHaveBeenCalled();
  });
});

describe("useSocketRoom", () => {
  it("входит в комнату, при смене id переходит в новую, без id не входит", () => {
    const onRejoin = vi.fn();
    const hook = renderHook(
      ({ id }: { id: string | null }) => useSocketRoom("chat", id, onRejoin),
      { initialProps: { id: "a" as string | null } },
    );

    hook.rerender({ id: "b" });
    expect(rooms("room:subscribe")).toEqual([
      { type: "chat", id: "a" },
      { type: "chat", id: "b" },
    ]);
    expect(rooms("room:unsubscribe")).toEqual([{ type: "chat", id: "a" }]);

    socket.reconnect();
    expect(onRejoin).toHaveBeenCalledOnce();

    hook.rerender({ id: null });
    expect(rooms("room:unsubscribe")).toHaveLength(2);
    expect(rooms("room:subscribe")).toHaveLength(3);
  });
});

describe("useSocketStatus", () => {
  /** Статус сокета, который тест меняет вручную. */
  const withStatus = (initial: SocketTransportState["status"]) => {
    const listeners = new Set<SocketStatusListener>();
    let state: SocketTransportState = { status: initial, error: null };

    Object.defineProperty(socket, "state", { get: () => state });
    socket.onStatusChange = listener => {
      listeners.add(listener);

      return () => listeners.delete(listener);
    };

    return (status: SocketTransportState["status"]) => {
      state = { status, error: null };
      listeners.forEach(listener => listener(state));
    };
  };

  it("следует за сменой статуса и отписывается при размонтировании", () => {
    const setStatus = withStatus("connecting");
    const hook = renderHook(() => useSocketStatus().status);

    expect(hook.result.current).toBe("connecting");

    act(() => setStatus("connected"));
    expect(hook.result.current).toBe("connected");

    hook.unmount();
    expect(() => setStatus("error")).not.toThrow();
  });

  it("не теряет смену статуса между рендером и подпиской", () => {
    const setStatus = withStatus("connecting");
    const Status = () =>
      createElement("output", null, useSocketStatus().status);
    const Changer = () => {
      useLayoutEffect(() => setStatus("connected"), []);

      return null;
    };

    render(
      createElement("div", null, createElement(Status), createElement(Changer)),
    );

    expect(screen.getByRole("status").textContent).toBe("connected");
  });
});
