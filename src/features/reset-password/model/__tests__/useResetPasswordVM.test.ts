import { IMainApi } from "@shared/api";
import { iocContainer } from "@shared/lib/di";
import {
  CanceledError,
  HttpError,
  NetworkError,
  TimeoutError,
} from "@shared/lib/http";
import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { useResetPasswordVM } from "../useResetPasswordVM";

const setup = (response: unknown) => {
  const api = { resetPassword: vi.fn().mockResolvedValue(response) };
  const onSuccess = vi.fn();

  iocContainer.bind(IMainApi.Tid).toConstantValue(api);

  const { result } = renderHook(() =>
    useResetPasswordVM({ token: "t-1", onSuccess }),
  );

  return { api, onSuccess, result };
};

const submit = (result: ReturnType<typeof setup>["result"]) =>
  act(() =>
    result.current.submit({ password: "secret1", confirmPassword: "secret1" }),
  );

afterEach(() => {
  iocContainer.unbind(IMainApi.Tid);
});

describe("useResetPasswordVM", () => {
  it("ошибка 4xx (токен истёк) — сообщение в форме", async () => {
    const { result, onSuccess } = setup({
      error: new HttpError({ status: 400, message: "Ссылка устарела" }),
    });

    await submit(result);

    expect(result.current.error).toBe("Ссылка устарела");
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it.each([
    ["сеть", new NetworkError("Нет соединения")],
    ["таймаут", new TimeoutError("Таймаут")],
    ["5xx", new HttpError({ status: 503, message: "Сервер недоступен" })],
    ["отмена", new CanceledError()],
  ])(
    "%s — не дублируется в форме: её уже показал глобальный тост",
    async (_, error) => {
      const { result, onSuccess } = setup({ error });

      await submit(result);

      expect(result.current.error).toBeNull();
      expect(onSuccess).not.toHaveBeenCalled();
    },
  );

  it("успех — onSuccess, ошибки нет", async () => {
    const { api, result, onSuccess } = setup({ data: undefined });

    await submit(result);

    expect(api.resetPassword).toHaveBeenCalledWith({
      token: "t-1",
      password: "secret1",
    });
    expect(onSuccess).toHaveBeenCalled();
    expect(result.current.error).toBeNull();
  });
});
