import { SectionEntry } from "hooks/useSections/utils";
import { ExpandedLines, ProcessedLogLines, RowType } from "types/logs";
import { isExpanded } from "utils/expandedLines";
import { newSkippedLinesRow } from "utils/logRow";
import { isSkippedLinesRow } from "utils/logRowTypes";

type FilterLogsParams = {
  logLines: string[];
  matchingLines: Set<number> | undefined;
  bookmarks: number[];
  shareLine: number | undefined;
  expandedLines: ExpandedLines;
  expandableRows: boolean;
  failingLine: number | undefined;
  sectionData: SectionEntry[] | undefined;
  sectionsEnabled: boolean;
};

/**
 * `filterLogs` processes log lines according to what filters, bookmarks, share line, and expanded lines are applied.
 * @param options - an object containing the parameters
 * @param options.bookmarks - list of line numbers representing bookmarks
 * @param options.expandableRows - specifies if expandable rows is enabled
 * @param options.expandedLines - an array of intervals representing expanded ranges
 * @param options.failingLine - a line number representing the failing line
 * @param options.logLines - list of strings representing the log lines
 * @param options.matchingLines - set of numbers representing which lines match the applied filters
 * @param options.sectionData - an array of objects representing the sections
 * @param options.sectionsEnabled - specifies if sections are enabled
 * @param options.shareLine - a line number representing a share line
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
    sectionData,
    sectionsEnabled,
    shareLine,
  } = options;
  // If there are no filters or expandable rows is not enabled, then we only have to process sections if they exist and are enabled.
  if (matchingLines === undefined) {
    if (sectionsEnabled && sectionData?.length) {
      let sectionIndex = 0;
      const filteredLines: ProcessedLogLines = [];
      logLines.reduce((arr, _logLine, idx) => {
        const section = sectionData[sectionIndex];
        const isSectionStart = section && idx === section.range.start;
        if (isSectionStart) {
          arr.push({
            functionName: section.functionName,
            isOpen: true,
            range: section.range,
            rowType: RowType.SectionHeader,
          });
          sectionIndex += 1;
        }
        arr.push(idx);
        return arr;
      }, filteredLines);
      return filteredLines;
    }
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
      if (isSkippedLinesRow(previousItem)) {
        previousItem.range.end = idx + 1;
      } else {
        arr.push(newSkippedLinesRow(idx, idx + 1));
      }
    }
    return arr;
  }, filteredLines);

  return filteredLines;
};

export default filterLogs;
