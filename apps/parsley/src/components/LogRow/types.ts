import { WordWrapFormat } from "constants/enums";

enum RowType {
  LogLine,
  SectionHeader,
  SkippedLines,
}

interface Row {
  lineIndex: number;
  lineStart: number;
  rowType: RowType;
}

interface LogLineRow extends Row {
  getLine: (index: number) => string | undefined;
  scrollToLine: (lineNumber: number) => void;

  failingLine?: number;
  highlightRegex?: RegExp;
  lineNumber: number;
  range: {
    lowerRange: number;
    upperRange?: number;
  };
  searchLine?: number;
  searchTerm?: RegExp;
  wordWrapFormat: WordWrapFormat;
  wrap: boolean;
}

interface SkippedLinesRow extends Row {
  lineEnd: number;
}

interface SectionHeaderRow extends Row {
  lineEnd: number;
}

export type { LogLineRow, SkippedLinesRow, SectionHeaderRow };
export { RowType };
