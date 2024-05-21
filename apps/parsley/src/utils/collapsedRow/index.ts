import {
  ProcessedLogLine,
  SkippedLinesRow,
  isNumberArray,
  isSkippedLinesRow,
} from "types/logs";

/**
 * `isCollapsedRow` determines if a row is a collapsed row. Although it is a simple function, its purpose
 * is to make the code more readable.
 * @param logLine - the processed log line to check
 * @returns true if the row is a collapsed row
 */
type CollapsedRow = number[] | SkippedLinesRow;
const isCollapsedRow = (logLine: ProcessedLogLine): logLine is CollapsedRow =>
  isSkippedLinesRow(logLine) || isNumberArray(logLine);

export { isCollapsedRow };
