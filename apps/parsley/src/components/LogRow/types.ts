import { WordWrapFormat } from "constants/enums";

interface Row {
  lineIndex: number;
}

interface LogLineRow extends Row {
  getLine: (index: number) => string | undefined;
  scrollToLine: (lineNumber: number) => void;

  failingLine?: number;
  highlightRegex?: RegExp;
  lineNumber: number;
  prettyPrint: boolean;
  range: {
    lowerRange: number;
    upperRange?: number;
  };
  searchLine?: number;
  searchTerm?: RegExp;
  wordWrapFormat: WordWrapFormat;
  wrap: boolean;
}

export type { LogLineRow, Row };
