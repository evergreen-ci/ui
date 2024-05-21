import {
  ExpandedLines,
  ProcessedLogLines,
  isNumberArray,
  isSkippedLinesRow,
} from "types/logs";
import { isCollapsedRow } from "utils/collapsedRow";
import { isExpanded } from "utils/expandedLines";

type FilterLogsParams = {
  logLines: string[];
  matchingLines: Set<number> | undefined;
  bookmarks: number[];
  shareLine: number | undefined;
  expandedLines: ExpandedLines;
  expandableRows: boolean;
  failingLine: number | undefined;
};

/**
 * `filterLogs` processes log lines according to what filters, bookmarks, share line, and expanded lines are applied.
 * @param options - an object containing the parameters
 * @param options.logLines - list of strings representing the log lines
 * @param options.matchingLines - set of numbers representing which lines match the applied filters
 * @param options.bookmarks - list of line numbers representing bookmarks
 * @param options.shareLine - a line number representing a share line
 * @param options.expandedLines - an array of intervals representing expanded ranges
 * @param options.expandableRows - specifies if expandable rows is enabled
 * @param options.failingLine - a line number representing the failing line
 * @returns an array of numbers that indicates which log lines should be displayed, and which log lines
 * should be collapsed
 */
const filterLogs = (options: FilterLogsParams): ProcessedLogLines => {
  const {
    bookmarks,
    expandableRows,
    expandedLines,
    failingLine,
    logLines,
    matchingLines,
    shareLine,
  } = options;
  // If there are no filters or expandable rows is not enabled, then we don't have to do any
  // processing.
  if (matchingLines === undefined) {
    return logLines.map((_, idx) => idx);
  }

  const filteredLines: ProcessedLogLines = [];

  logLines.reduce((arr, _logLine, idx) => {
    // Bookmarks, expanded lines, and the share line should always remain uncollapsed.
    if (
      bookmarks.includes(idx) ||
      shareLine === idx ||
      failingLine === idx ||
      isExpanded(idx, expandedLines)
    ) {
      arr.push(idx);
      return arr;
    }

    // If the line matches the filters, it should remain uncollapsed.
    if (matchingLines.has(idx)) {
      arr.push(idx);
      return arr;
    }

    if (expandableRows) {
      // If the line doesn't match the filters, collapse it.
      const previousItem = arr[arr.length - 1];
      if (isCollapsedRow(previousItem)) {
        if (isNumberArray(previousItem)) {
          previousItem.push(idx);
        } else if (isSkippedLinesRow(previousItem)) {
          previousItem.lineEnd = idx;
        }
      } else {
        arr.push([idx]);
      }
    }
    return arr;
  }, filteredLines);

  return filteredLines;
};

export default filterLogs;
