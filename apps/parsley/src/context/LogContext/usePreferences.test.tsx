import Cookie from "js-cookie";
import { MemoryRouter } from "react-router-dom";
import { MockInstance } from "vitest";
import { act, renderHook } from "@evg-ui/lib/test_utils";
import { FilterLogic, WordWrapFormat } from "constants/enums";
import {
  getInitialState,
  preferencesReducer,
  usePreferences,
} from "./usePreferences";

vi.mock("js-cookie");
const mockedGet = vi.spyOn(Cookie, "get") as MockInstance;
const mockedSet = vi.spyOn(Cookie, "set") as MockInstance;

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <MemoryRouter initialEntries={["/"]}>{children}</MemoryRouter>
);

describe("usePreferences", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedGet.mockReturnValue(undefined);
  });

  describe("initial state", () => {
    it("should initialize with default values when no cookies are set", () => {
      const { result } = renderHook(() => usePreferences(), { wrapper });

      expect(result.current.caseSensitive).toBe(false);
      expect(result.current.expandableRows).toBe(true);
      expect(result.current.filterLogic).toBe(FilterLogic.And);
      expect(result.current.highlightFilters).toBe(false);
      expect(result.current.prettyPrint).toBe(false);
      expect(result.current.stickyHeaders).toBe(false);
      expect(result.current.wordWrapFormat).toBe(WordWrapFormat.Standard);
      expect(result.current.wrap).toBe(false);
      expect(result.current.zebraStriping).toBe(false);
    });

    it("should initialize caseSensitive from cookie", () => {
      mockedGet.mockImplementation((key: string) =>
        key === "case-sensitive" ? "true" : undefined,
      );
      const { result } = renderHook(() => usePreferences(), { wrapper });
      expect(result.current.caseSensitive).toBe(true);
    });

    it("should initialize expandableRows from cookie", () => {
      mockedGet.mockImplementation((key: string) =>
        key === "expandable-rows" ? "false" : undefined,
      );
      const { result } = renderHook(() => usePreferences(), { wrapper });
      expect(result.current.expandableRows).toBe(false);
    });

    it("should initialize filterLogic from cookie", () => {
      mockedGet.mockImplementation((key: string) =>
        key === "filter-logic" ? FilterLogic.Or : undefined,
      );
      const { result } = renderHook(() => usePreferences(), { wrapper });
      expect(result.current.filterLogic).toBe(FilterLogic.Or);
    });

    it("should initialize wordWrapFormat from cookie", () => {
      mockedGet.mockImplementation((key: string) =>
        key === "wrap-format" ? WordWrapFormat.Aggressive : undefined,
      );
      const { result } = renderHook(() => usePreferences(), { wrapper });
      expect(result.current.wordWrapFormat).toBe(WordWrapFormat.Aggressive);
    });
  });

  describe("setting preferences", () => {
    it("should update caseSensitive and persist to cookie", () => {
      const { result } = renderHook(() => usePreferences(), { wrapper });
      expect(result.current.caseSensitive).toBe(false);

      act(() => {
        result.current.setCaseSensitive(true);
      });

      expect(result.current.caseSensitive).toBe(true);
      expect(mockedSet).toHaveBeenCalledWith("case-sensitive", "true", {
        expires: 365,
      });
    });

    it("should update highlightFilters and persist to cookie", () => {
      const { result } = renderHook(() => usePreferences(), { wrapper });
      expect(result.current.highlightFilters).toBe(false);

      act(() => {
        result.current.setHighlightFilters(true);
      });

      expect(result.current.highlightFilters).toBe(true);
      expect(mockedSet).toHaveBeenCalledWith("highlight-filters", "true", {
        expires: 365,
      });
    });

    it("should update prettyPrint and persist to cookie", () => {
      const { result } = renderHook(() => usePreferences(), { wrapper });
      expect(result.current.prettyPrint).toBe(false);

      act(() => {
        result.current.setPrettyPrint(true);
      });

      expect(result.current.prettyPrint).toBe(true);
      expect(mockedSet).toHaveBeenCalledWith("pretty-print-bookmarks", "true", {
        expires: 365,
      });
    });

    it("should update stickyHeaders and persist to cookie", () => {
      const { result } = renderHook(() => usePreferences(), { wrapper });
      expect(result.current.stickyHeaders).toBe(false);

      act(() => {
        result.current.setStickyHeaders(true);
      });

      expect(result.current.stickyHeaders).toBe(true);
      expect(mockedSet).toHaveBeenCalledWith("sticky-headers", "true", {
        expires: 365,
      });
    });

    it("should update wordWrapFormat and persist to cookie", () => {
      const { result } = renderHook(() => usePreferences(), { wrapper });
      expect(result.current.wordWrapFormat).toBe(WordWrapFormat.Standard);

      act(() => {
        result.current.setWordWrapFormat(WordWrapFormat.Aggressive);
      });

      expect(result.current.wordWrapFormat).toBe(WordWrapFormat.Aggressive);
      expect(mockedSet).toHaveBeenCalledWith("wrap-format", "aggressive", {
        expires: 365,
      });
    });

    it("should update wrap and persist to cookie", () => {
      const { result } = renderHook(() => usePreferences(), { wrapper });
      expect(result.current.wrap).toBe(false);

      act(() => {
        result.current.setWrap(true);
      });

      expect(result.current.wrap).toBe(true);
      expect(mockedSet).toHaveBeenCalledWith("wrap", "true", {
        expires: 365,
      });
    });

    it("should update zebraStriping and persist to cookie", () => {
      const { result } = renderHook(() => usePreferences(), { wrapper });
      expect(result.current.zebraStriping).toBe(false);

      act(() => {
        result.current.setZebraStriping(true);
      });

      expect(result.current.zebraStriping).toBe(true);
      expect(mockedSet).toHaveBeenCalledWith("zebra-striping", "true", {
        expires: 365,
      });
    });

    it("should update expandableRows and persist to cookie", () => {
      const { result } = renderHook(() => usePreferences(), { wrapper });
      expect(result.current.expandableRows).toBe(true);

      act(() => {
        result.current.setExpandableRows(false);
      });

      expect(result.current.expandableRows).toBe(false);
      expect(mockedSet).toHaveBeenCalledWith("expandable-rows", "false", {
        expires: 365,
      });
    });

    it("should update filterLogic and persist to cookie", () => {
      const { result } = renderHook(() => usePreferences(), { wrapper });
      expect(result.current.filterLogic).toBe(FilterLogic.And);

      act(() => {
        result.current.setFilterLogic(FilterLogic.Or);
      });

      expect(result.current.filterLogic).toBe(FilterLogic.Or);
      expect(mockedSet).toHaveBeenCalledWith("filter-logic", "or", {
        expires: 365,
      });
    });
  });
});

