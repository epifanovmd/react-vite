import { makeAutoObservable } from "mobx";

import type {
  IWorkerFetchHead,
  TStreamWorkerFetchResult,
} from "../api/stream-worker-fetch";
import { isTextBody } from "../lib/route-path";

/** Этап запроса к воркеру. */
export type TWorkerFetchState =
  "idle" | "sending" | "streaming" | "done" | "failed" | "cancelled";

/** Ошибка API: запрос не дошёл до воркера или агент не получил его ответ. */
export interface IWorkerFetchApiError {
  status: number;
  code: string | null;
  message: string;
  /** Подробности агента (`details.reason`): замечания к телу и т. п. */
  reason: string | null;
}

const parseApiError = (
  text: string | null,
): { code: string | null; message: string | null; reason: string | null } => {
  try {
    const body: unknown = JSON.parse(text ?? "");

    if (typeof body === "object" && body !== null) {
      const { code, message, details } = body as Record<string, unknown>;
      const reason =
        typeof details === "object" && details !== null
          ? (details as Record<string, unknown>).reason
          : undefined;

      return {
        code: typeof code === "string" ? code : null,
        message: typeof message === "string" ? message : null,
        reason: typeof reason === "string" ? reason : null,
      };
    }
  } catch {
    // Тело не JSON — показывается статус.
  }

  return { code: null, message: null, reason: null };
};

/** Сколько текста показывать; дальше тело только скачать. */
export const TEXT_PREVIEW_LIMIT = 1024 * 1024;

/** Что делает запрос: принимает обработчики начала и кусков ответа. */
export type TWorkerFetchRunner = (handlers: {
  signal: AbortSignal;
  onHead: (head: IWorkerFetchHead) => void;
  onChunk: (chunk: Uint8Array) => void;
}) => Promise<TStreamWorkerFetchResult>;

/**
 * Один запрос к воркеру и его ответ по мере прихода: статус и заголовки,
 * текст (если тело текстовое) или только размер, итог и длительность. Новый
 * запрос отменяет прежний.
 */
export class WorkerFetchSession {
  state: TWorkerFetchState = "idle";
  /** Метод и путь последнего запроса. */
  request: string | null = null;
  head: IWorkerFetchHead | null = null;
  /** Тело текстом: `null` — двоичное. */
  text: string | null = "";
  /** Текст обрезан: тело больше `TEXT_PREVIEW_LIMIT`. */
  truncated = false;
  size = 0;
  error: string | null = null;
  startedAt: number | null = null;
  finishedAt: number | null = null;

  private _chunks: Uint8Array[] = [];
  private _decoder: TextDecoder | null = null;
  private _controller: AbortController | null = null;

  constructor() {
    makeAutoObservable<this, "_chunks" | "_decoder" | "_controller">(
      this,
      { _chunks: false, _decoder: false, _controller: false },
      { autoBind: true },
    );
  }

  get isRunning() {
    return this.state === "sending" || this.state === "streaming";
  }

  /** Ответ — ошибка API, а не воркера (нет `X-Agent-Worker-Status`). */
  get isApiError() {
    return !!this.head && this.head.workerStatus === null;
  }

  /** Ошибка API из тела `{ code, message }`; ответ воркера — `null`. */
  get apiError(): IWorkerFetchApiError | null {
    if (!this.head || !this.isApiError || this.isRunning) return null;

    const { code, message, reason } = parseApiError(this.text);

    return {
      status: this.head.status,
      code,
      message: message ?? (this.head.statusText || `HTTP ${this.head.status}`),
      reason,
    };
  }

  /** Сколько длился запрос (или длится), мс. */
  durationAt(now: number): number | null {
    if (this.startedAt === null) return null;

    return (this.finishedAt ?? now) - this.startedAt;
  }

  /** Тело целиком — для сохранения файлом. */
  blob(): Blob {
    return new Blob(this._chunks as BlobPart[], {
      type: this.head?.headers["content-type"] ?? "application/octet-stream",
    });
  }

  async start(request: string, run: TWorkerFetchRunner) {
    this._controller?.abort();

    const controller = new AbortController();

    this._controller = controller;
    this._reset(request);

    const res = await run({
      signal: controller.signal,
      onHead: head => this._onHead(controller, head),
      onChunk: chunk => this._onChunk(controller, chunk),
    });

    if (this._controller !== controller) return;
    this._finish(res);
  }

  cancel() {
    this._controller?.abort();
  }

  private _reset(request: string) {
    this.state = "sending";
    this.request = request;
    this.head = null;
    this.text = "";
    this.truncated = false;
    this.size = 0;
    this.error = null;
    this.startedAt = Date.now();
    this.finishedAt = null;
    this._chunks = [];
    this._decoder = null;
  }

  private _onHead(controller: AbortController, head: IWorkerFetchHead) {
    if (this._controller !== controller) return;
    this.head = head;
    this.state = "streaming";
  }

  private _onChunk(controller: AbortController, chunk: Uint8Array) {
    if (this._controller !== controller) return;

    if (this._chunks.length === 0) {
      const isText = isTextBody(this.head?.headers["content-type"], chunk);

      this._decoder = isText ? new TextDecoder() : null;
      this.text = isText ? "" : null;
    }

    this._chunks.push(chunk);
    this.size += chunk.byteLength;

    if (!this._decoder || this.text === null || this.truncated) return;

    const next = this.text + this._decoder.decode(chunk, { stream: true });

    if (next.length > TEXT_PREVIEW_LIMIT) {
      this.text = next.slice(0, TEXT_PREVIEW_LIMIT);
      this.truncated = true;
    } else {
      this.text = next;
    }
  }

  private _finish(res: TStreamWorkerFetchResult) {
    this.finishedAt = Date.now();
    this._controller = null;

    if (res.error) {
      this.state = res.error.isCanceled ? "cancelled" : "failed";
      this.error = res.error.message;

      return;
    }

    if (this._decoder && this.text !== null && !this.truncated) {
      this.text += this._decoder.decode();
    }
    this.state = "done";
  }
}
