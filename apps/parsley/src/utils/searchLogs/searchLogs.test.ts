import { ProcessedLogLines, RowType } from "types/logs";
import searchLogs from ".";

describe("searchLogs", () => {
  it("should return an empty array if there are no matching lines", () => {
    const lines = ["line 1", "line 2", "line 3"];
    const options = {
      getLine: (index: number) => lines[index],
      lowerBound: 0,
      processedLogLines: [0, 1, 2],
      searchRegex: /test/,
    };
    const matchingIndices = searchLogs(options);
    expect(matchingIndices).toStrictEqual([]);
  });
  it("should return an array of matching line numbers", () => {
    const lines = ["line 1", "line 2", "line 3"];
    const options = {
      getLine: (index: number) => lines[index],
      lowerBound: 0,
      processedLogLines: [0, 1, 2],
      searchRegex: /line/,
    };
    const matchingIndices = searchLogs(options);
    expect(matchingIndices).toStrictEqual([0, 1, 2]);
  });
  it("should return an array of matching line numbers with a lower bound", () => {
    const lines = ["line 1", "line 2", "line 3"];
    const getLine = vi.fn((index: number) => lines[index]);
    const options = {
      getLine,
      lowerBound: 1,
      processedLogLines: [0, 1, 2],
      searchRegex: /line/,
    };
    const matchingIndices = searchLogs(options);
    expect(matchingIndices).toStrictEqual([1, 2]);
    expect(getLine).toHaveBeenCalledTimes(2);
    expect(getLine).toHaveBeenCalledWith(1);
    expect(getLine).toHaveBeenCalledWith(2);
  });
  it("should return an array of matching line numbers with an upper bound", () => {
    const lines = ["line 1", "line 2", "line 3"];
    const getLine = vi.fn((index: number) => lines[index]);
    const options = {
      getLine,
      lowerBound: 0,
      processedLogLines: [0, 1, 2],
      searchRegex: /line/,
      upperBound: 1,
    };
    const matchingIndices = searchLogs(options);
    expect(matchingIndices).toStrictEqual([0, 1]);
    expect(getLine).toHaveBeenCalledTimes(2);
    expect(getLine).toHaveBeenCalledWith(0);
    expect(getLine).toHaveBeenCalledWith(1);
  });
  it("should not match on skipped lines and should return the raw log index", () => {
    const lines = ["line 1", "line 2", "line 3", "line 4"];
    const getLine = vi.fn((index: number) => lines[index]);
    const processedLogLines: ProcessedLogLines = [
      0,
      { range: { end: 3, start: 1 }, rowType: RowType.SkippedLines },
      3,
    ];
    const options = {
      getLine,
      lowerBound: 0,
      processedLogLines,
      searchRegex: /line/,
    };
    const matchingIndices = searchLogs(options);
    expect(matchingIndices).toStrictEqual([0, 3]);
    expect(getLine).toHaveBeenCalledTimes(2);
    expect(getLine).toHaveBeenCalledWith(0);
    expect(getLine).toHaveBeenCalledWith(3);
  });

  it("should search lines that are in open and closed sections when they are in range", () => {
    const lines = [
      "line 1",
      "line 2",
      "line 3",
      "line 4",
      "line 5",
      "line 6",
      "line 7",
    ];
    const getLine = vi.fn((index: number) => lines[index]);
    const processedLogLines: ProcessedLogLines = [
      0,
      {
        functionID: "function-1",
        functionName: "test",
        isOpen: true,
        range: { end: 3, start: 1 },
        rowType: RowType.SectionHeader,
      },
      {
        commandID: "command-1",
        commandName: "shell.exec",
        functionID: "function-1",
        isOpen: false,
        range: { end: 3, start: 1 },
        rowType: RowType.SubsectionHeader,
        step: "1 of 1",
      },
      { range: { end: 7, start: 3 }, rowType: RowType.SkippedLines },
    ];
    const options = {
      getLine,
      lowerBound: 0,
      processedLogLines,
      searchRegex: /line/,
    };
    const matchingIndices = searchLogs(options);
    expect(matchingIndices).toStrictEqual([0, 1, 2]);
  });
  it("should respect range boundaries when searching lines that are in open and closed sections", () => {
    const lines = [
      "line 1",
      "line 2",
      "line 3",
      "line 4",
      "line 5",
      "line 6",
      "line 7",
    ];
    const getLine = vi.fn((index: number) => lines[index]);
    const processedLogLines: ProcessedLogLines = [
      0,
      {
        functionID: "function-1",
        functionName: "test",
        isOpen: false,
        range: { end: 3, start: 1 },
        rowType: RowType.SectionHeader,
      },
      {
        commandID: "command-1",
        commandName: "shell.exec",
        functionID: "function-1",
        isOpen: false,
        range: { end: 3, start: 1 },
        rowType: RowType.SubsectionHeader,
        step: "1 of 1",
      },
      { range: { end: 7, start: 3 }, rowType: RowType.SkippedLines },
    ];
    const options = {
      getLine,
      lowerBound: 1,
      processedLogLines,
      searchRegex: /line/,
      upperBound: 2,
    };
    const matchingIndices = searchLogs(options);
    expect(matchingIndices).toStrictEqual([1, 2]);
  });
  it("should return the correct log indexes when searching on logs where the boundary crosses over multiple sections and skipped lines", () => {
    const lines = [
      "line 1",
      "line 2",
      "line 3",
      "line 4",
      "line 5",
      "line 6",
      "line 7",
      "line 8",
      "line 9",
      "line 10",
      "line 11",
    ];
    const getLine = vi.fn((index: number) => lines[index]);
    const processedLogLines: ProcessedLogLines = [
      0,
      {
        functionID: "function-1",
        functionName: "test",
        isOpen: true,
        range: { end: 3, start: 1 },
        rowType: RowType.SectionHeader,
      },
      {
        commandID: "command-1",
        commandName: "shell.exec",
        functionID: "function-1",
        isOpen: false,
        range: { end: 2, start: 1 },
        rowType: RowType.SubsectionHeader,
        step: "1 of 1",
      },
      {
        commandID: "command-2",
        commandName: "shell.exec",
        functionID: "function-1",
        isOpen: true,
        range: { end: 3, start: 2 },
        rowType: RowType.SubsectionHeader,
        step: "1 of 1",
      },
      { range: { end: 5, start: 3 }, rowType: RowType.SkippedLines },
      5,
      { range: { end: 8, start: 6 }, rowType: RowType.SkippedLines },
      {
        functionID: "function-8",
        functionName: "test",
        isOpen: false,
        range: { end: 11, start: 8 },
        rowType: RowType.SectionHeader,
      },
      {
        commandID: "command-8",
        commandName: "shell.exec",
        functionID: "function-1",
        isOpen: false,
        range: { end: 11, start: 8 },
        rowType: RowType.SubsectionHeader,
        step: "1 of 1",
      },
    ];
    const options = {
      getLine,
      lowerBound: 1,
      processedLogLines,
      searchRegex: /line/,
      upperBound: 9,
    };
    const matchingIndices = searchLogs(options);
    expect(matchingIndices).toStrictEqual([1, 2, 5, 8, 9]);
  });
});
