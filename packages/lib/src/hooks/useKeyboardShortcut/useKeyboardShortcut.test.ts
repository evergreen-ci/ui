import { describe, expect, it, vi } from "vitest";
import { CharKey, ModifierKey } from "../../constants/keys";
import { renderHook } from "../../test_utils";
import { useKeyboardShortcut } from ".";

vi.mock("analytics", () => ({
  useShortcutAnalytics: () => ({
    sendEvent: vi.fn(),
  }),
}));

describe("useKeyboardShortcut", () => {
  it("should call callback when the specified key is pressed", () => {
    const mockCallback = vi.fn();
    renderHook(() => useKeyboardShortcut({ charKey: CharKey.A }, mockCallback));

    const keyEvent = new KeyboardEvent("keydown", { key: "a" });
    document.dispatchEvent(keyEvent);

    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  it("should call callback when key combination is pressed", () => {
    const mockCallback = vi.fn();
    renderHook(() =>
      useKeyboardShortcut(
        {
          charKey: CharKey.A,
          modifierKeys: [ModifierKey.Control],
        },
        mockCallback,
      ),
    );

    const keyEvent = new KeyboardEvent("keydown", { key: "a", ctrlKey: true });
    document.dispatchEvent(keyEvent);

    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  it("should not call callback when component is disabled", () => {
    const mockCallback = vi.fn();
    renderHook(() =>
      useKeyboardShortcut({ charKey: CharKey.A }, mockCallback, {
        disabled: true,
      }),
    );

    const keyEvent = new KeyboardEvent("keydown", { key: "a" });
    document.dispatchEvent(keyEvent);

    expect(mockCallback).not.toHaveBeenCalled();
  });
});
