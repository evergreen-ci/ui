import { ProcessedLogLines } from "types/logs";
import { findLineIndex } from ".";

const processedLines: ProcessedLogLines = [
  0,
  { range: { end: 3, start: 1 }, rowType: "SkippedLines" },
  3,
  { range: { end: 6, start: 4 }, rowType: "SkippedLines" },
  6,
  { range: { end: 10, start: 7 }, rowType: "SkippedLines" },
  10,
  {
    functionName: "f-1",
    isOpen: true,
    range: { end: 13, start: 10 },
    rowType: "SectionHeader",
  },
  11,
  12,
  {
    functionName: "f-2",
    isOpen: false,
    range: { end: 15, start: 13 },
    rowType: "SectionHeader",
  },
  {
    functionName: "f-3",
    isOpen: true,
    range: { end: 17, start: 15 },
    rowType: "SectionHeader",
  },
  15,
  16,
  17,
];

describe("findLineIndex", () => {
  it("should correctly determine index when line number exists directly in the array and is not represented in a Range object", () => {
    expect(findLineIndex(processedLines, 0)).toBe(0);
    expect(findLineIndex(processedLines, 3)).toBe(2);
    expect(findLineIndex(processedLines, 6)).toBe(4);
  });

  it("should correctly determine index when line number is represented in a Range object belonging to a SkippedLinesRow", () => {
    expect(findLineIndex(processedLines, 1)).toBe(1);
    expect(findLineIndex(processedLines, 4)).toBe(3);
  });

  it("should return -1 when line number is not represented in the array", () => {
    expect(findLineIndex(processedLines, -1)).toBe(-1);
    expect(findLineIndex(processedLines, 18)).toBe(-1);
  });

  it("should correctly determine index when line number is represented in a Range object belonging to a closed SectionHeaderRow", () => {
    expect(findLineIndex(processedLines, 14)).toBe(10);
  });
  it("should correctly determine index when line number is represented in a Range object belonging to an open SectionHeaderRow", () => {
    expect(findLineIndex(processedLines, 16)).toBe(13);
  });
});
