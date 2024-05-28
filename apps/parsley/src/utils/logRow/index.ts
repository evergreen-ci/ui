import { SkippedLinesRow } from "types/logs";
/**
 *
 * @param lineStart The start line number inclusive
 * @param lineEnd  The end line number exclusive
 * @returns SkippedLines object
 */
const newSkippedLinesRow = (
  lineStart: number,
  lineEnd: number,
): SkippedLinesRow => ({
  range: { lineEnd, lineStart },
  rowType: "SkippedLines",
});

export { newSkippedLinesRow };
