import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useQueryParam } from "@evg-ui/lib/hooks";
import { PaginatedVirtualListRef } from "components/PaginatedVirtualList/types";
import { LogRenderingTypes, LogTypes } from "constants/enums";
import { QueryParams, urlParseOptions } from "constants/queryParams";
import { useFilterParam } from "hooks/useFilterParam";
import { useOpenSectionAndScrollToLine } from "hooks/useOpenSectionAndScrollToLine";
import { UseSectionsResult, useSections } from "hooks/useSections";
import { ExpandedLines, ProcessedLogLines } from "types/logs";
import filterLogs from "utils/filterLogs";
import { getMatchingLines } from "utils/matchingLines";
import { getColorMapping } from "utils/resmoke";
import searchLogs from "utils/searchLogs";
import useLogState from "./state";
import { DIRECTION, LogMetadata, Preferences, SearchState } from "./types";
import { usePreferences } from "./usePreferences";
import { getNextPage } from "./utils";

interface LogContextState {
  expandedLines: ExpandedLines;
  failingLine: number | undefined;
  isUploadedLog: boolean;
  hasLogs: boolean | null;
  lineCount: number;
  listRef: React.RefObject<PaginatedVirtualListRef>;
  logMetadata?: LogMetadata;
  matchingLines: Set<number> | undefined;
  preferences: Preferences;
  processedLogLines: ProcessedLogLines;
  range: {
    lowerRange: number;
    upperRange?: number;
  };
  searchLine?: number;
  searchState: SearchState;

  clearExpandedLines: () => void;
  clearLogs: () => void;
  collapseLines: (idx: number) => void;
  expandLines: (expandedLines: ExpandedLines) => void;
  getLine: (lineNumber: number) => string | undefined;
  getResmokeLineColor: (lineNumber: number) => string | undefined;
  ingestLines: (
    logs: string[],
    renderingType: LogRenderingTypes,
    failingCommand?: string,
  ) => void;
  paginate: (dir: DIRECTION) => void;
  scrollToLine: (lineNumber: number) => void;
  setFileName: (fileName: string) => void;
  setLogMetadata: (logMetadata: LogMetadata) => void;
  setSearch: (search: string) => void;
  sectioning: UseSectionsResult;
  openSectionAndScrollToLine: (lineNumber: number | number[]) => void;
}

const LogContext = createContext<LogContextState | null>(null);

const useLogContext = () => {
  const context = useContext(LogContext);
  if (context === undefined) {
    throw new Error("useLogContext must be used within a LogContextProvider");
  }
  return context as LogContextState;
};

interface LogContextProviderProps {
  children: React.ReactNode;
  initialLogLines?: string[];
}

