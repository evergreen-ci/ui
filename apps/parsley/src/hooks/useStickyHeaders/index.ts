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
 * Hook to track which section and subsection headers should be displayed as sticky
 * based on the currently visible range of log lines.
 * @param processedLogLines - The processed log lines to analyze.
 * @returns An object containing the line indexes of the current section and subsection headers.
 */
export const useStickyHeaders = (processedLogLines: ProcessedLogLines) => {
  const [stickyHeaders, setStickyHeaders] = useState<StickyHeaders>({
    sectionHeader: null,
    subsectionHeader: null,
  });
  const [stickyHeaderHeight, setStickyHeaderHeight] = useState(0);

  const updateStickyHeaders = (startIndex: number) => {
    let sectionHeader: number | null = null;
    let subsectionHeader: number | null = null;

    // Adjust the earliest visible index to account for sticky headers obscuring the top.
    const offset =
      stickyHeaderHeight > 0
        ? Math.ceil(stickyHeaderHeight / STICKY_HEADER_HEIGHT)
        : 0;

    const earliestVisibleIndex = Math.min(
      startIndex + offset,
      processedLogLines.length - 1,
    );

    for (let i = earliestVisibleIndex; i >= 0; i--) {
      const line = processedLogLines[i];

      if (subsectionHeader === null && isSubsectionHeaderRow(line)) {
        subsectionHeader = i;
        if (line.isTopLevelCommand) {
          break; // If this subsection is a top-level command, we can stop looking.
        }
      }

      if (sectionHeader === null && isSectionHeaderRow(line)) {
        sectionHeader = i;
        break; // Once we find a section header, we can stop looking.
      }
    }

    // Some lines fall outside of any section or subsection. In that case, we should not show
    // any sticky headers.
    const lineNumber = processedLogLines[earliestVisibleIndex];
    if (isLogRow(lineNumber)) {
      if (subsectionHeader !== null) {
        const subsectionLine = processedLogLines[subsectionHeader];
        if (
          isSubsectionHeaderRow(subsectionLine) &&
          (lineNumber < subsectionLine.range.start ||
            lineNumber >= subsectionLine.range.end)
        ) {
          subsectionHeader = null;
        }
      }

      if (sectionHeader !== null) {
        const sectionLine = processedLogLines[sectionHeader];
        if (
          isSectionHeaderRow(sectionLine) &&
          (lineNumber < sectionLine.range.start ||
            lineNumber >= sectionLine.range.end)
        ) {
          sectionHeader = null;
        }
      }
    }
    setStickyHeaders({ sectionHeader, subsectionHeader });
  };

  const onStickyHeaderHeightChange = (height: number) => {
    setStickyHeaderHeight(height);
  };

  return { onStickyHeaderHeightChange, stickyHeaders, updateStickyHeaders };
};
