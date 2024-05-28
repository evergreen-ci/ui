import { ProcessedLogLine, SkippedLinesRow } from "types/logs";

/**
 * `isSkippedLinesRow` determines if a row is a SkippedLinesRow.
 * @param logLine - the processed log line to check
 * @returns true if the row is a SkippedLinesRow
 */

const isSkippedLinesRow = (
  logLine: ProcessedLogLine,
): logLine is SkippedLinesRow =>
  typeof logLine === "object" &&
  "rowType" in logLine &&
  logLine.rowType === "SkippedLines";

/**
 * `isCollapsedRow` determines if a row is a collapsed row such as SectionHeaderRow and SkippedLinesRow.
 * Although it is a simple function, its purpose is to make the code more readable.
 * @param logLine - the processed log line to check
 * @returns true if the row is a collapsed row
 */
type CollapsedRow = SkippedLinesRow;
const isCollapsedRow = (logLine: ProcessedLogLine): logLine is CollapsedRow =>
  isSkippedLinesRow(logLine);

export { isCollapsedRow, isSkippedLinesRow };
