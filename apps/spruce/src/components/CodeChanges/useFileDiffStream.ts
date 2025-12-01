import { useCallback, useRef, useEffect } from "react";
import { useHTMLStream } from "hooks/useHTMLStream";
import {
  getDiffLineType,
  getLineStyle,
  isNewFileDiff,
  isCommitBoundary,
  matchesFileName,
} from "./utils";

interface UseFileDiffStreamOptions {
  url: string | null;
  containerRef: React.RefObject<HTMLPreElement>;
  fileName: string;
  commitNumber?: number;
}

export const useFileDiffStream = ({
  commitNumber = 0,
  containerRef,
  fileName,
  url,
}: UseFileDiffStreamOptions) => {
  // Track state across line processing - use ref to persist across renders
  const stateRef = useRef({
    found: false,
    currentCommitIndex: 0,
    shouldRender: false,
  });

  // Reset state when url, fileName, or commitNumber changes
  useEffect(() => {
    stateRef.current = {
      found: false,
      currentCommitIndex: 0,
      shouldRender: false,
    };
  }, [url, fileName, commitNumber]);

  const processLine = useCallback(
    (lineContent: string) => {
      const state = stateRef.current;
      const isNewFile = isNewFileDiff(lineContent);
      const isNextCommit = isCommitBoundary(lineContent);

      // If we've already found and rendered our target file, stop at next file/commit boundary
      if ((isNewFile || isNextCommit) && state.found && state.shouldRender) {
        state.shouldRender = false;
        state.found = false;
        // Return empty to skip rendering (useHTMLStream will skip empty lines)
        return {
          htmlContent: "",
          style: undefined,
        };
      }

      // Handle new file diff lines
      if (isNewFile) {
        if (matchesFileName(lineContent, fileName)) {
          // Check if this is the commit occurrence we're looking for
          // commitNumber is 0-indexed: 0 = first occurrence, 1 = second, etc.
          if (state.currentCommitIndex === commitNumber) {
            state.found = true;
            state.shouldRender = true;
          } else {
            // This file appears in a different commit occurrence, increment counter
            state.currentCommitIndex += 1;
            state.found = false;
            state.shouldRender = false;
          }
        } else {
          // Different file, don't change commit index
          state.found = false;
          state.shouldRender = false;
        }
      }

      // Handle commit boundaries
      // When we hit a commit boundary, we don't reset the commit index
      // because the same file can appear in multiple commits, and we want
      // to track which occurrence we're on across the entire patch

      // Only render lines that belong to the target file
      if (state.shouldRender) {
        const diffType = getDiffLineType(lineContent);
        const style = getLineStyle(diffType);

        return {
          htmlContent: escapeHtml(lineContent),
          style,
        };
      }

      // Return empty content for filtered lines
      // useHTMLStream will skip creating DOM elements for empty lines
      return {
        htmlContent: "",
        style: undefined,
      };
    },
    [fileName, commitNumber],
  );

  return useHTMLStream({
    url,
    containerRef,
    spanName: "fetchFileDiff",
    processLine,
  });
};

const escapeHtml = (unsafe: string) =>
  unsafe
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
