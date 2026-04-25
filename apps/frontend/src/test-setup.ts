import "@testing-library/jest-dom/vitest";
import { expect } from "vitest";
import type { AxeMatchers } from "vitest-axe/matchers";
import * as axeMatchers from "vitest-axe/matchers";

// vitest-axe@0.1.0's `extend-expect` entry ships an empty dist file,
// so the matcher isn't auto-registered. Wire it manually.
expect.extend(axeMatchers);

// biome-ignore lint/suspicious/noExplicitAny: matches Vitest's own Assertion<T = any> signature
declare module "vitest" {
  // biome-ignore lint/suspicious/noExplicitAny: matches Vitest's own Assertion<T = any> signature
  interface Assertion<T = any> extends AxeMatchers {}
  interface AsymmetricMatchersContaining extends AxeMatchers {}
}
