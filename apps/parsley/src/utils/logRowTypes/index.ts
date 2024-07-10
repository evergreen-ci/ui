import {
  ProcessedLogLine,
  RowType,
  SectionHeaderRow,
  SkippedLinesRow,
  SubsectionHeaderRow,
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

const isSubsectionHeaderRow = (
  logLine: ProcessedLogLine,
): logLine is SubsectionHeaderRow =>
  typeof logLine === "object" && logLine.rowType === RowType.SubsectionHeader;

/**
 * `includesLineNumber` determines if a log line includes a given line number.
 * @param logLine - the processed log line to check
 * @param lineNumber - the line number to check
 * @returns true if the log line includes the line number and false otherwise
 */
const includesLineNumber = (logLine: ProcessedLogLine, lineNumber?: number) => {
  if (lineNumber === undefined) {
    return false;
  }
  if (typeof logLine === "number") {
    return logLine === lineNumber;
  }
  return lineNumber >= logLine.range.start && lineNumber < logLine.range.end;
};

export {
  isSectionHeaderRow,
  isSkippedLinesRow,
  isSubsectionHeaderRow,
  includesLineNumber,
};
