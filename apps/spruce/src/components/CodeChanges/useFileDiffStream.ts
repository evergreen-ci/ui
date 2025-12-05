import { useCallback, useRef, useEffect } from "react";
import { useHTMLStream } from "hooks/useHTMLStream";
import {
  escapeHtml,
  getDiffLineType,
  getLineStyle,
  isNewFileDiff,
} from "./utils";

interface UseFileDiffStreamOptions {
  url: string | null;
  containerRef: React.RefObject<HTMLPreElement>;
  fileName: string;
}

export const useFileDiffStream = ({
  containerRef,
  fileName,
  url,
}: UseFileDiffStreamOptions) => {
  const shouldRenderRef = useRef(false);

  useEffect(() => {
    shouldRenderRef.current = false;
  }, [fileName]);

  const processLine = useCallback(
    (lineContent: string) => {
      const isNewFile = isNewFileDiff(lineContent);

      if (isNewFile && shouldRenderRef.current) {
        shouldRenderRef.current = false;
        return { htmlContent: "", style: undefined };
      }

      if (isNewFile) {
        // Extract filename from after 'b/' in git diff output
        const filePathMatch = lineContent.match(/b\/(.+)$/);
        if (filePathMatch) {
          const filePath = filePathMatch[1].trim();
          const normalizedFileName = fileName.trim();
          shouldRenderRef.current = filePath === normalizedFileName;
        } else {
          shouldRenderRef.current = false;
        }
      }

      if (shouldRenderRef.current) {
        const diffType = getDiffLineType(lineContent);
        const style = getLineStyle(diffType);
        return {
          htmlContent: escapeHtml(lineContent),
          style,
        };
      }

      return { htmlContent: "", style: undefined };
    },
    [fileName],
  );

  return useHTMLStream({
    url,
    containerRef,
    spanName: "fetchFileDiff",
    processLine,
  });
};
