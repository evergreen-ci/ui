import {
  FilterLogic,
  LogRenderingTypes,
  LogTypes,
  WordWrapFormat,
} from "constants/enums";

interface SearchState {
  searchTerm?: RegExp;
  searchIndex?: number;
  searchRange?: number;
  hasSearch: boolean;
}

interface LogMetadata {
  execution?: string;
  fileName?: string;
  groupID?: string;
  htmlLogURL?: string;
  jobLogsURL?: string;
  logType?: LogTypes;
  origin?: string;
  rawLogURL?: string;
  renderingType?: LogRenderingTypes;
  taskID?: string;
  testID?: string;
  logPath?: string;
  logsToMerge?: string[];
}

interface Preferences {
  caseSensitive: boolean;
  expandableRows: boolean;
  filterLogic: FilterLogic;
  excludeTimestamps: boolean;
  jumpToFailingLineEnabled: boolean;
  prettyPrint: boolean;
  sectionsEnabled: boolean;
  wordWrapFormat: WordWrapFormat;
  wrap: boolean;
  zebraStriping: boolean;
  highlightFilters: boolean;
  stickyHeaders: boolean;
  setCaseSensitive: (caseSensitive: boolean) => void;
  setExpandableRows: (expandableRows: boolean) => void;
  setFilterLogic: (filterLogic: FilterLogic) => void;
  setExcludeTimestamps: (excludeTimestamps: boolean) => void;
  setJumpToFailingLineEnabled: (jumpToFailingLineEnabled: boolean) => void;
  setWrap: (wrap: boolean) => void;
  setWordWrapFormat: (wrapFormat: WordWrapFormat) => void;
  setPrettyPrint: (prettyPrint: boolean) => void;
  setSectionsEnabled: (sectionsEnabled: boolean) => void;
  setZebraStriping: (zebraStriping: boolean) => void;
  setHighlightFilters: (highlightFilters: boolean) => void;
  setStickyHeaders: (stickyHeaders: boolean) => void;
}

enum DIRECTION {
  PREVIOUS,
  NEXT,
}

export { DIRECTION };
export type { LogMetadata, Preferences, SearchState };
