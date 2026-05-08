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
  SubsectionHeader = "SubsectionHeader",
}

interface SkippedLinesRow {
  rowType: RowType.SkippedLines;
  range: Range;
}

interface SectionHeaderRow {
  functionID: string;
  functionName: string | undefined;
  isOpen: boolean;
  range: Range;
  rowType: RowType.SectionHeader;
}

interface SubsectionHeaderRow {
  commandDescription: string | undefined;
  commandID: string;
  commandName: string;
  functionID: string;
  isOpen: boolean;
  range: Range;
  rowType: RowType.SubsectionHeader;
  step: string;
  isTopLevelCommand: boolean;
}

type ProcessedLogLine =
  | number
  | SkippedLinesRow
  | SectionHeaderRow
  | SubsectionHeaderRow;

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

enum ScrollAlign {
  Start = "start",
  Center = "center",
  End = "end",
}

export { RowType, ScrollAlign };

export type {
  ExpandedLine,
  ExpandedLines,
  Filter,
  Filters,
  ProcessedLogLine,
  ProcessedLogLines,
  SectionHeaderRow,
  SubsectionHeaderRow,
  SelectedLineRange,
  SkippedLinesRow,
  Range,
};
