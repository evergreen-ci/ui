import { useEffect, useState } from "react";
import { UseSectionsResult } from "hooks/useSections";
import { ProcessedLogLines } from "types/logs";
import { findLineIndex } from "utils/findLineIndex";

/**
 * useOpenSectionAndScrollToLine hook is used to open sections containing given line number(s) and scroll to the first given line number.
 * @param processedLogLines These are the vifsible log lines that are currently rendered in the log pane.
 * @param openSectionContainingLineNumber This function is used to open the section containing the line number. The function returns true if
 * the section is already open and false otherwise.
 * @param scroll This function is used to scroll to the line number.
 * @returns A setter function that accepts one or many line numbers so scroll to. If multiple lines numbers are passed, open
 * their corresponding sections and scroll to the first line.
 */
const useOpenSectionAndScrollToLine = (
  processedLogLines: ProcessedLogLines,
  openSectionContainingLineNumber: UseSectionsResult["openSectionContainingLineNumber"],
  scroll: (lineNumber: number) => void,
) => {
  const [lineNumber, setLineNumber] = useState<number | number[] | undefined>();

  useEffect(() => {
    if (lineNumber !== undefined) {
      const hasDiff = openSectionContainingLineNumber({
        lineNumber,
      });
      if (!hasDiff) {
        const scrollIndex = findLineIndex(
          processedLogLines,
          Array.isArray(lineNumber) ? lineNumber[0] : lineNumber,
        );
        scroll(scrollIndex);
        setLineNumber(undefined);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lineNumber]);

  useEffect(() => {
    if (lineNumber !== undefined) {
      const scrollIndex = findLineIndex(
        processedLogLines,
        Array.isArray(lineNumber) ? lineNumber[0] : lineNumber,
      );
      scroll(scrollIndex);
      setLineNumber(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [processedLogLines]);
  return setLineNumber;
};

export { useOpenSectionAndScrollToLine };
