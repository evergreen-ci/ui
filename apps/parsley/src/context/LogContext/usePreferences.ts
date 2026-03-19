import { useCallback, useMemo, useReducer } from "react";
import { useQueryParam } from "@evg-ui/lib/hooks";
import {
  getLocalStorageBoolean,
  getLocalStorageString,
  setLocalStorageString,
} from "@evg-ui/lib/utils/localStorage";
import { FilterLogic, WordWrapFormat } from "constants/enums";
import { QueryParams, urlParseOptions } from "constants/queryParams";
import {
  CASE_SENSITIVE,
  EXCLUDE_TIMESTAMPS,
  EXPANDABLE_ROWS,
  FILTER_LOGIC,
  HIGHLIGHT_FILTERS,
  PRETTY_PRINT_BOOKMARKS,
  STICKY_HEADERS,
  WRAP,
  WRAP_FORMAT,
  ZEBRA_STRIPING,
} from "constants/storageKeys";
import { Preferences } from "./types";

interface PreferencesState {
  caseSensitive: boolean;
  excludeTimestamps: boolean;
  highlightFilters: boolean;
  prettyPrint: boolean;
  stickyHeaders: boolean;
  wordWrapFormat: WordWrapFormat;
  wrap: boolean;
  zebraStriping: boolean;
}

type PreferencesAction =
  | { type: "SET_CASE_SENSITIVE"; value: boolean }
  | { type: "SET_EXCLUDE_TIMESTAMPS"; value: boolean }
  | { type: "SET_HIGHLIGHT_FILTERS"; value: boolean }
  | { type: "SET_PRETTY_PRINT"; value: boolean }
  | { type: "SET_STICKY_HEADERS"; value: boolean }
  | { type: "SET_WORD_WRAP_FORMAT"; value: WordWrapFormat }
  | { type: "SET_WRAP"; value: boolean }
  | { type: "SET_ZEBRA_STRIPING"; value: boolean };

const persistToLocalStorage = (key: string, value: string | boolean): void => {
  setLocalStorageString(key, value.toString());
};

// Wrap and pretty print settings are evaluated after the logs have initially rendered - see LogPane component.
const getInitialState = (): PreferencesState => ({
  caseSensitive: getLocalStorageBoolean(CASE_SENSITIVE, false),
  excludeTimestamps: getLocalStorageBoolean(EXCLUDE_TIMESTAMPS, false),
  highlightFilters: getLocalStorageBoolean(HIGHLIGHT_FILTERS, false),
  prettyPrint: false,
  stickyHeaders: getLocalStorageBoolean(STICKY_HEADERS, false),
  wordWrapFormat:
    (getLocalStorageString(WRAP_FORMAT) as WordWrapFormat) ||
    WordWrapFormat.Standard,
  wrap: false,
  zebraStriping: getLocalStorageBoolean(ZEBRA_STRIPING, false),
});

const preferencesReducer = (
  state: PreferencesState,
  action: PreferencesAction,
): PreferencesState => {
  switch (action.type) {
    case "SET_CASE_SENSITIVE":
      persistToLocalStorage(CASE_SENSITIVE, action.value);
      return { ...state, caseSensitive: action.value };
    case "SET_EXCLUDE_TIMESTAMPS":
      persistToLocalStorage(EXCLUDE_TIMESTAMPS, action.value);
      return { ...state, excludeTimestamps: action.value };
    case "SET_HIGHLIGHT_FILTERS":
      persistToLocalStorage(HIGHLIGHT_FILTERS, action.value);
      return { ...state, highlightFilters: action.value };
    case "SET_PRETTY_PRINT":
      persistToLocalStorage(PRETTY_PRINT_BOOKMARKS, action.value);
      return { ...state, prettyPrint: action.value };
    case "SET_STICKY_HEADERS":
      persistToLocalStorage(STICKY_HEADERS, action.value);
      return { ...state, stickyHeaders: action.value };
    case "SET_WORD_WRAP_FORMAT":
      persistToLocalStorage(WRAP_FORMAT, action.value);
      return { ...state, wordWrapFormat: action.value };
    case "SET_WRAP":
      persistToLocalStorage(WRAP, action.value);
      return { ...state, wrap: action.value };
    case "SET_ZEBRA_STRIPING":
      persistToLocalStorage(ZEBRA_STRIPING, action.value);
      return { ...state, zebraStriping: action.value };
    default:
      return state;
  }
};

