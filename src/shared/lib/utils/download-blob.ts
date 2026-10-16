/** Задержка отзыва object URL: Firefox/Safari начинают загрузку асинхронно после `click()`. */
const REVOKE_DELAY_MS = 1000;

export const downloadBlob = (blob: Blob, name: string) => {
  const href = URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = href;
  link.setAttribute("download", name);
  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(href), REVOKE_DELAY_MS);
};
