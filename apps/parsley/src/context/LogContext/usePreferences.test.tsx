import { MemoryRouter } from "react-router-dom";
import { act, renderHook } from "@evg-ui/lib/test_utils";
import { FilterLogic, WordWrapFormat } from "constants/enums";
import {
  CASE_SENSITIVE,
  EXPANDABLE_ROWS,
  FILTER_LOGIC,
  HIGHLIGHT_FILTERS,
  PRETTY_PRINT_BOOKMARKS,
  STICKY_HEADERS,
  WRAP,
  WRAP_FORMAT,
  ZEBRA_STRIPING,
} from "constants/storageKeys";
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
      localStorage.setItem(CASE_SENSITIVE, "true");
      const { result } = renderHook(() => usePreferences(), { wrapper });
      expect(result.current.caseSensitive).toBe(true);
    });

    it("should initialize expandableRows from localStorage", () => {
      localStorage.setItem(EXPANDABLE_ROWS, "false");
      const { result } = renderHook(() => usePreferences(), { wrapper });
      expect(result.current.expandableRows).toBe(false);
    });

    it("should initialize filterLogic from localStorage", () => {
      localStorage.setItem(FILTER_LOGIC, FilterLogic.Or);
      const { result } = renderHook(() => usePreferences(), { wrapper });
      expect(result.current.filterLogic).toBe(FilterLogic.Or);
    });

    it("should initialize wordWrapFormat from localStorage", () => {
      localStorage.setItem(WRAP_FORMAT, WordWrapFormat.Aggressive);
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
      expect(localStorage.getItem(CASE_SENSITIVE)).toBe("true");
    });

    it("should update highlightFilters and persist to localStorage", () => {
      const { result } = renderHook(() => usePreferences(), { wrapper });
      expect(result.current.highlightFilters).toBe(false);

      act(() => {
        result.current.setHighlightFilters(true);
      });

      expect(result.current.highlightFilters).toBe(true);
      expect(localStorage.getItem(HIGHLIGHT_FILTERS)).toBe("true");
    });

    it("should update prettyPrint and persist to localStorage", () => {
      const { result } = renderHook(() => usePreferences(), { wrapper });
      expect(result.current.prettyPrint).toBe(false);

      act(() => {
        result.current.setPrettyPrint(true);
      });

      expect(result.current.prettyPrint).toBe(true);
      expect(localStorage.getItem(PRETTY_PRINT_BOOKMARKS)).toBe("true");
    });

    it("should update stickyHeaders and persist to localStorage", () => {
      const { result } = renderHook(() => usePreferences(), { wrapper });
      expect(result.current.stickyHeaders).toBe(false);

      act(() => {
        result.current.setStickyHeaders(true);
      });

      expect(result.current.stickyHeaders).toBe(true);
      expect(localStorage.getItem(STICKY_HEADERS)).toBe("true");
    });

    it("should update wordWrapFormat and persist to localStorage", () => {
      const { result } = renderHook(() => usePreferences(), { wrapper });
      expect(result.current.wordWrapFormat).toBe(WordWrapFormat.Standard);

      act(() => {
        result.current.setWordWrapFormat(WordWrapFormat.Aggressive);
      });

      expect(result.current.wordWrapFormat).toBe(WordWrapFormat.Aggressive);
      expect(localStorage.getItem(WRAP_FORMAT)).toBe("aggressive");
    });

    it("should update wrap and persist to localStorage", () => {
      const { result } = renderHook(() => usePreferences(), { wrapper });
      expect(result.current.wrap).toBe(false);

      act(() => {
        result.current.setWrap(true);
      });

      expect(result.current.wrap).toBe(true);
      expect(localStorage.getItem(WRAP)).toBe("true");
    });

    it("should update zebraStriping and persist to localStorage", () => {
      const { result } = renderHook(() => usePreferences(), { wrapper });
      expect(result.current.zebraStriping).toBe(false);

      act(() => {
        result.current.setZebraStriping(true);
      });

      expect(result.current.zebraStriping).toBe(true);
      expect(localStorage.getItem(ZEBRA_STRIPING)).toBe("true");
    });

    it("should update expandableRows and persist to localStorage", () => {
      const { result } = renderHook(() => usePreferences(), { wrapper });
      expect(result.current.expandableRows).toBe(true);

      act(() => {
        result.current.setExpandableRows(false);
      });

      expect(result.current.expandableRows).toBe(false);
      expect(localStorage.getItem(EXPANDABLE_ROWS)).toBe("false");
    });

    it("should update filterLogic and persist to localStorage", () => {
      const { result } = renderHook(() => usePreferences(), { wrapper });
      expect(result.current.filterLogic).toBe(FilterLogic.And);

      act(() => {
        result.current.setFilterLogic(FilterLogic.Or);
      });

      expect(result.current.filterLogic).toBe(FilterLogic.Or);
      expect(localStorage.getItem(FILTER_LOGIC)).toBe("or");
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
    localStorage.setItem(CASE_SENSITIVE, "true");
    localStorage.setItem(HIGHLIGHT_FILTERS, "true");
    localStorage.setItem(STICKY_HEADERS, "true");
    localStorage.setItem(ZEBRA_STRIPING, "true");

    const state = getInitialState();
    expect(state.caseSensitive).toBe(true);
    expect(state.highlightFilters).toBe(true);
    expect(state.stickyHeaders).toBe(true);
    expect(state.zebraStriping).toBe(true);
  });

  it("should read wordWrapFormat from localStorage", () => {
    localStorage.setItem(WRAP_FORMAT, WordWrapFormat.Aggressive);

    const state = getInitialState();
    expect(state.wordWrapFormat).toBe(WordWrapFormat.Aggressive);
  });
});
