import "vitest";

interface CustomMatchers<R = unknown> {
  // Headers require a custom matcher because they lack the standard properties of an Object required for accurate comparison
  toBeHeader: (expected: object) => R;
}

declare module "vitest" {
  interface Matchers<T = unknown> extends CustomMatchers<T> {}
}