const LogContextProvider: React.FC<LogContextProviderProps> = ({
  children,
  initialLogLines,
}) => {
  const [filters] = useFilterParam();
  const [bookmarks] = useQueryParam<number[]>(
    QueryParams.Bookmarks,
    [],
    urlParseOptions,
  );
  const [shareLine] = useQueryParam<number | undefined>(
    QueryParams.ShareLine,
    undefined,
    urlParseOptions,
  );
  const [lowerRange] = useQueryParam(
    QueryParams.LowerRange,
    0,
    urlParseOptions,
  );
  const [upperRange] = useQueryParam<undefined | number>(
    QueryParams.UpperRange,
    undefined,
    urlParseOptions,
  );

  const preferences = usePreferences();
  const { expandableRows, filterLogic } = preferences;

  const { dispatch, state } = useLogState(initialLogLines);
  const [processedLogLines, setProcessedLogLines] = useState<ProcessedLogLines>(
    [],
  );
  const listRef = useRef<PaginatedVirtualListRef>(null);

  const stringifiedFilters = JSON.stringify(filters);
  const stringifiedBookmarks = bookmarks.toString();
  const stringifiedExpandedLines = state.expandedLines.toString();

  const matchingLines = useMemo(
    () => getMatchingLines(state.logs, filters, filterLogic),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      stringifiedFilters,
      stringifiedExpandedLines,
      state.logs.length,
      filterLogic,
    ],
  );

  const sectioning = useSections({
    logType: state.logMetadata?.logType,
    logs: state.logs,
    onInitOpenSectionsContainingLines: [shareLine, state.failingLine].filter(
      (v): v is number => v !== undefined,
    ),
    renderingType: state.logMetadata?.renderingType,
  });

  const stringifiedProcessedLogLines = useMemo(
    () =>
      `${processedLogLines.length}-${stringifiedFilters}-${stringifiedBookmarks}-${stringifiedExpandedLines}-${expandableRows}-${sectioning.sectioningEnabled}`,
    [
      processedLogLines.length,
      stringifiedFilters,
      stringifiedBookmarks,
      stringifiedExpandedLines,
      expandableRows,
      sectioning.sectioningEnabled,
    ],
  );

  useEffect(
    () => {
      setProcessedLogLines(
        filterLogs({
          bookmarks,
          expandableRows,
          expandedLines: state.expandedLines,
          failingLine: state.failingLine,
          logLines: state.logs,
          matchingLines,
          sectionData: sectioning.sectionData,
          sectionState: sectioning.sectionState,
          sectioningEnabled: sectioning.sectioningEnabled,
          shareLine,
        }),
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      state.logs.length,
      state.failingLine,
      matchingLines,
      stringifiedBookmarks,
      shareLine,
      stringifiedExpandedLines,
      expandableRows,
      sectioning.sectionData,
      sectioning.sectionState,
      sectioning.sectioningEnabled,
    ],
  );

  const getLine = useCallback(
    (lineNumber: number) => state.logs[lineNumber],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state.logs.length],
  );

  const getResmokeLineColor = useCallback(
    (lineNumber: number) => {
      const lineContent = getLine(lineNumber);
      if (!state.colorMapping || !lineContent) {
        return undefined;
      }
      const colorMapping = getColorMapping(lineContent, state.colorMapping);
      return colorMapping !== undefined ? colorMapping.color : undefined;
    },
    [getLine, state.colorMapping],
  );

  const scrollToLine = useCallback((lineNumber: number) => {
    listRef.current?.scrollToIndex(lineNumber);
  }, []);

  const searchResults = useMemo(() => {
    const results = state.searchState.searchTerm
      ? searchLogs({
          getLine,
          lowerBound: lowerRange,
          processedLogLines,
          searchRegex: state.searchState.searchTerm,
          upperBound: upperRange,
        })
      : [];
    dispatch({
      matchCount: results.length,
      type: "SET_MATCH_COUNT",
    });
    return results;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    state.searchState.searchTerm,
    upperRange,
    lowerRange,
    getLine,
    dispatch,
    stringifiedProcessedLogLines, // Use stringifiedProcessedLogLines instead of processedLogLines to avoid expensive array comparisons.
  ]);

  const openSectionAndScrollToLine = useOpenSectionAndScrollToLine(
    processedLogLines,
    sectioning.openSectionsContainingLineNumbers,
    scrollToLine,
  );
  const stringifiedSearchResults = searchResults.toString();
  useEffect(() => {
    if (searchResults.length > 0) {
      openSectionAndScrollToLine(searchResults);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stringifiedSearchResults, scrollToLine]);

  const searchLine =
    state.searchState.searchIndex !== undefined
      ? searchResults[state.searchState.searchIndex]
      : undefined;

  const ingestLines = useCallback(
    (
      lines: string[],
      renderingType: LogRenderingTypes,
      failingCommand?: string,
    ) => {
      dispatch({
        failingCommand: failingCommand ?? "",
        logs: lines,
        renderingType,
        type: "INGEST_LOGS",
      });
    },
    [dispatch],
  );

  const setLogMetadata = useCallback(
    (logMetadata: LogMetadata) => {
      dispatch({ logMetadata, type: "SET_LOG_METADATA" });
    },
    [dispatch],
  );
  const memoizedContext = useMemo(
    () => ({
      expandedLines: state.expandedLines,
      failingLine: state.failingLine,
      hasLogs: state.hasLogs,
      lineCount: state.logs.length,
      listRef,
      logMetadata: state.logMetadata,
      matchingLines,
      preferences,
      processedLogLines,
      range: {
        lowerRange,
        upperRange,
      },
      searchLine,
      searchState: state.searchState,

      clearExpandedLines: () => dispatch({ type: "CLEAR_EXPANDED_LINES" }),
      clearLogs: () => dispatch({ type: "CLEAR_LOGS" }),
      collapseLines: (idx: number) => dispatch({ idx, type: "COLLAPSE_LINES" }),
      expandLines: (expandedLines: ExpandedLines) =>
        dispatch({ expandedLines, type: "EXPAND_LINES" }),
      getLine,
      getResmokeLineColor,
      ingestLines,
      isUploadedLog: state.logMetadata?.logType === LogTypes.LOCAL_UPLOAD,
      openSectionAndScrollToLine,
      paginate: (direction: DIRECTION) => {
        const { searchIndex, searchRange } = state.searchState;
        if (searchIndex !== undefined && searchRange !== undefined) {
          const nextPage = getNextPage(searchIndex, searchRange, direction);
          dispatch({ nextPage, type: "PAGINATE" });
          openSectionAndScrollToLine(searchResults[nextPage]);
        }
      },
      scrollToLine,
      sectioning,
      setFileName: (fileName: string) => {
        dispatch({ fileName, type: "SET_FILE_NAME" });
      },
      setLogMetadata,
      setSearch: (searchTerm: string) => {
        dispatch({
          caseSensitive: preferences.caseSensitive,
          searchTerm,
          type: "SET_SEARCH_TERM",
        });
      },
    }),
    [
      lowerRange,
      matchingLines,
      preferences,
      processedLogLines,
      searchLine,
      searchResults,
      state.expandedLines,
      state.failingLine,
      state.hasLogs,
      state.logMetadata,
      state.logs.length,
      state.searchState,
      upperRange,
      dispatch,
      getLine,
      getResmokeLineColor,
      ingestLines,
      scrollToLine,
      setLogMetadata,
      sectioning,
      openSectionAndScrollToLine,
    ],
  );

  return (
    <LogContext.Provider value={memoizedContext}>
      {children}
    </LogContext.Provider>
  );
};

export { LogContextProvider, useLogContext };
