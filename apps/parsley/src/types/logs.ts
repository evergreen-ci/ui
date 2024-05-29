import { CaseSensitivity, MatchType } from "constants/enums";

type ExpandedLine = [number, number];
type ExpandedLines = ExpandedLine[];

interface Range {
  /** The starting line inclusive of the range */
  start: number;
  /** The ending line exclusive of the range */
  end: number;
}

interface SkippedLinesRow {
  rowType: "SkippedLines";
  range: Range;
}

type ProcessedLogLine = number | SkippedLinesRow;

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

export type {
  ExpandedLine,
  ExpandedLines,
  Filter,
  Filters,
  ProcessedLogLine,
  ProcessedLogLines,
  SelectedLineRange,
  SkippedLinesRow,
  Range,
};
