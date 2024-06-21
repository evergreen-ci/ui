import { ProcessedLogLines, RowType } from "types/logs";
import { findLineIndex } from ".";

const processedLines: ProcessedLogLines = [
  0,
  { range: { end: 3, start: 1 }, rowType: RowType.SkippedLines },
  3,
  { range: { end: 6, start: 4 }, rowType: RowType.SkippedLines },
  6,
  { range: { end: 10, start: 7 }, rowType: RowType.SkippedLines },
  10,
  {
    functionName: "f-1",
    isOpen: true,
    range: { end: 11, start: 10 },
    rowType: RowType.SectionHeader,
  },
  {
    commandName: "shell.exec",
    functionName: "f-1",
    isOpen: false,
    range: { end: 11, start: 10 },
    rowType: RowType.SubsectionHeader,
  },
  12,
  {
    functionName: "f-2",
    isOpen: false,
    range: { end: 15, start: 13 },
    rowType: RowType.SectionHeader,
  },
  {
    functionName: "f-3",
    isOpen: true,
    range: { end: 17, start: 15 },
    rowType: RowType.SectionHeader,
  },
  {
    commandName: "shell.exec",
    functionName: "f-3",
    isOpen: false,
    range: { end: 17, start: 15 },
    rowType: RowType.SubsectionHeader,
  },
  {
    functionName: "f-4",
    isOpen: true,
    range: { end: 19, start: 17 },
    rowType: RowType.SectionHeader,
  },
  17,
  18,
  {
    functionName: "f-5",
    isOpen: true,
    range: { end: 23, start: 19 },
    rowType: RowType.SectionHeader,
  },
  {
    commandName: "shell.exec",
    functionName: "f-5",
    isOpen: true,
    range: { end: 23, start: 19 },
    rowType: RowType.SubsectionHeader,
  },
  19,
  20,
  21,
  22,
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
    expect(findLineIndex(processedLines, 55)).toBe(-1);
  });

  describe("when line number is represented in a Range object belonging to a section", () => {
    it("determine index when line number is in closed SectionHeaderRow", () => {
      expect(findLineIndex(processedLines, 14)).toBe(10);
    });

    it("determine index when line number is in an open SectionHeaderRow", () => {
      expect(findLineIndex(processedLines, 18)).toBe(15);
    });

    it("determine index when line number is belongs to a closed SubsectionHeaderRow", () => {
      expect(findLineIndex(processedLines, 10)).toBe(8);
    });

    it("determine index when line number is belongs to an open SubsectionHeaderRow", () => {
      expect(findLineIndex(processedLines, 20)).toBe(19);
    });
  });
});
