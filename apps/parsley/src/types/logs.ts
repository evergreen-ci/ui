import range from "lodash/range";
import { CaseSensitivity, MatchType } from "constants/enums";

type ExpandedLine = [number, number];
type ExpandedLines = ExpandedLine[];

export interface SkippedLinesRow {
  rowType: "SkippedLines";
  lineStart: number;
  lineEnd: number;
}

type ProcessedLogLine = number | number[] | SkippedLinesRow;

type ProcessedLogLines = ProcessedLogLine[];
export const isSkippedLinesRow = (
  logLine: ProcessedLogLine,
): logLine is SkippedLinesRow =>
  typeof logLine === "object" &&
  "rowType" in logLine &&
  logLine.rowType === "SkippedLines";
export const getSkippedLinesRange = (logLine: SkippedLinesRow): number[] =>
  range(logLine.lineStart, logLine.lineEnd + 1);

export const isNumberArray = (logLine: ProcessedLogLine): logLine is number[] =>
  Array.isArray(logLine);

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
};
