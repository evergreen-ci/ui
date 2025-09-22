import "vitest";

interface CustomMatchers<R = unknown> {
  toBeHeader: (expected: object) => R;
}

declare module "vitest" {
  interface Matchers<T = any> extends CustomMatchers<T> {}
}
