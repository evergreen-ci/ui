import { act, renderHook } from "@testing-library/react";
import { ProcessedLogLines, RowType } from "types/logs";
import { useStickyHeaders } from ".";

describe("useStickyHeaders", () => {
  it("returns null headers when there are no lines", () => {
    const processedLogLines: ProcessedLogLines = [];
    const { result } = renderHook(() => useStickyHeaders(processedLogLines));
    expect(result.current.stickyHeaders).toEqual({
      sectionHeader: null,
      subsectionHeader: null,
    });
  });

  it("returns null headers when viewing regular log lines", () => {
    const processedLogLines: ProcessedLogLines = [0, 1, 2, 3, 4, 5];
    const { result } = renderHook(() => useStickyHeaders(processedLogLines));
    act(() => {
      result.current.updateStickyHeaders(2);
    });
    expect(result.current.stickyHeaders).toEqual({
      sectionHeader: null,
      subsectionHeader: null,
    });
  });

  describe("section headers", () => {
    it("returns section header when viewing lines within a section", () => {
      const processedLogLines: ProcessedLogLines = [
        0,
        {
          functionID: "function-1",
          functionName: "setup",
          isOpen: true,
          range: { end: 10, start: 1 },
          rowType: RowType.SectionHeader,
        },
        2,
        3,
        4,
        5,
      ];
      const { result } = renderHook(() => useStickyHeaders(processedLogLines));
      act(() => {
        result.current.updateStickyHeaders(2);
      });
      expect(result.current.stickyHeaders).toEqual({
        sectionHeader: 1,
        subsectionHeader: null,
      });
    });

    it("returns null when viewing lines outside section range", () => {
      const processedLogLines: ProcessedLogLines = [
        0,
        {
          functionID: "function-1",
          functionName: "setup",
          isOpen: true,
          range: { end: 5, start: 1 },
          rowType: RowType.SectionHeader,
        },
        2,
        3,
        4,
        // Following 2 lines are outside section range.
        5,
        6,
      ];
      const { result } = renderHook(() => useStickyHeaders(processedLogLines));
      act(() => {
        result.current.updateStickyHeaders(5);
      });
      expect(result.current.stickyHeaders).toEqual({
        sectionHeader: null,
        subsectionHeader: null,
      });
    });

    it("returns null when earliest visible line is before section range", () => {
      const processedLogLines: ProcessedLogLines = [
        0,
        {
          functionID: "function-1",
          functionName: "setup",
          isOpen: true,
          range: { end: 10, start: 5 },
          rowType: RowType.SectionHeader,
        },
        3,
        4,
      ];
      const { result } = renderHook(() => useStickyHeaders(processedLogLines));
      act(() => {
        result.current.updateStickyHeaders(0);
      });
      expect(result.current.stickyHeaders).toEqual({
        sectionHeader: null,
        subsectionHeader: null,
      });
    });
  });

  describe("subsection headers", () => {
    it("returns subsection header when viewing lines within a subsection", () => {
      const processedLogLines: ProcessedLogLines = [
        0,
        {
          commandDescription: "Run tests",
          commandID: "command-1",
          commandName: "shell.exec",
          functionID: "function-1",
          isOpen: true,
          isTopLevelCommand: false,
          range: { end: 10, start: 1 },
          rowType: RowType.SubsectionHeader,
          step: "1 of 3",
        },
        2,
        3,
        4,
      ];
      const { result } = renderHook(() => useStickyHeaders(processedLogLines));
      act(() => {
        result.current.updateStickyHeaders(2);
      });
      expect(result.current.stickyHeaders).toEqual({
        sectionHeader: null,
        subsectionHeader: 1,
      });
    });

    it("returns null when viewing lines outside subsection range", () => {
      const processedLogLines: ProcessedLogLines = [
        0,
        {
          commandDescription: "Run tests",
          commandID: "command-1",
          commandName: "shell.exec",
          functionID: "function-1",
          isOpen: true,
          isTopLevelCommand: false,
          range: { end: 5, start: 1 },
          rowType: RowType.SubsectionHeader,
          step: "1 of 3",
        },
        2,
        3,
        4,
        // Following 2 lines are outside subsection range.
        5,
        6,
      ];
      const { result } = renderHook(() => useStickyHeaders(processedLogLines));
      act(() => {
        result.current.updateStickyHeaders(5);
      });
      expect(result.current.stickyHeaders).toEqual({
        sectionHeader: null,
        subsectionHeader: null,
      });
    });

    it("stops looking when finding a top-level command", () => {
      const processedLogLines: ProcessedLogLines = [
        {
          functionID: "function-1",
          functionName: "setup",
          isOpen: true,
          range: { end: 15, start: 0 },
          rowType: RowType.SectionHeader,
        },
        1,
        {
          commandDescription: "Run tests",
          commandID: "command-1",
          commandName: "shell.exec",
          functionID: "function-1",
          isOpen: true,
          isTopLevelCommand: true,
          range: { end: 10, start: 2 },
          rowType: RowType.SubsectionHeader,
          step: "1 of 1",
        },
        3,
        4,
        5,
      ];
      const { result } = renderHook(() => useStickyHeaders(processedLogLines));
      act(() => {
        result.current.updateStickyHeaders(3);
      });
      // Should find the subsection header but stop looking for section header.
      expect(result.current.stickyHeaders).toEqual({
        sectionHeader: null,
        subsectionHeader: 2,
      });
    });
  });

  describe("nested sections and subsections", () => {
    it("returns both section and subsection headers when nested", () => {
      const processedLogLines: ProcessedLogLines = [
        {
          functionID: "function-1",
          functionName: "setup",
          isOpen: true,
          range: { end: 15, start: 0 },
          rowType: RowType.SectionHeader,
        },
        1,
        {
          commandDescription: "Run tests",
          commandID: "command-1",
          commandName: "shell.exec",
          functionID: "function-1",
          isOpen: true,
          isTopLevelCommand: false,
          range: { end: 10, start: 2 },
          rowType: RowType.SubsectionHeader,
          step: "1 of 3",
        },
        3, // Within both section and subsection.
        4,
        5,
      ];
      const { result } = renderHook(() => useStickyHeaders(processedLogLines));
      act(() => {
        result.current.updateStickyHeaders(3);
      });
      expect(result.current.stickyHeaders).toEqual({
        sectionHeader: 0,
        subsectionHeader: 2,
      });
    });

    it("returns only section header when between subsections", () => {
      const processedLogLines: ProcessedLogLines = [
        {
          functionID: "function-1",
          functionName: "setup",
          isOpen: true,
          range: { end: 20, start: 0 },
          rowType: RowType.SectionHeader,
        },
        {
          commandDescription: "First command",
          commandID: "command-1",
          commandName: "shell.exec",
          functionID: "function-1",
          isOpen: true,
          isTopLevelCommand: false,
          range: { end: 5, start: 1 },
          rowType: RowType.SubsectionHeader,
          step: "1 of 3",
        },
        2,
        3,
        4,
        5, // Between subsections, within section
        6, // Between subsections, within section
        {
          commandDescription: "Second command",
          commandID: "command-2",
          commandName: "shell.exec",
          functionID: "function-1",
          isOpen: true,
          isTopLevelCommand: false,
          range: { end: 15, start: 7 },
          rowType: RowType.SubsectionHeader,
          step: "2 of 3",
        },
      ];
      const { result } = renderHook(() => useStickyHeaders(processedLogLines));
      act(() => {
        result.current.updateStickyHeaders(5);
      });
      expect(result.current.stickyHeaders).toEqual({
        sectionHeader: 0,
        subsectionHeader: null,
      });
    });
  });

  describe("edge cases", () => {
    it("handles viewing the section header itself", () => {
      const processedLogLines: ProcessedLogLines = [
        {
          functionID: "function-1",
          functionName: "setup",
          isOpen: true,
          range: { end: 10, start: 0 },
          rowType: RowType.SectionHeader,
        },
        1,
        2,
      ];
      const { result } = renderHook(() => useStickyHeaders(processedLogLines));
      act(() => {
        result.current.updateStickyHeaders(0);
      });
      expect(result.current.stickyHeaders).toEqual({
        sectionHeader: 0,
        subsectionHeader: null,
      });
    });

    it("handles viewing the subsection header itself", () => {
      const processedLogLines: ProcessedLogLines = [
        {
          commandDescription: "Run tests",
          commandID: "command-1",
          commandName: "shell.exec",
          functionID: "function-1",
          isOpen: true,
          isTopLevelCommand: false,
          range: { end: 10, start: 0 },
          rowType: RowType.SubsectionHeader,
          step: "1 of 3",
        },
        1,
        2,
      ];
      const { result } = renderHook(() => useStickyHeaders(processedLogLines));
      act(() => {
        result.current.updateStickyHeaders(0);
      });
      expect(result.current.stickyHeaders).toEqual({
        sectionHeader: null,
        subsectionHeader: 0,
      });
    });
  });
});
