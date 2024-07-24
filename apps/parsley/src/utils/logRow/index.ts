import { Range, RowType, SkippedLinesRow } from "types/logs";
/**
 *
 * @param start The start line number inclusive
 * @param end  The end line number exclusive
 * @returns SkippedLines object
 */
const newSkippedLinesRow = (start: number, end: number): SkippedLinesRow => ({
  range: { end, start },
  rowType: RowType.SkippedLines,
});

/**
 * `includesLineNumber` determines if a log line includes a given line number.
 * @param logLine - the log line object to check
 * @param lineNumber - the line number to check
 * @returns true if the log line includes the line number and false otherwise
 */
const includesLineNumber = (
  logLine: { range: Range } | number,
  lineNumber?: number,
) => {
  if (lineNumber === undefined) {
    return false;
  }
  if (typeof logLine === "number") {
    return logLine === lineNumber;
  }
  return lineNumber >= logLine.range.start && lineNumber < logLine.range.end;
};

export { includesLineNumber, newSkippedLinesRow };
