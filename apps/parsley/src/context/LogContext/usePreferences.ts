import { useCallback, useMemo, useReducer } from "react";
import Cookie from "js-cookie";
import { useQueryParam } from "@evg-ui/lib/hooks";
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
} from "constants/cookies";
import { FilterLogic, WordWrapFormat } from "constants/enums";
import { QueryParams, urlParseOptions } from "constants/queryParams";
import { Preferences } from "./types";

interface PreferencesState {
  caseSensitive: boolean;
  highlightFilters: boolean;
  prettyPrint: boolean;
  stickyHeaders: boolean;
  wordWrapFormat: WordWrapFormat;
  wrap: boolean;
  zebraStriping: boolean;
}

type PreferencesAction =
  | { type: "SET_CASE_SENSITIVE"; value: boolean }
  | { type: "SET_HIGHLIGHT_FILTERS"; value: boolean }
  | { type: "SET_PRETTY_PRINT"; value: boolean }
  | { type: "SET_STICKY_HEADERS"; value: boolean }
  | { type: "SET_WORD_WRAP_FORMAT"; value: WordWrapFormat }
  | { type: "SET_WRAP"; value: boolean }
  | { type: "SET_ZEBRA_STRIPING"; value: boolean };

const COOKIE_EXPIRY_DAYS = 365;

const persistToCookie = (cookieName: string, value: string | boolean): void => {
  Cookie.set(cookieName, value.toString(), { expires: COOKIE_EXPIRY_DAYS });
};

const getInitialState = (): PreferencesState => ({
  caseSensitive: Cookie.get(CASE_SENSITIVE) === "true",
  highlightFilters: Cookie.get(HIGHLIGHT_FILTERS) === "true",
  prettyPrint: false,
  stickyHeaders: Cookie.get(STICKY_HEADERS) === "true",
  wordWrapFormat:
    (Cookie.get(WRAP_FORMAT) as WordWrapFormat) || WordWrapFormat.Standard,
  wrap: false,
  zebraStriping: Cookie.get(ZEBRA_STRIPING) === "true",
});

const preferencesReducer = (
  state: PreferencesState,
  action: PreferencesAction,
): PreferencesState => {
  switch (action.type) {
    case "SET_CASE_SENSITIVE":
      persistToCookie(CASE_SENSITIVE, action.value);
      return { ...state, caseSensitive: action.value };
    case "SET_HIGHLIGHT_FILTERS":
      persistToCookie(HIGHLIGHT_FILTERS, action.value);
      return { ...state, highlightFilters: action.value };
    case "SET_PRETTY_PRINT":
      persistToCookie(PRETTY_PRINT_BOOKMARKS, action.value);
      return { ...state, prettyPrint: action.value };
    case "SET_STICKY_HEADERS":
      persistToCookie(STICKY_HEADERS, action.value);
      return { ...state, stickyHeaders: action.value };
    case "SET_WORD_WRAP_FORMAT":
      persistToCookie(WRAP_FORMAT, action.value);
      return { ...state, wordWrapFormat: action.value };
    case "SET_WRAP":
      persistToCookie(WRAP, action.value);
      return { ...state, wrap: action.value };
    case "SET_ZEBRA_STRIPING":
      persistToCookie(ZEBRA_STRIPING, action.value);
      return { ...state, zebraStriping: action.value };
    default:
      return state;
  }
};

const usePreferences = (): Preferences => {
  const [state, dispatch] = useReducer(preferencesReducer, getInitialState());

  const [filterLogic, setFilterLogicParam] = useQueryParam(
    QueryParams.FilterLogic,
    (Cookie.get(FILTER_LOGIC) as FilterLogic) ?? FilterLogic.And,
    urlParseOptions,
  );

  const [expandableRows, setExpandableRowsParam] = useQueryParam(
    QueryParams.Expandable,
    Cookie.get(EXPANDABLE_ROWS) ? Cookie.get(EXPANDABLE_ROWS) === "true" : true,
    urlParseOptions,
  );

  const setCaseSensitive = useCallback((value: boolean) => {
    dispatch({ type: "SET_CASE_SENSITIVE", value });
  }, []);

  const setExpandableRows = useCallback(
    (value: boolean) => {
      setExpandableRowsParam(value);
      persistToCookie(EXPANDABLE_ROWS, value);
    },
    [setExpandableRowsParam],
  );

  const setFilterLogic = useCallback(
    (value: FilterLogic) => {
      setFilterLogicParam(value);
      persistToCookie(FILTER_LOGIC, value);
    },
    [setFilterLogicParam],
  );

  const setHighlightFilters = useCallback((value: boolean) => {
    dispatch({ type: "SET_HIGHLIGHT_FILTERS", value });
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
      expandableRows,
      filterLogic,
      highlightFilters: state.highlightFilters,
      prettyPrint: state.prettyPrint,
      setCaseSensitive,
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
