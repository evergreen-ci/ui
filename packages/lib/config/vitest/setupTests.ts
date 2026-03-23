import "@testing-library/jest-dom/vitest";
import "vitest-canvas-mock";
import { vi } from "vitest";

// @ts-expect-error: Workaround for a bug in @testing-library/react.
// It prevents Vitest's fake timers from functioning with user-event.
// https://github.com/testing-library/react-testing-library/issues/1197
globalThis.jest = vi;

beforeEach(() => {
  // jsdom 28 recognizes the popover attribute (hiding elements by default)
  // but doesn't fully implement showPopover/hidePopover.
  HTMLElement.prototype.showPopover = vi.fn(function mock(this: HTMLElement) {
    this.style.display = "block";
  });

  HTMLElement.prototype.hidePopover = vi.fn(function mock(this: HTMLElement) {
    this.style.display = "";
  });
});
