import { useEffect, useState } from "react";
import { ListRange } from "react-virtuoso";
import { useLogContext } from "context/LogContext";
import { useFilterParam } from "hooks/useFilterParam";
import usePrevious from "hooks/usePrevious";
import { findLineIndex } from "utils/findLineIndex";
import { isLogLineRow } from "utils/logRowTypes";

interface Props {
  visibleRange: ListRange | undefined;
}
/**
 * useMaintainLineVisibilityAfterTogglingFilter is a hook that maintains focus on the first line of the log pane after a filter is toggled.
 * @param props - The props object.
 * @param props.visibleRange - The visible range of lines in the log pane.
 */
const useMaintainLineVisibilityAfterTogglingFilter = ({
  visibleRange,
}: Props) => {
  const { processedLogLines, scrollToLine } = useLogContext();
  const previousProccessedLogLines = usePrevious(processedLogLines);
  const [filterParam] = useFilterParam();
  const previousFilterParam = usePrevious(filterParam);
  const [filterParamChanged, setFilterParamChanged] = useState(false);

  useEffect(() => {
    if (JSON.stringify(filterParam) !== JSON.stringify(previousFilterParam)) {
      setFilterParamChanged(true);
    }
  }, [filterParam, previousFilterParam]);

  useEffect(() => {
    // If the processed log lines have changed and the filter param has changed calculate
    // the line index of the first line in the new processed log line and scroll to it
    if (
      previousProccessedLogLines !== processedLogLines &&
      filterParamChanged
    ) {
      if (
        visibleRange?.startIndex !== undefined &&
        previousProccessedLogLines !== undefined
      ) {
        const processedLine =
          previousProccessedLogLines[visibleRange.startIndex];
        const lineValue = isLogLineRow(processedLine)
          ? processedLine
          : processedLine.range.start;
        const lineIndex = findLineIndex(processedLogLines, lineValue);
        scrollToLine(lineIndex);
      }
      setFilterParamChanged(false);
    }
  }, [
    processedLogLines,
    previousProccessedLogLines,
    filterParamChanged,
    scrollToLine,
    visibleRange?.startIndex,
  ]);
};

export { useMaintainLineVisibilityAfterTogglingFilter };
