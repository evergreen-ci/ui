import {
  ProcessedLogLine,
  RowType,
  SectionHeaderRow,
  SkippedLinesRow,
} from "types/logs";

/**
 * `isSkippedLinesRow` determines if a row is a SkippedLinesRow.
 * @param logLine - the processed log line to check
 * @returns true if the row is a SkippedLinesRow
 */

const isSkippedLinesRow = (
  logLine: ProcessedLogLine,
): logLine is SkippedLinesRow =>
  typeof logLine === "object" && logLine.rowType === RowType.SkippedLines;

const isSectionHeaderRow = (
  logLine: ProcessedLogLine,
): logLine is SectionHeaderRow =>
  typeof logLine === "object" && logLine.rowType === RowType.SectionHeader;

export { isSectionHeaderRow, isSkippedLinesRow };
