import { Button, ErrorBoundary } from "@shared/ui";
import { useState } from "react";

import { ThrowingBlock } from "./ThrowingBlock";

export const ErrorBoundaryDemo = () => {
  const [shouldThrow, setShouldThrow] = useState(false);
  const [attempt, setAttempt] = useState(0);

  const breakIt = () => setShouldThrow(true);

  const resetByKey = () => {
    setShouldThrow(false);
    setAttempt(value => value + 1);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant="destructive" onClick={breakIt}>
          Сломать
        </Button>
        <Button size="sm" variant="outline" onClick={resetByKey}>
          Сбросить через resetKeys
        </Button>
      </div>
      <div className="rounded-lg border p-4">
        <ErrorBoundary resetKeys={[attempt]}>
          <ThrowingBlock shouldThrow={shouldThrow} />
        </ErrorBoundary>
      </div>
    </div>
  );
};
