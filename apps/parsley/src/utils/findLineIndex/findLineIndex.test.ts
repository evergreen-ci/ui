import { ProcessedLogLines } from "types/logs";
import { findLineIndex } from ".";

const processedLines: ProcessedLogLines = [
  0,
  { range: { lineEnd: 3, lineStart: 1 }, rowType: "SkippedLines" },
  3,
  { range: { lineEnd: 6, lineStart: 4 }, rowType: "SkippedLines" },
  6,
  { range: { lineEnd: 10, lineStart: 7 }, rowType: "SkippedLines" },
  10,
];

describe("findLineIndex", () => {
  it("should correctly determine index when line number exists directly in the array and is not represented in a Range object", () => {
    expect(findLineIndex(processedLines, 0)).toBe(0);
    expect(findLineIndex(processedLines, 3)).toBe(2);
    expect(findLineIndex(processedLines, 6)).toBe(4);
  });

  it("should correctly determine index when line number is represented in a Range object", () => {
    expect(findLineIndex(processedLines, 1)).toBe(1);
    expect(findLineIndex(processedLines, 4)).toBe(3);
  });

  it("should return -1 when line number is not represented in the array", () => {
    expect(findLineIndex(processedLines, -1)).toBe(-1);
    expect(findLineIndex(processedLines, 11)).toBe(-1);
  });
});
