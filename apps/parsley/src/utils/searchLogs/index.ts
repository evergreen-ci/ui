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
  const { getLine, lowerBound, processedLogLines, searchRegex, upperBound } =
    options;
  const matchingLogIndex = new Set<number>();
  for (let pLLIndex = 0; pLLIndex < processedLogLines.length; pLLIndex++) {
    const rawLogIndex = processedLogLines[pLLIndex];
    if (isSectionHeaderRow(rawLogIndex)) {
      for (
        let i = rawLogIndex.range.start;
        i < rawLogIndex.range.end && (upperBound ? i <= upperBound : true);
        i++
      ) {
        if (searchRegex.test(getLine(i))) {
          matchingLogIndex.add(i);
        }
      }
    } else if (
      !(
        isSkippedLinesRow(rawLogIndex) ||
        isSectionHeaderRow(rawLogIndex) ||
        isSubsectionHeaderRow(rawLogIndex)
      )
    ) {
      if (upperBound && rawLogIndex > upperBound) {
        break;
      }
      if (rawLogIndex >= lowerBound) {
        const line = getLine(rawLogIndex);
        if (searchRegex.test(line)) {
          matchingLogIndex.add(rawLogIndex);
        }
      }
    }
  }
  const result = Array.from(matchingLogIndex);
  result.sort((a, b) => a - b);
  return result;
};

export default searchLogs;
