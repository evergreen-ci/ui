import { useCallback, useMemo } from "react";
import { AnsiUp } from "ansi_up";
import linkifyHtml from "linkify-html";
import {
  getSeverityMapping,
  mapLogLevelToColor,
  trimSeverity,
} from "@evg-ui/lib/utils/string/logs";
import { useHTMLStream } from "hooks/useHTMLStream";

interface UseHTMLLogStreamOptions {
  url: string | null;
  containerRef: React.RefObject<HTMLPreElement>;
}

export const useHTMLLogStream = ({
  containerRef,
  url,
}: UseHTMLLogStreamOptions) => {
  const ansiUp = useMemo(() => new AnsiUp(), []);

  const processLine = useCallback(
    (lineContent: string) => {
      let processedContent = lineContent;

      const severity = processedContent.startsWith("[P: ")
        ? getSeverityMapping(Number(processedContent.substring(3, 6)))
        : null;

      if (severity) {
        processedContent = trimSeverity(processedContent);
      }

      return {
        htmlContent: linkifyHtml(ansiUp.ansi_to_html(processedContent)),
        style: severity ? { color: mapLogLevelToColor[severity] } : undefined,
      };
    },
    [ansiUp],
  );

  return useHTMLStream({
    url,
    containerRef,
    spanName: "fetchLogFile",
    processLine,
  });
};
