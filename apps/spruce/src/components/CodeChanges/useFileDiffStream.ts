import { useCallback, useRef, useEffect } from "react";
import { useHTMLStream } from "hooks/useHTMLStream";
import {
  getDiffLineType,
  getLineStyle,
  isNewFileDiff,
  isCommitBoundary,
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
  const stateRef = useRef({
    currentCommitIndex: 0,
    shouldRender: false,
  });

  // Reset state when dependencies change
  useEffect(() => {
    stateRef.current = {
      currentCommitIndex: 0,
      shouldRender: false,
    };
  }, [fileName, commitNumber]);

  const processLine = useCallback(
    (lineContent: string) => {
      const { currentCommitIndex, shouldRender } = stateRef.current;
      const isNewFile = isNewFileDiff(lineContent);
      const isNextCommit = isCommitBoundary(lineContent);

      // Stop rendering if we've already processed our target file and hit a boundary
      if (shouldRender && (isNewFile || isNextCommit)) {
        stateRef.current.shouldRender = false;
        return { htmlContent: "", style: undefined };
      }

      // Check if this is the start of our target file
      if (isNewFile) {
        const isTargetFile = lineContent.includes(fileName);
        const isTargetCommit = currentCommitIndex === commitNumber;

        if (isTargetFile && isTargetCommit) {
          stateRef.current.shouldRender = true;
        } else if (isTargetFile) {
          // Found the file but wrong commit occurrence
          stateRef.current.currentCommitIndex += 1;
          stateRef.current.shouldRender = false;
        } else {
          // Different file
          stateRef.current.shouldRender = false;
        }
      }

      // Render line if it belongs to the target file
      if (stateRef.current.shouldRender) {
        const diffType = getDiffLineType(lineContent);
        const style = getLineStyle(diffType);
        return {
          htmlContent: escapeHtml(lineContent),
          style,
        };
      }

      return { htmlContent: "", style: undefined };
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
