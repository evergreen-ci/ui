import { SkippedLinesRow } from "types/logs";
/**
 *
 * @param start The start line number inclusive
 * @param end  The end line number exclusive
 * @returns SkippedLines object
 */
const newSkippedLinesRow = (start: number, end: number): SkippedLinesRow => ({
  range: { end, start },
  rowType: "SkippedLines",
});

export { newSkippedLinesRow };
