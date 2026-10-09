import type { IAgentFetchBody } from "@shared/api/gen/main/model";
import type { ITokenSource } from "@shared/lib/http";

/** Заголовок со статусом ответа воркера; без него ответ — ошибка API. */
export const WORKER_STATUS_HEADER = "x-agent-worker-status";

/** Начало ответа: статус и заголовки. */
export interface IWorkerFetchHead {
  /** HTTP-статус ответа сервера. */
  status: number;
  statusText: string;
  headers: Record<string, string>;
  /**
   * Статус ответа воркера (`X-Agent-Worker-Status`); `null` — до воркера
   * запрос не дошёл, тело — ошибка API `{ code, message }`.
   */
  workerStatus: number | null;
}

const workerStatusOf = (headers: Record<string, string>): number | null => {
  const value = Number(headers[WORKER_STATUS_HEADER]);

  return headers[WORKER_STATUS_HEADER] && Number.isInteger(value)
    ? value
    : null;
};

export interface IStreamWorkerFetchParams {
  baseUrl: string;
  /** Откуда взять access-токен и как обновить его после 401. */
  tokens: ITokenSource;
  agentId: string;
  worker: string;
  body: IAgentFetchBody;
  signal: AbortSignal;
  onHead: (head: IWorkerFetchHead) => void;
  onChunk: (chunk: Uint8Array) => void;
}

export type TStreamWorkerFetchResult =
  | { data: true; error?: undefined }
  | { data?: undefined; error: { message: string; isCanceled: boolean } };

const headersOf = (response: Response): Record<string, string> => {
  const headers: Record<string, string> = {};

  response.headers.forEach((value, name) => {
    headers[name] = value;
  });

  return headers;
};

const send = (params: IStreamWorkerFetchParams): Promise<Response> =>
  fetch(
    `${params.baseUrl}/api/v1/agents/${encodeURIComponent(params.agentId)}/workers/${encodeURIComponent(params.worker)}/fetch`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
        ...(params.tokens.accessToken && {
          Authorization: `Bearer ${params.tokens.accessToken}`,
        }),
      },
      body: JSON.stringify(params.body),
      signal: params.signal,
    },
  );

/**
 * Запрос к воркеру через агента с чтением ответа по мере прихода: сначала
 * статус и заголовки (`onHead`), затем куски тела (`onChunk`). Сгенерированный
 * клиент отдаёт тело только целиком, поэтому здесь — `fetch` с потоком.
 * Исключений не бросает: итог — `{ data }` или `{ error }`.
 */
export const streamWorkerFetch = async (
  params: IStreamWorkerFetchParams,
): Promise<TStreamWorkerFetchResult> => {
  try {
    await params.tokens.ensureFreshToken();

    let response = await send(params);

    // Токен устарел между проверкой и запросом — обновить и повторить один раз.
    if (response.status === 401) {
      await params.tokens.refreshToken();
      response = await send(params);
    }

    const headers = headersOf(response);

    params.onHead({
      status: response.status,
      statusText: response.statusText,
      headers,
      workerStatus: workerStatusOf(headers),
    });

    const reader = response.body?.getReader();

    if (reader) {
      for (;;) {
        const { done, value } = await reader.read();

        if (done) break;
        if (value) params.onChunk(value);
      }
    }

    return { data: true };
  } catch (error) {
    const isCanceled = params.signal.aborted;

    return {
      error: {
        isCanceled,
        message: isCanceled
          ? "Запрос отменён"
          : error instanceof Error
            ? error.message
            : "Ошибка сети",
      },
    };
  }
};
