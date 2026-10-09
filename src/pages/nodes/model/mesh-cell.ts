import type { INodeMeshCellDto } from "@shared/api/gen/main/model";

const formatMs = (value: number): string =>
  value < 10 ? value.toFixed(1) : String(Math.round(value));

/**
 * Подсказка ячейки по последнему кругу проверки: ответы из запросов, потери,
 * задержка мин / сред / макс, чем проверено; ошибка и устаревание — отдельно.
 */
export const describeMeshCell = (cell: INodeMeshCellDto): string => {
  const method =
    cell.via && cell.via !== cell.method
      ? `${cell.method} → ${cell.via}`
      : cell.method;
  const rtt =
    cell.rttAvgMs === null
      ? "не отвечает"
      : `задержка ${[cell.rttMinMs, cell.rttAvgMs, cell.rttMaxMs]
          .map(value => (value === null ? "—" : formatMs(value)))
          .join(" / ")} мс`;
  const parts = [
    ...(cell.stale ? ["нет свежих данных"] : []),
    ...(cell.error ? [cell.error] : []),
    rtt,
    `ответов ${cell.received} из ${cell.sent}`,
    `потери ${cell.lossPct}%`,
    method,
  ];
  const text = parts.join(" · ");

  return text.charAt(0).toUpperCase() + text.slice(1);
};

/** Лучший путь до каждого узла: без потерь, со свежей проверкой, минимальный RTT. */
export const bestByTarget = (
  cells: INodeMeshCellDto[],
): Map<string, INodeMeshCellDto> => {
  const best = new Map<string, INodeMeshCellDto>();

  for (const cell of cells) {
    if (cell.rttAvgMs === null || cell.lossPct > 0 || cell.stale) continue;

    const current = best.get(cell.to);

    if (!current || cell.rttAvgMs < (current.rttAvgMs ?? Infinity)) {
      best.set(cell.to, cell);
    }
  }

  return best;
};

/** RTT в ячейке: целые мс, меньше 10 — с десятыми; без ответа — «×». */
export const formatRtt = (rtt: number | null): string =>
  rtt === null ? "×" : formatMs(rtt);