describe("preferencesReducer", () => {
  it("should handle SET_CASE_SENSITIVE action", () => {
    const initialState = getInitialState();
    const newState = preferencesReducer(initialState, {
      type: "SET_CASE_SENSITIVE",
      value: true,
    });
    expect(newState.caseSensitive).toBe(true);
  });

  it("should handle SET_HIGHLIGHT_FILTERS action", () => {
    const initialState = getInitialState();
    const newState = preferencesReducer(initialState, {
      type: "SET_HIGHLIGHT_FILTERS",
      value: true,
    });
    expect(newState.highlightFilters).toBe(true);
  });

  it("should handle SET_PRETTY_PRINT action", () => {
    const initialState = getInitialState();
    const newState = preferencesReducer(initialState, {
      type: "SET_PRETTY_PRINT",
      value: true,
    });
    expect(newState.prettyPrint).toBe(true);
  });

  it("should handle SET_STICKY_HEADERS action", () => {
    const initialState = getInitialState();
    const newState = preferencesReducer(initialState, {
      type: "SET_STICKY_HEADERS",
      value: true,
    });
    expect(newState.stickyHeaders).toBe(true);
  });

  it("should handle SET_WORD_WRAP_FORMAT action", () => {
    const initialState = getInitialState();
    const newState = preferencesReducer(initialState, {
      type: "SET_WORD_WRAP_FORMAT",
      value: WordWrapFormat.Aggressive,
    });
    expect(newState.wordWrapFormat).toBe(WordWrapFormat.Aggressive);
  });

  it("should handle SET_WRAP action", () => {
    const initialState = getInitialState();
    const newState = preferencesReducer(initialState, {
      type: "SET_WRAP",
      value: true,
    });
    expect(newState.wrap).toBe(true);
  });

  it("should handle SET_ZEBRA_STRIPING action", () => {
    const initialState = getInitialState();
    const newState = preferencesReducer(initialState, {
      type: "SET_ZEBRA_STRIPING",
      value: true,
    });
    expect(newState.zebraStriping).toBe(true);
  });

  it("should return current state for unknown action", () => {
    const initialState = getInitialState();
    // @ts-expect-error - Testing unknown action type
    const newState = preferencesReducer(initialState, { type: "UNKNOWN" });
    expect(newState).toBe(initialState);
  });
});

describe("getInitialState", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedGet.mockReturnValue(undefined);
  });

  it("should return default values when no cookies exist", () => {
    const state = getInitialState();
    expect(state).toEqual({
      caseSensitive: false,
      highlightFilters: false,
      prettyPrint: false,
      stickyHeaders: false,
      wordWrapFormat: WordWrapFormat.Standard,
      wrap: false,
      zebraStriping: false,
    });
  });

  it("should read boolean preferences from cookies", () => {
    mockedGet.mockImplementation((key: string) => {
      const cookies: Record<string, string> = {
        "case-sensitive": "true",
        "highlight-filters": "true",
        "sticky-headers": "true",
        "zebra-striping": "true",
      };
      return cookies[key];
    });

    const state = getInitialState();
    expect(state.caseSensitive).toBe(true);
    expect(state.highlightFilters).toBe(true);
    expect(state.stickyHeaders).toBe(true);
    expect(state.zebraStriping).toBe(true);
  });

  it("should read wordWrapFormat from cookie", () => {
    mockedGet.mockImplementation((key: string) =>
      key === "wrap-format" ? WordWrapFormat.Aggressive : undefined,
    );

    const state = getInitialState();
    expect(state.wordWrapFormat).toBe(WordWrapFormat.Aggressive);
  });
});
