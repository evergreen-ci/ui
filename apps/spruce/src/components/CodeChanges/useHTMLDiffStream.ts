import { useCallback } from "react";
import linkifyHtml from "linkify-html";
import { useHTMLStream } from "hooks/useHTMLStream";
import { DiffType, getDiffLineType } from "./utils";

interface UseHTMLDiffStreamOptions {
  url: string | null;
  containerRef: React.RefObject<HTMLPreElement>;
}

// Get background color for diff line type
const getDiffBackgroundColor = (type: DiffType): string | undefined => {
  switch (type) {
    case DiffType.Addition:
      return "#d4edda"; // light green background for additions
    case DiffType.Deletion:
      return "#f8d7da"; // light red background for deletions
    default:
      return undefined;
  }
};

export const useHTMLDiffStream = ({
  containerRef,
  url,
}: UseHTMLDiffStreamOptions) => {
  const processLine = useCallback((lineContent: string) => {
    const diffType = getDiffLineType(lineContent);
    const backgroundColor = getDiffBackgroundColor(diffType);

    // Linkify URLs (linkifyHtml will escape HTML automatically)
    const htmlContent = linkifyHtml(lineContent);

    return {
      htmlContent,
      style: backgroundColor ? { backgroundColor } : undefined,
    };
  }, []);

  return useHTMLStream({
    url,
    containerRef,
    spanName: "fetchDiffFile",
    processLine,
  });
};
