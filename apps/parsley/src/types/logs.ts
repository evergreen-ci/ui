import { CaseSensitivity, MatchType } from "constants/enums";

type ExpandedLine = [number, number];
type ExpandedLines = ExpandedLine[];

interface Range {
  /** The starting line inclusive of the range */
  start: number;
  /** The ending line exclusive of the range */
  end: number;
}
enum RowType {
  SkippedLines = "SkippedLines",
  SectionHeader = "SectionHeader",
}

interface SkippedLinesRow {
  rowType: RowType.SkippedLines;
  range: Range;
}

interface SectionHeaderRow {
  rowType: RowType.SectionHeader;
  functionName: string;
  range: Range;
  isOpen: boolean;
}

type ProcessedLogLine = number | SkippedLinesRow | SectionHeaderRow;

type ProcessedLogLines = ProcessedLogLine[];

type Filter = {
  expression: string;
  visible: boolean;
  caseSensitive: CaseSensitivity;
  matchType: MatchType;
};
type Filters = Filter[];

type SelectedLineRange = {
  startingLine?: number;
  endingLine?: number;
};

export { RowType };

export type {
  ExpandedLine,
  ExpandedLines,
  Filter,
  Filters,
  ProcessedLogLine,
  ProcessedLogLines,
  SectionHeaderRow,
  SelectedLineRange,
  SkippedLinesRow,
  Range,
};
