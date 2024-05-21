import { CaseSensitivity, MatchType } from "constants/enums";

type ExpandedLine = [number, number];
type ExpandedLines = ExpandedLine[];

interface SkippedLinesRow {
  rowType: "SkippedLines";
  lineStart: number;
  lineEnd: number;
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
};
