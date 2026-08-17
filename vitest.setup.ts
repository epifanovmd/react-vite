import "@testing-library/jest-dom/vitest";

import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

(globalThis as { __TEST_RUNTIME__?: typeof vi }).__TEST_RUNTIME__ = vi;

afterEach(() => {
  cleanup();
});
