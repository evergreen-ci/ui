import "vitest";
import "@testing-library/jest-dom/vitest";

interface CustomMatchers<R = unknown> {
  // Headers require a custom matcher because they lack the standard properties of an Object required for accurate comparison
  toBeHeader: (expected: object) => R;
}

declare module "vitest" {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface Matchers<T = unknown> extends CustomMatchers<T> {}
}
