export interface ThrowingBlockProps {
  shouldThrow: boolean;
}

/** Демонстрационный блок: бросает ошибку при рендере по флагу. */
export const ThrowingBlock = ({ shouldThrow }: ThrowingBlockProps) => {
  if (shouldThrow) {
    throw new Error("Демонстрационная ошибка рендера");
  }

  return (
    <p className="text-sm text-muted-foreground">
      Содержимое отрисовано без ошибок.
    </p>
  );
};
