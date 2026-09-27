const KB = 1024;
const MB = KB * 1024;
const GB = MB * 1024;

/** Размер файла по-русски: «1.4 ГБ», «12.3 МБ», «300 КБ». */
export const formatBytes = (bytes: number): string => {
  if (bytes >= GB) return `${(bytes / GB).toFixed(1)} ГБ`;
  if (bytes >= MB) return `${(bytes / MB).toFixed(1)} МБ`;

  return `${Math.max(1, Math.round(bytes / KB))} КБ`;
};
