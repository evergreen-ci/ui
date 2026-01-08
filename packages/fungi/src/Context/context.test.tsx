import { act, createWrapper, renderHook } from "@evg-ui/lib/test_utils";
import { ContextChip } from "./context";
import { ChatProvider, useChatContext } from ".";

describe("useChatContext", () => {
  it("updates context state with hook function", () => {
    const { result } = renderHook(() => useChatContext(), {
      wrapper: createWrapper(ChatProvider, { appName: "Parsley AI" }),
    });

    expect(result.current.drawerOpen).toBe(false);
    act(() => {
      result.current.setDrawerOpen(true);
    });
    expect(result.current.drawerOpen).toBe(true);
  });

  describe("chips", () => {
    const chip1: ContextChip = {
      content: "console.log('test')",
      identifier: "test-1",
      badgeLabel: "Line 1",
    };

    const chip2: ContextChip = {
      content: "const x = 42;",
      identifier: "test-2",
      badgeLabel: "Lines 5-6",
    };

    it("starts with empty chips array", () => {
      const { result } = renderHook(() => useChatContext(), {
        wrapper: createWrapper(ChatProvider, { appName: "Parsley AI" }),
      });
      expect(result.current.chips).toEqual([]);
    });

    it("can remove & add chips via toggleChip", () => {
      const { result } = renderHook(() => useChatContext(), {
        wrapper: createWrapper(ChatProvider, { appName: "Parsley AI" }),
      });
      act(() => {
        result.current.toggleChip(chip1);
      });
      expect(result.current.chips).toEqual([chip1]);
      act(() => {
        result.current.toggleChip(chip1);
      });
      expect(result.current.chips).toEqual([]);
    });

    it("adds multiple chips with different identifiers", () => {
      const { result } = renderHook(() => useChatContext(), {
        wrapper: createWrapper(ChatProvider, { appName: "Parsley AI" }),
      });
      act(() => {
        result.current.toggleChip(chip1);
        result.current.toggleChip(chip2);
      });
      expect(result.current.chips).toHaveLength(2);
      expect(result.current.chips).toContain(chip1);
      expect(result.current.chips).toContain(chip2);
    });

    it("clears all chips when clearChips is called", () => {
      const { result } = renderHook(() => useChatContext(), {
        wrapper: createWrapper(ChatProvider, { appName: "Parsley AI" }),
      });
      act(() => {
        result.current.toggleChip(chip1);
        result.current.toggleChip(chip2);
      });
      expect(result.current.chips).toHaveLength(2);
      act(() => {
        result.current.clearChips();
      });
      expect(result.current.chips).toEqual([]);
    });
  });
});
