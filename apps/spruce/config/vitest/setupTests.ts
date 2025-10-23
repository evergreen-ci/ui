// jest-dom adds custom matchers for asserting on DOM nodes. Works for Vitest too!
import "@testing-library/jest-dom";
import "vitest-canvas-mock";

// @ts-expect-error: Returning a basic string is acceptable for tests.
window.crypto.randomUUID = (() => {
  let value = 0;
  return () => {
    value += 1;
    return value.toString();
  };
})();

// @ts-expect-error: Workaround for a bug in @testing-library/react.
// It prevents Vitest's fake timers from functioning with user-event.
// https://github.com/testing-library/react-testing-library/issues/1197
globalThis.jest = {
  ...globalThis.jest,
  advanceTimersByTime: vi.advanceTimersByTime.bind(vi),
};

// LeafyGreen tables require an IntersectionObserver.
beforeEach(() => {
  const mockIntersectionObserver = vi.fn();
  mockIntersectionObserver.mockReturnValue({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  });
  vi.stubGlobal("IntersectionObserver", mockIntersectionObserver);

  // LeafyGreen modals require stubbing dialog
  // https://github.com/mongodb/leafygreen-ui/blob/22b4d8200b132f24b4cd1a7e4d99b0372ed6fd58/packages/modal/src/utils/getTestUtils.spec.tsx#L36-L54
  HTMLDialogElement.prototype.show = vi.fn(function mock(
    this: HTMLDialogElement,
  ) {
    this.open = true;
  });

  HTMLDialogElement.prototype.showModal = vi.fn(function mock(
    this: HTMLDialogElement,
  ) {
    this.open = true;
  });

  HTMLDialogElement.prototype.close = vi.fn(function mock(
    this: HTMLDialogElement,
  ) {
    this.open = false;
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
});
