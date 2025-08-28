import { act, renderHook } from "@evg-ui/lib/test_utils";
import { ChatProvider, useChatContext } from ".";

describe("useChatContext", () => {
  it("updates context state with hook function", () => {
    const { result } = renderHook(() => useChatContext(), {
      wrapper: ChatProvider,
    });

    expect(result.current.drawerOpen).toBe(false);
    act(() => {
      result.current.setDrawerOpen(true);
    });
    expect(result.current.drawerOpen).toBe(true);
  });
});
