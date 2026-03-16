import { ProcessedLogLines, SelectedLineRange } from "types/logs";
import { findLineIndex } from "utils/findLineIndex";
import {
  isSectionHeaderRow,
  isSkippedLinesRow,
  isSubsectionHeaderRow,
} from "utils/logRowTypes";

const getLinesInProcessedLogLinesFromSelectedLines = (
  processedLogLines: ProcessedLogLines,
  selectedLines: SelectedLineRange,
) => {
  const endingLine = selectedLines.endingLine ?? selectedLines.startingLine;
  const startingIndex = findLineIndex(
    processedLogLines,
    selectedLines.startingLine,
  );
  const endingIndex = findLineIndex(processedLogLines, endingLine);

  if (startingIndex === -1 || endingIndex === -1) return [];
  const lines: number[] = [];
  for (let i = startingIndex; i <= endingIndex; i++) {
    const line = processedLogLines[i];
    if (
      !(
        isSkippedLinesRow(line) ||
        isSectionHeaderRow(line) ||
        isSubsectionHeaderRow(line)
      )
    ) {
      lines.push(line);
    }
  }
  return lines;
};

const findCommonPrefix = (lines: string[]): string => {
  if (lines.length === 0) return "";
  if (lines.length === 1) return "";

  let prefix = lines[0];
  for (let i = 1; i < lines.length; i++) {
    while (lines[i].indexOf(prefix) !== 0) {
      prefix = prefix.substring(0, prefix.length - 1);
      if (prefix === "") return "";
    }
  }
  return prefix;
};

const getLinesWithoutPrefix = (
  lineNumbers: number[],
  getLine: (lineNumber: number) => string | undefined,
): string => {
  const lines = lineNumbers
    .map((lineNumber) => getLine(lineNumber))
    .filter((line): line is string => line !== undefined);

  const commonPrefix = findCommonPrefix(lines);

  if (commonPrefix === "") {
    return `${lines.join("\n")}\n`;
  }

  return `${lines.map((line) => line.substring(commonPrefix.length)).join("\n")}\n`;
};

export {
  findCommonPrefix,
  getLinesInProcessedLogLinesFromSelectedLines,
  getLinesWithoutPrefix,
};
