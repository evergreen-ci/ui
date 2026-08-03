import { useReducer } from "react";
import { LogRenderingTypes } from "constants/enums";
import { ExpandedLines } from "types/logs";
import { mergeIntervals } from "utils/expandedLines";
import { getColorMapping, processResmokeLine } from "utils/resmoke";
import { isFailingLine } from "utils/string";
import { LogMetadata, SearchState } from "./types";

interface LogState {
  colorMapping?: Record<string, string>;
  expandedLines: ExpandedLines;
  failingLine?: number;
  hasLogs: boolean | null;
  logMetadata?: LogMetadata;
  logs: string[];
  searchState: Omit<SearchState, "hasSearch" | "searchRange">;
}

type Action =
  | {
      type: "INGEST_LOGS";
      logs: string[];
      renderingType: LogRenderingTypes;
      failingCommand: string;
    }
  | { type: "CLEAR_LOGS" }
  | { type: "SET_FILE_NAME"; fileName: string }
  | { type: "SET_LOG_METADATA"; logMetadata: LogMetadata }
  | { type: "SET_SEARCH_TERM"; searchTerm: string; caseSensitive: boolean }
  | { type: "RESET_SEARCH_INDEX"; hasMatches: boolean }
  | { type: "EXPAND_LINES"; expandedLines: ExpandedLines }
  | { type: "COLLAPSE_LINES"; idx: number }
  | { type: "CLEAR_EXPANDED_LINES" }
  | { type: "PAGINATE"; nextPage: number };

const initialState = (initialLogLines?: string[]): LogState => ({
  expandedLines: [],
  hasLogs: null,
  logs: initialLogLines || [],
  searchState: {
    searchIndex: undefined,
  },
});

const reducer = (state: LogState, action: Action): LogState => {
  switch (action.type) {
    case "INGEST_LOGS": {
      let processedLogs;
      let colorMap;
      switch (action.renderingType) {
        case LogRenderingTypes.Resmoke: {
          const transformedLogs = action.logs.reduce(
            (acc, logLine) => {
              const processedLogLine = processResmokeLine(logLine);
              const colorMapping = getColorMapping(
                processedLogLine,
                acc.colorMap,
              );
              if (colorMapping) {
                acc.colorMap[colorMapping.portOrState] = colorMapping.color;
              }
              acc.processedLogs.push(processedLogLine);
              return acc;
            },
            {
              colorMap: {} as Record<string, string>,
              processedLogs: [] as string[],
            },
          );
          processedLogs = transformedLogs.processedLogs;
          colorMap = transformedLogs.colorMap;
          // Break sliced string references to allow parent chunk buffers to be GC'd.
          // processResmokeLine returns the original string reference for non-resmoke
          // lines, which keeps the entire parent chunk alive in memory. Copying these
          // into independent strings allows the raw download data to be collected.
          for (let i = 0; i < processedLogs.length; i += 1) {
            if (processedLogs[i] === action.logs[i]) {
              processedLogs[i] = ` ${processedLogs[i]}`.slice(1);
            }
          }
          break;
        }
        case LogRenderingTypes.Default:
        default:
          processedLogs = action.logs;
          break;
      }

      let failingLine = action.failingCommand
        ? processedLogs.findIndex((line) =>
            isFailingLine(line, action.failingCommand),
          )
        : undefined;
      if (failingLine === -1) {
        failingLine = undefined;
      }

      return {
        ...state,
        colorMapping: colorMap,
        failingLine,
        hasLogs: processedLogs.length !== 0,
        logMetadata: {
          ...state.logMetadata,
          renderingType: action.renderingType,
        },
        logs: processedLogs,
      };
    }
    case "CLEAR_LOGS":
      return initialState([]);
    case "SET_LOG_METADATA":
      return {
        ...state,
        logMetadata: action.logMetadata,
      };
    case "EXPAND_LINES": {
      const intervals = state.expandedLines.concat(action.expandedLines);
      return {
        ...state,
        expandedLines: mergeIntervals(intervals),
      };
    }
    case "COLLAPSE_LINES": {
      const newExpandedLines = state.expandedLines.filter(
        (_f, idx) => idx !== action.idx,
      );
      return {
        ...state,
        expandedLines: newExpandedLines,
      };
    }
    case "CLEAR_EXPANDED_LINES":
      return {
        ...state,
        expandedLines: [],
      };
    case "SET_FILE_NAME":
      return {
        ...state,
        logMetadata: {
          ...state.logMetadata,
          fileName: action.fileName,
        },
      };
    case "SET_SEARCH_TERM": {
      const hasSearch = !!action.searchTerm;
      const searchTerm = new RegExp(
        action.searchTerm,
        action.caseSensitive ? "" : "i",
      );
      return {
        ...state,
        searchState: {
          ...state.searchState,
          searchIndex: hasSearch ? 0 : undefined,
          searchTerm: hasSearch ? searchTerm : undefined,
        },
      };
    }
    case "RESET_SEARCH_INDEX": {
      const searchIndex =
        state.searchState.searchTerm && action.hasMatches ? 0 : undefined;
      if (state.searchState.searchIndex === searchIndex) {
        return state;
      }
      return {
        ...state,
        searchState: {
          ...state.searchState,
          searchIndex,
        },
      };
    }
    case "PAGINATE":
      return {
        ...state,
        searchState: {
          ...state.searchState,
          searchIndex: action.nextPage,
        },
      };
    default:
      throw new Error(`Unknown reducer action ${action}`);
  }
};

const useLogState = (initialLogLines?: string[]) => {
  const [state, dispatch] = useReducer(reducer, initialState(initialLogLines));
  return {
    dispatch,
    state,
  };
};

export default useLogState;
