import { useCallback } from "react";
import { useHTMLStream } from "hooks/useHTMLStream";
import { getDiffLineType, getLineStyle } from "./utils";

interface UsePatchDiffStreamOptions {
  url: string | null;
  containerRef: React.RefObject<HTMLPreElement>;
}

export const usePatchDiffStream = ({
  containerRef,
  url,
}: UsePatchDiffStreamOptions) => {
  const processLine = useCallback((lineContent: string) => {
    const diffType = getDiffLineType(lineContent);
    const style = getLineStyle(diffType);

    return {
      htmlContent: escapeHtml(lineContent),
      style,
    };
  }, []);

  return useHTMLStream({
    url,
    containerRef,
    spanName: "fetchDiffFile",
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
