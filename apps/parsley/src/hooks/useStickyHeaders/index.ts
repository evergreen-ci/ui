import { useState } from "react";
import { ProcessedLogLines } from "types/logs";
import {
  isLogRow,
  isSectionHeaderRow,
  isSubsectionHeaderRow,
} from "utils/logRowTypes";

export interface StickyHeaders {
  sectionHeader: number | null;
  subsectionHeader: number | null;
}

/** Height of a single sticky header in pixels */
const STICKY_HEADER_HEIGHT = 37;

/**
 * Calculate which sticky headers would be active for a given line index.
 * @param lineIndex - The index of the line to check.
 * @param processedLogLines - The processed log lines to analyze.
 * @returns An object containing the line indexes of the section and subsection headers.
 */
const calculateStickyHeadersForLine = (
  lineIndex: number,
  processedLogLines: ProcessedLogLines,
): StickyHeaders => {
  let sectionHeader: number | null = null;
  let subsectionHeader: number | null = null;

  for (let i = lineIndex; i >= 0; i--) {
    const line = processedLogLines[i];
    if (subsectionHeader === null && isSubsectionHeaderRow(line)) {
      subsectionHeader = i;
      if (line.isTopLevelCommand) {
        break;
      }
    }
    if (sectionHeader === null && isSectionHeaderRow(line)) {
      sectionHeader = i;
      break;
    }
  }

  // Validate that the line is actually within the header ranges.
  const targetLine = processedLogLines[lineIndex];
  if (isLogRow(targetLine)) {
    if (subsectionHeader !== null) {
      const subsectionLine = processedLogLines[subsectionHeader];
      if (
        isSubsectionHeaderRow(subsectionLine) &&
        (targetLine < subsectionLine.range.start ||
          targetLine >= subsectionLine.range.end)
      ) {
        subsectionHeader = null;
      }
    }

    if (sectionHeader !== null) {
      const sectionLine = processedLogLines[sectionHeader];
      if (
        isSectionHeaderRow(sectionLine) &&
        (targetLine < sectionLine.range.start ||
          targetLine >= sectionLine.range.end)
      ) {
        sectionHeader = null;
      }
    }
  }

  return { sectionHeader, subsectionHeader };
};

/**
 * Hook to track which section and subsection headers should be displayed as sticky
 * based on the currently visible range of log lines.
 * @param processedLogLines - The processed log lines to analyze.
 * @returns An object containing the line indexes of the current section and subsection headers.
 */
export const useStickyHeaders = (processedLogLines: ProcessedLogLines) => {
  const [stickyHeaderHeight, setStickyHeaderHeight] = useState(0);

  const onStickyHeaderHeightChange = (height: number) => {
    setStickyHeaderHeight(height);
  };

  const [stickyHeaders, setStickyHeaders] = useState<StickyHeaders>({
    sectionHeader: null,
    subsectionHeader: null,
  });

  const updateStickyHeaders = (startIndex: number) => {
    // Adjust the earliest visible index to account for sticky headers obscuring the top.
    const offset =
      stickyHeaderHeight > 0
        ? Math.ceil(stickyHeaderHeight / STICKY_HEADER_HEIGHT)
        : 0;
    const earliestVisibleIndex = Math.min(
      startIndex + offset,
      processedLogLines.length - 1,
    );
    const newStickyHeaders = calculateStickyHeadersForLine(
      earliestVisibleIndex,
      processedLogLines,
    );
    setStickyHeaders(newStickyHeaders);
  };

  const getScrollOffsetForLine = (lineIndex: number): number => {
    const headers = calculateStickyHeadersForLine(lineIndex, processedLogLines);
    const headerCount =
      (headers.sectionHeader !== null ? 1 : 0) +
      (headers.subsectionHeader !== null ? 1 : 0);
    return -headerCount * STICKY_HEADER_HEIGHT;
  };

  return {
    getScrollOffsetForLine,
    onStickyHeaderHeightChange,
    stickyHeaderHeight,
    stickyHeaders,
    updateStickyHeaders,
  };
};
