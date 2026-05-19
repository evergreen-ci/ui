import "@testing-library/jest-dom/vitest";
import "vitest-canvas-mock";
import { vi } from "vitest";

// Dummy values for environment variables used in the app.
process.env.REACT_APP_EVERGREEN_URL = "http://test-evergreen.com";
process.env.REACT_APP_GRAPHQL_URL = "http://test-graphql.com";
process.env.REACT_APP_SPRUCE_URL = "http://test-spruce.com";

if (process.env.CI) {
  // Avoid printing debug statements when running tests.
  vi.spyOn(console, "debug").mockImplementation(() => {});
  // Avoid printing error statements when running tests.
  vi.spyOn(console, "error").mockImplementation(() => {});
  // Avoid printing analytics events when running tests, but print any other console.log statements.
  const consoleLog = console.log;
  console.log = (message: string) => {
    if (message.startsWith("ANALYTICS EVENT")) {
      return;
    }
    consoleLog(message);
  };
}

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
globalThis.jest = vi;

beforeEach(() => {
  // LeafyGreen tables require an IntersectionObserver.
  const mockIntersectionObserver = vi.fn(function () {
    return {
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    };
  });
  vi.stubGlobal("IntersectionObserver", mockIntersectionObserver);

  const mockResizeObserver = vi.fn(function () {
    return {
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    };
  });
  vi.stubGlobal("ResizeObserver", mockResizeObserver);

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

  // jsdom 28 recognizes the popover attribute (hiding elements by default)
  // but doesn't fully implement showPopover/hidePopover.
  HTMLElement.prototype.showPopover = vi.fn(function mock(this: HTMLElement) {
    this.style.display = "block";
  });

  HTMLElement.prototype.hidePopover = vi.fn(function mock(this: HTMLElement) {
    this.style.display = "";
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
});
