import stripAnsi from "strip-ansi";
import { ProcessedLogLines } from "types/logs";
import {
  isLogRow,
  isSectionHeaderRow,
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
export const searchLogs = (options: searchOptions): number[] => {
  const {
    getLine,
    lowerBound,
    processedLogLines,
    searchRegex,
    upperBound = Number.MAX_VALUE,
  } = options;
  const matchingLogIndices = new Set<number>();
  for (let pLLIndex = 0; pLLIndex < processedLogLines.length; pLLIndex++) {
    const processedLogLine = processedLogLines[pLLIndex];
    // Since processedLogLines is ordered by line number, we can stop searching if we are out of range for our upper bound.
    if (isLogRow(processedLogLine)) {
      if (processedLogLine > upperBound) {
        break;
      }
    } else if (processedLogLine.range.start > upperBound) {
      break;
    }

    if (
      isSectionHeaderRow(processedLogLine) ||
      (isSubsectionHeaderRow(processedLogLine) &&
        processedLogLine.isTopLevelCommand)
    ) {
      for (
        let i = processedLogLine.range.start;
        i < processedLogLine.range.end && i <= upperBound;
        i++
      ) {
        if (i >= lowerBound && searchRegex.test(stripAnsi(getLine(i)))) {
          matchingLogIndices.add(i);
        }
      }
    } else if (isLogRow(processedLogLine)) {
      if (processedLogLine >= lowerBound) {
        if (searchRegex.test(stripAnsi(getLine(processedLogLine)))) {
          matchingLogIndices.add(processedLogLine);
        }
      }
    }
  }
  return Array.from(matchingLogIndices).sort((a, b) => a - b);
};

/**
 * Searches all raw log lines for matches to the provided search term.
 * Unlike `searchLogs`, this ignores filters, sections, and bounds — it scans every line.
 * @param logs - the full array of raw log strings
 * @param searchTerm - a regular expression string to search for
 * @param caseSensitive - whether the search should be case sensitive
 * @returns a sorted array of line indices that match the search term
 */
export const findMatchingLinesBySearch = (
  logs: string[],
  searchTerm: string,
  caseSensitive: boolean,
): number[] => {
  const searchRegex = new RegExp(searchTerm, caseSensitive ? "" : "i");
  const matchingLineNumbers: number[] = [];
  logs.forEach((line, idx) => {
    if (searchRegex.test(stripAnsi(line))) {
      matchingLineNumbers.push(idx);
    }
  });
  return matchingLineNumbers;
};
