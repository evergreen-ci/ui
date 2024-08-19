import { ProcessedLogLine, RowType } from "types/logs";
import { includesLineNumber } from ".";

describe("includesLineNumber", () => {
  it("should return false if lineNumber is undefined", () => {
    const logLine: ProcessedLogLine = 5;
    const result = includesLineNumber(logLine, undefined);
    expect(result).toBe(false);
  });

  describe("when logLine is a number", () => {
    it("returns true when logLine matches lineNumber", () => {
      expect(includesLineNumber(5, 5)).toBe(true);
    });

    it("returns false when logLine does not match lineNumber", () => {
      expect(includesLineNumber(5, 10)).toBe(false);
    });
  });

  describe("when logLine is a SkippedLinesRow", () => {
    it("returns true when range includes lineNumber", () => {
      const logLine: ProcessedLogLine = {
        range: { end: 10, start: 1 },
        rowType: RowType.SkippedLines,
      };
      expect(includesLineNumber(logLine, 9)).toBe(true);
      expect(includesLineNumber(logLine, 3)).toBe(true);
      expect(includesLineNumber(logLine, 1)).toBe(true);
    });

    it("returns false when range does not include lineNumber", () => {
      const logLine: ProcessedLogLine = {
        range: { end: 20, start: 10 },
        rowType: RowType.SkippedLines,
      };
      expect(includesLineNumber(logLine, 20)).toBe(false);
      expect(includesLineNumber(logLine, 21)).toBe(false);
      expect(includesLineNumber(logLine, 9)).toBe(false);
    });
  });

  describe("when logLine is a SectionHeaderRow", () => {
    it("returns true when range includes lineNumber", () => {
      const logLine: ProcessedLogLine = {
        functionID: "func1",
        functionName: "Function 1",
        isOpen: true,
        range: { end: 10, start: 1 },
        rowType: RowType.SectionHeader,
      };
      expect(includesLineNumber(logLine, 9)).toBe(true);
      expect(includesLineNumber(logLine, 3)).toBe(true);
      expect(includesLineNumber(logLine, 1)).toBe(true);
    });

    it("returns false when range does not include lineNumber", () => {
      const logLine: ProcessedLogLine = {
        functionID: "func1",
        functionName: "Function 1",
        isOpen: true,
        range: { end: 10, start: 1 },
        rowType: RowType.SectionHeader,
      };
      expect(includesLineNumber(logLine, 11)).toBe(false);
      expect(includesLineNumber(logLine, 10)).toBe(false);
      expect(includesLineNumber(logLine, 0)).toBe(false);
    });
  });

  describe("when logLine is a SubsectionHeaderRow", () => {
    it("returns true when range includes lineNumber", () => {
      const logLine: ProcessedLogLine = {
        commandID: "cmd1",
        commandName: "Command 1",
        functionID: "func1",
        isOpen: true,
        isTopLevelCommand: false,
        range: { end: 10, start: 1 },
        rowType: RowType.SubsectionHeader,
        step: "1.1 of 4",
      };
      expect(includesLineNumber(logLine, 9)).toBe(true);
      expect(includesLineNumber(logLine, 3)).toBe(true);
      expect(includesLineNumber(logLine, 1)).toBe(true);
    });

    it("returns false when range does not include lineNumber", () => {
      const logLine: ProcessedLogLine = {
        commandID: "cmd1",
        commandName: "Command 1",
        functionID: "func1",
        isOpen: true,
        isTopLevelCommand: false,
        range: { end: 10, start: 1 },
        rowType: RowType.SubsectionHeader,
        step: "1.1 of 4",
      };
      expect(includesLineNumber(logLine, 11)).toBe(false);
      expect(includesLineNumber(logLine, 10)).toBe(false);
      expect(includesLineNumber(logLine, 0)).toBe(false);
    });
  });
});
