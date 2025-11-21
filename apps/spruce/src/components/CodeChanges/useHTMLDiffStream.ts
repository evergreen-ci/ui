import { useCallback } from "react";
import { useHTMLStream } from "hooks/useHTMLStream";
import { getDiffLineType, getLineStyle } from "./utils";

interface UseHTMLDiffStreamOptions {
  url: string | null;
  containerRef: React.RefObject<HTMLPreElement>;
}

export const useHTMLDiffStream = ({
  containerRef,
  url,
}: UseHTMLDiffStreamOptions) => {
  const processLine = useCallback((lineContent: string) => {
    const diffType = getDiffLineType(lineContent);
    const style = getLineStyle(diffType);

    return {
      htmlContent: lineContent,
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
