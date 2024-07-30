import { ProcessedLogLines } from "types/logs";
import {
  isSectionHeaderRow,
  isSkippedLinesRow,
  isSubsectionHeaderRow,
} from "utils/logRowTypes";

interface searchOptions {
  searchRegex: RegExp;
  upperBound?: number;
  lowerBound: number;
  getLine: (lineNumber: number) => string;
  processedLogLines: ProcessedLogLines;
}

/**
 * Searches through the processed log lines for matches to the provided regular expression.
 * @param options Object containing search parameters and helpers.
 * @param options.searchRegex The regular expression to search for in the logs.
 * @param options.upperBound Inclusive upper bound for the search.
 * @param options.lowerBound Inclusive lower bound for the search.
 * @param options.getLine Function to get the raw log string at the given index.
 * @param options.processedLogLines Processed log lines that are currently rendered.
 * @returns An array of sorted raw log indices that match the search criteria. SkippedLines are not included in the result.
 */
const searchLogs = (options: searchOptions): number[] => {
  const {
    getLine,
    lowerBound,
    processedLogLines,
    searchRegex,
    upperBound = Number.MAX_VALUE,
  } = options;
  const matchingLogIndex = new Set<number>();
  processedLogLines.forEach((processedLogLine) => {
    if (isSectionHeaderRow(processedLogLine)) {
      for (
        let i = processedLogLine.range.start;
        i < processedLogLine.range.end && i <= upperBound;
        i++
      ) {
        if (i >= lowerBound && searchRegex.test(getLine(i))) {
          matchingLogIndex.add(i);
        }
      }
    } else if (
      !(
        isSkippedLinesRow(processedLogLine) ||
        isSectionHeaderRow(processedLogLine) ||
        isSubsectionHeaderRow(processedLogLine)
      )
    ) {
      if (processedLogLine >= lowerBound && processedLogLine <= upperBound) {
        if (searchRegex.test(getLine(processedLogLine))) {
          matchingLogIndex.add(processedLogLine);
        }
      }
    }
  });
  return Array.from(matchingLogIndex).sort((a, b) => a - b);
};

export default searchLogs;