const usePreferences = (): Preferences => {
  const [state, dispatch] = useReducer(
    preferencesReducer,
    null,
    getInitialState,
  );

  const [filterLogic, setFilterLogicParam] = useQueryParam(
    QueryParams.FilterLogic,
    (getLocalStorageString(FILTER_LOGIC) as FilterLogic) ?? FilterLogic.And,
    urlParseOptions,
  );

  const [expandableRows, setExpandableRowsParam] = useQueryParam(
    QueryParams.Expandable,
    getLocalStorageBoolean(EXPANDABLE_ROWS, true),
    urlParseOptions,
  );

  const setCaseSensitive = useCallback((value: boolean) => {
    dispatch({ type: "SET_CASE_SENSITIVE", value });
  }, []);

  const setExpandableRows = useCallback(
    (value: boolean) => {
      setExpandableRowsParam(value);
      persistToLocalStorage(EXPANDABLE_ROWS, value);
    },
    [setExpandableRowsParam],
  );

  const setFilterLogic = useCallback(
    (value: FilterLogic) => {
      setFilterLogicParam(value);
      persistToLocalStorage(FILTER_LOGIC, value);
    },
    [setFilterLogicParam],
  );

  const setHighlightFilters = useCallback((value: boolean) => {
    dispatch({ type: "SET_HIGHLIGHT_FILTERS", value });
  }, []);

  const setExcludeTimestamps = useCallback((value: boolean) => {
    dispatch({ type: "SET_EXCLUDE_TIMESTAMPS", value });
    window.location.reload();
  }, []);

  const setPrettyPrint = useCallback((value: boolean) => {
    dispatch({ type: "SET_PRETTY_PRINT", value });
  }, []);

  const setStickyHeaders = useCallback((value: boolean) => {
    dispatch({ type: "SET_STICKY_HEADERS", value });
  }, []);

  const setWordWrapFormat = useCallback((value: WordWrapFormat) => {
    dispatch({ type: "SET_WORD_WRAP_FORMAT", value });
  }, []);

  const setWrap = useCallback((value: boolean) => {
    dispatch({ type: "SET_WRAP", value });
  }, []);

  const setZebraStriping = useCallback((value: boolean) => {
    dispatch({ type: "SET_ZEBRA_STRIPING", value });
  }, []);

  const preferences: Preferences = useMemo(
    () => ({
      caseSensitive: state.caseSensitive,
      excludeTimestamps: state.excludeTimestamps,
      expandableRows,
      filterLogic,
      highlightFilters: state.highlightFilters,
      prettyPrint: state.prettyPrint,
      setCaseSensitive,
      setExcludeTimestamps,
      setExpandableRows,
      setFilterLogic,
      setHighlightFilters,
      setPrettyPrint,
      setStickyHeaders,
      setWordWrapFormat,
      setWrap,
      setZebraStriping,
      stickyHeaders: state.stickyHeaders,
      wordWrapFormat: state.wordWrapFormat,
      wrap: state.wrap,
      zebraStriping: state.zebraStriping,
    }),
    [
      state,
      expandableRows,
      filterLogic,
      setCaseSensitive,
      setExcludeTimestamps,
      setExpandableRows,
      setFilterLogic,
      setHighlightFilters,
      setPrettyPrint,
      setStickyHeaders,
      setWordWrapFormat,
      setWrap,
      setZebraStriping,
    ],
  );

  return preferences;
};

export { usePreferences, preferencesReducer, getInitialState };
export type { PreferencesState, PreferencesAction };
