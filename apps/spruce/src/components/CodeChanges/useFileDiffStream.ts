import { useCallback, useRef, useEffect } from "react";
import { useHTMLStream } from "hooks/useHTMLStream";
import { getDiffLineType, getLineStyle, isNewFileDiff } from "./utils";

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
    occurrenceIndex: 0,
    shouldRender: false,
  });

  useEffect(() => {
    stateRef.current = {
      occurrenceIndex: 0,
      shouldRender: false,
    };
  }, [fileName, commitNumber, url]);

  const processLine = useCallback(
    (lineContent: string) => {
      const isNewFile = isNewFileDiff(lineContent);

      if (stateRef.current.shouldRender && isNewFile) {
        stateRef.current.shouldRender = false;
        return { htmlContent: "", style: undefined };
      }

      if (isNewFile) {
        const filePathMatch = lineContent.match(/b\/(.+)$/);
        const filePath = filePathMatch ? filePathMatch[1] : "";
        const isTargetFile =
          filePath === fileName || lineContent.includes(fileName);

        if (isTargetFile) {
          // commitNumber is the 0-indexed occurrence index of this file
          // Show when occurrenceIndex matches commitNumber
          if (stateRef.current.occurrenceIndex === commitNumber) {
            stateRef.current.shouldRender = true;
          } else {
            stateRef.current.shouldRender = false;
          }
          stateRef.current.occurrenceIndex += 1;
        } else {
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
