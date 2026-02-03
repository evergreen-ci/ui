import { useCallback, useEffect, useState } from "react";
import { conditionalToArray } from "@evg-ui/lib/utils";
import { UseSectionsResult } from "hooks/useSections";
import { ProcessedLogLines } from "types/logs";
import { findLineIndex } from "utils/findLineIndex";

/**
 * useOpenSectionAndScrollToLine hook is used to open sections containing given line number(s) and scroll to the first given line number.
 * This hook is designed to scroll even if sections are disabled.
 * @param processedLogLines These are the visible log lines that are currently rendered in the log pane.
 * @param openSectionsContainingLineNumbers This function is used to open the section containing the line number. The function returns true if
 * the section is already open and false otherwise.
 * @param scrollToLine This function is used to scroll to the line number.
 * @returns A setter function that accepts one or many line numbers so scroll to. If multiple lines numbers are passed, open
 * their corresponding sections and scroll to the first line.
 */
const useOpenSectionAndScrollToLine = (
  processedLogLines: ProcessedLogLines,
  openSectionsContainingLineNumbers: UseSectionsResult["openSectionsContainingLineNumbers"],
  scrollToLine: (lineNumber: number) => void,
) => {
  const [lineNumbers, setLineNumbers] = useState<number[] | undefined>();

  /**
   * When lineNumbers is set from the callback, calculate the next section state from
   * lineNumbers. If the next state is the same as the current state, scroll to the
   * first element in lineNumbers and reset lineNumbers. If the next state is different,
   * wait for processedLogLines to update in the following useEffect.
   */
  useEffect(() => {
    if (lineNumbers !== undefined) {
      const hasDiff = openSectionsContainingLineNumbers({
        lineNumbers,
      });
      if (!hasDiff) {
        const scrollIndex = findLineIndex(processedLogLines, lineNumbers[0]);
        scrollToLine(scrollIndex);
        setLineNumbers(undefined);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lineNumbers]);

  /**
   * When processedLogLines updates and lineNumbers is defined,
   * scroll to the first element in lineNumbers and reset lineNumbers.
   */
  useEffect(() => {
    if (lineNumbers !== undefined) {
      const scrollIndex = findLineIndex(processedLogLines, lineNumbers[0]);
      scrollToLine(scrollIndex);
      setLineNumbers(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [processedLogLines]);

  const openSectionAndScrollToLine = useCallback(
    (lineNumberInput: number | number[]) => {
      setLineNumbers(conditionalToArray(lineNumberInput, true));
    },
    [],
  );

  return openSectionAndScrollToLine;
};

export { useOpenSectionAndScrollToLine };
