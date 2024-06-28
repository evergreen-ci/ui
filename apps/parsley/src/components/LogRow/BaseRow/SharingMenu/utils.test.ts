import { ProcessedLogLines, RowType } from "types/logs";
import { getLinesInProcessedLogLinesFromSelectedLines } from "./utils";

describe("getLinesInProcessedLogLinesFromSelectedLines", () => {
  it("should return empty array if no lines are selected", () => {
    const processedLogLines = [1, 2, 3, 4, 5];
    const selectedLines = { endingLine: undefined, startingLine: undefined };
    const result = getLinesInProcessedLogLinesFromSelectedLines(
      processedLogLines,
      selectedLines,
    );
    expect(result).toStrictEqual([]);
  });
  it("should return the lines in the selected range", () => {
    const processedLogLines = [1, 2, 3, 4, 5];
    const selectedLines = { endingLine: 3, startingLine: 2 };
    const result = getLinesInProcessedLogLinesFromSelectedLines(
      processedLogLines,
      selectedLines,
    );
    expect(result).toStrictEqual([2, 3]);
  });
  it("should not return skipped lines or section headers", () => {
    const processedLogLines: ProcessedLogLines = [
      1,
      2,
      { range: { end: 4, start: 3 }, rowType: RowType.SkippedLines },
      {
        functionID: "function-4",
        functionName: "test",
        isOpen: true,
        range: { end: 6, start: 4 },
        rowType: RowType.SectionHeader,
      },
      {
        commandID: "command-4",
        commandName: "shell.exec",
        functionID: "function-4",
        isOpen: true,
        range: { end: 6, start: 4 },
        rowType: RowType.SubsectionHeader,
      },
      4,
      5,
      6,
    ];
    const selectedLines = { endingLine: 6, startingLine: 2 };
    const result = getLinesInProcessedLogLinesFromSelectedLines(
      processedLogLines,
      selectedLines,
    );
    expect(result).toStrictEqual([2, 4, 5, 6]);
  });
  it("should return the starting line if no ending line is provided", () => {
    const processedLogLines = [1, 2, 3, 4, 5];
    const selectedLines = { endingLine: undefined, startingLine: 2 };
    const result = getLinesInProcessedLogLinesFromSelectedLines(
      processedLogLines,
      selectedLines,
    );
    expect(result).toStrictEqual([2]);
  });
});
