import { MemoryRouter } from "react-router-dom";
import { act, renderHook } from "@evg-ui/lib/test_utils";
import { FilterLogic, WordWrapFormat } from "constants/enums";
import {
  getInitialState,
  preferencesReducer,
  usePreferences,
} from "./usePreferences";

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <MemoryRouter initialEntries={["/"]}>{children}</MemoryRouter>
);

describe("usePreferences", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe("initial state", () => {
    it("should initialize with default values when no stored values are set", () => {
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

    it("should initialize caseSensitive from localStorage", () => {
      localStorage.setItem("case-sensitive", "true");
      const { result } = renderHook(() => usePreferences(), { wrapper });
      expect(result.current.caseSensitive).toBe(true);
    });

    it("should initialize expandableRows from localStorage", () => {
      localStorage.setItem("expandable-rows", "false");
      const { result } = renderHook(() => usePreferences(), { wrapper });
      expect(result.current.expandableRows).toBe(false);
    });

    it("should initialize filterLogic from localStorage", () => {
      localStorage.setItem("filter-logic", FilterLogic.Or);
      const { result } = renderHook(() => usePreferences(), { wrapper });
      expect(result.current.filterLogic).toBe(FilterLogic.Or);
    });

    it("should initialize wordWrapFormat from localStorage", () => {
      localStorage.setItem("wrap-format", WordWrapFormat.Aggressive);
      const { result } = renderHook(() => usePreferences(), { wrapper });
      expect(result.current.wordWrapFormat).toBe(WordWrapFormat.Aggressive);
    });
  });

  describe("setting preferences", () => {
    it("should update caseSensitive and persist to localStorage", () => {
      const { result } = renderHook(() => usePreferences(), { wrapper });
      expect(result.current.caseSensitive).toBe(false);

      act(() => {
        result.current.setCaseSensitive(true);
      });

      expect(result.current.caseSensitive).toBe(true);
      expect(localStorage.getItem("case-sensitive")).toBe("true");
    });

    it("should update highlightFilters and persist to localStorage", () => {
      const { result } = renderHook(() => usePreferences(), { wrapper });
      expect(result.current.highlightFilters).toBe(false);

      act(() => {
        result.current.setHighlightFilters(true);
      });

      expect(result.current.highlightFilters).toBe(true);
      expect(localStorage.getItem("highlight-filters")).toBe("true");
    });

    it("should update prettyPrint and persist to localStorage", () => {
      const { result } = renderHook(() => usePreferences(), { wrapper });
      expect(result.current.prettyPrint).toBe(false);

      act(() => {
        result.current.setPrettyPrint(true);
      });

      expect(result.current.prettyPrint).toBe(true);
      expect(localStorage.getItem("pretty-print-bookmarks")).toBe("true");
    });

    it("should update stickyHeaders and persist to localStorage", () => {
      const { result } = renderHook(() => usePreferences(), { wrapper });
      expect(result.current.stickyHeaders).toBe(false);

      act(() => {
        result.current.setStickyHeaders(true);
      });

      expect(result.current.stickyHeaders).toBe(true);
      expect(localStorage.getItem("sticky-headers")).toBe("true");
    });

    it("should update wordWrapFormat and persist to localStorage", () => {
      const { result } = renderHook(() => usePreferences(), { wrapper });
      expect(result.current.wordWrapFormat).toBe(WordWrapFormat.Standard);

      act(() => {
        result.current.setWordWrapFormat(WordWrapFormat.Aggressive);
      });

      expect(result.current.wordWrapFormat).toBe(WordWrapFormat.Aggressive);
      expect(localStorage.getItem("wrap-format")).toBe("aggressive");
    });

    it("should update wrap and persist to localStorage", () => {
      const { result } = renderHook(() => usePreferences(), { wrapper });
      expect(result.current.wrap).toBe(false);

      act(() => {
        result.current.setWrap(true);
      });

      expect(result.current.wrap).toBe(true);
      expect(localStorage.getItem("wrap")).toBe("true");
    });

    it("should update zebraStriping and persist to localStorage", () => {
      const { result } = renderHook(() => usePreferences(), { wrapper });
      expect(result.current.zebraStriping).toBe(false);

      act(() => {
        result.current.setZebraStriping(true);
      });

      expect(result.current.zebraStriping).toBe(true);
      expect(localStorage.getItem("zebra-striping")).toBe("true");
    });

    it("should update expandableRows and persist to localStorage", () => {
      const { result } = renderHook(() => usePreferences(), { wrapper });
      expect(result.current.expandableRows).toBe(true);

      act(() => {
        result.current.setExpandableRows(false);
      });

      expect(result.current.expandableRows).toBe(false);
      expect(localStorage.getItem("expandable-rows")).toBe("false");
    });

    it("should update filterLogic and persist to localStorage", () => {
      const { result } = renderHook(() => usePreferences(), { wrapper });
      expect(result.current.filterLogic).toBe(FilterLogic.And);

      act(() => {
        result.current.setFilterLogic(FilterLogic.Or);
      });

      expect(result.current.filterLogic).toBe(FilterLogic.Or);
      expect(localStorage.getItem("filter-logic")).toBe("or");
    });
  });
});

describe("preferencesReducer", () => {
  beforeEach(() => {
    localStorage.clear();
  });

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
    localStorage.clear();
  });

  it("should return default values when no stored values exist", () => {
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

  it("should read boolean preferences from localStorage", () => {
    localStorage.setItem("case-sensitive", "true");
    localStorage.setItem("highlight-filters", "true");
    localStorage.setItem("sticky-headers", "true");
    localStorage.setItem("zebra-striping", "true");

    const state = getInitialState();
    expect(state.caseSensitive).toBe(true);
    expect(state.highlightFilters).toBe(true);
    expect(state.stickyHeaders).toBe(true);
    expect(state.zebraStriping).toBe(true);
  });

  it("should read wordWrapFormat from localStorage", () => {
    localStorage.setItem("wrap-format", WordWrapFormat.Aggressive);

    const state = getInitialState();
    expect(state.wordWrapFormat).toBe(WordWrapFormat.Aggressive);
  });
});
