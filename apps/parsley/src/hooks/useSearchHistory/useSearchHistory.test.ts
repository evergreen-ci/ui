import { act, renderHook } from "@testing-library/react";
import { __testing__, useSearchHistory } from ".";

describe("useSearchHistory", () => {
  // Mock localStorage for Vitest
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("loads history from localStorage on mount", () => {
    localStorage.setItem(
      __testing__.SEARCH_HISTORY_KEY,
      JSON.stringify(["apple", "banana"]),
    );
    const { result } = renderHook(() => useSearchHistory());
    expect(result.current.searchHistory).toEqual(["apple", "banana"]);
  });

  it("starts with empty history if nothing in localStorage", () => {
    const { result } = renderHook(() => useSearchHistory());
    expect(result.current.searchHistory).toEqual([]);
  });

  it("adds to history and stores only up to MAX_HISTORY_ITEMS", () => {
    const { result } = renderHook(() => useSearchHistory());
    act(() => {
      result.current.addToHistory("first");
      result.current.addToHistory("second");
      result.current.addToHistory("third");
      result.current.addToHistory("fourth");
      result.current.addToHistory("fifth");
      result.current.addToHistory("sixth");
    });
    expect(result.current.searchHistory).toHaveLength(
      __testing__.MAX_HISTORY_ITEMS,
    );
    expect(result.current.searchHistory[0]).toBe("sixth");
    expect(result.current.searchHistory).not.toContain("first");
  });

  it("dedupes entries and moves to top if re-added", () => {
    const { result } = renderHook(() => useSearchHistory());
    act(() => {
      result.current.addToHistory("query1");
      result.current.addToHistory("query2");
      result.current.addToHistory("query1"); // re-adds
    });
    expect(result.current.searchHistory[0]).toBe("query1");
    expect(result.current.searchHistory).toEqual(["query1", "query2"]);
  });

  it("does not add empty or whitespace-only searches", () => {
    const { result } = renderHook(() => useSearchHistory());
    act(() => {
      result.current.addToHistory("");
      result.current.addToHistory("   ");
      result.current.addToHistory("real");
    });
    expect(result.current.searchHistory).toEqual(["real"]);
  });

  it("combines history with suggestions without duplicates", () => {
    const { result } = renderHook(() => useSearchHistory());
    act(() => {
      result.current.addToHistory("a");
      result.current.addToHistory("b");
    });
    const combined = result.current.combineWithSuggestions(["b", "c"]);
    expect(combined).toEqual(["b", "a", "c"]);
  });

  it("updates localStorage when searchHistory changes", () => {
    const setItemSpy = vi.spyOn(localStorage.__proto__, "setItem");
    const { result } = renderHook(() => useSearchHistory());
    act(() => {
      result.current.addToHistory("saveTest");
    });
    expect(setItemSpy).toHaveBeenCalledWith(
      __testing__.SEARCH_HISTORY_KEY,
      JSON.stringify(["saveTest"]),
    );
  });
});
