import { createFakeSocket } from "@shared/lib/socket/testing";
import { describe, expect, it, vi } from "vitest";

import { JobRealtime } from "../job-realtime";

const setup = (isLoaded: boolean) => {
  const socket = createFakeSocket();
  const jobs = {
    isLoaded,
    byId: vi.fn(),
    upsert: vi.fn(),
    load: vi.fn(async () => undefined),
  };
  const notifications = { success: vi.fn(), error: vi.fn() };
  const dispose = new JobRealtime(
    socket,
    jobs as never,
    notifications as never,
  ).initialize();

  return { socket, jobs, dispose };
};

describe("JobRealtime — переподключение", () => {
  it("после обрыва список перечитывается: события за обрыв не теряются", () => {
    const { socket, jobs } = setup(true);

    socket.reconnect();

    expect(jobs.load).toHaveBeenCalledOnce();
  });

  it("список ещё не загружали — переподключение его не грузит", () => {
    const { socket, jobs } = setup(false);

    socket.reconnect();

    expect(jobs.load).not.toHaveBeenCalled();
  });

  it("первое подключение после initialize — не переподключение", () => {
    const socket = createFakeSocket();
    const jobs = { isLoaded: true, load: vi.fn(async () => undefined) };

    Object.assign(socket, { state: { status: "connecting", error: null } });
    new JobRealtime(socket, jobs as never, {} as never).initialize();

    socket.reconnect();
    expect(jobs.load).not.toHaveBeenCalled();

    socket.reconnect();
    expect(jobs.load).toHaveBeenCalledOnce();
  });

  it("после dispose переподключение не трогает стор", () => {
    const { socket, jobs, dispose } = setup(true);

    dispose();
    socket.reconnect();

    expect(jobs.load).not.toHaveBeenCalled();
  });
});
