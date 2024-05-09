import { LogRenderingTypes } from "constants/enums";
import { useLogContext } from "context/LogContext";
import { useHighlightParam } from "hooks/useHighlightParam";
import { ProcessedLogLines } from "types/logs";
import { isCollapsedRow } from "utils/collapsedRow";
import AnsiRow from "../AnsiRow";
import CollapsedRow from "../CollapsedRow";
import ResmokeRow from "../ResmokeRow";
import { RowType } from "../types";

type RowRendererFunction = (props: {
  processedLogLines: ProcessedLogLines;
}) => (index: number) => JSX.Element;

const ParsleyRow: RowRendererFunction = ({ processedLogLines }) => {
  const {
    expandLines,
    failingLine,
    getLine,
    getResmokeLineColor,
    logMetadata,
    preferences,
    range,
    scrollToLine,
    searchLine,
    searchState,
  } = useLogContext();
  const { prettyPrint, wordWrapFormat, wrap } = preferences;

  const { searchTerm } = searchState;
  const searchRegex = searchTerm
    ? new RegExp(`(${searchTerm.source})`, searchTerm.ignoreCase ? "gi" : "g")
    : undefined;

  // Join the highlights into a single regex to match against. Use capture groups
  // to highlight each match.
  const [highlights] = useHighlightParam();
  const highlightRegex =
    highlights.length > 0
      ? new RegExp(`${highlights.map((h) => `(${h})`).join("|")}`, "gi")
      : undefined;

  let Row: typeof ResmokeRow | typeof AnsiRow;
  // At this point, logMetadata.renderingType is guaranteed to be defined from <LoadingPage />
  switch (logMetadata?.renderingType) {
    case LogRenderingTypes.Resmoke:
      Row = ResmokeRow;
      break;
    case LogRenderingTypes.Default:
      Row = AnsiRow;
      break;
    default:
      Row = AnsiRow;
      break;
  }

  const result = (index: number) => {
    const processedLogLine = processedLogLines[index];
    if (isCollapsedRow(processedLogLine)) {
      return (
        <CollapsedRow
          collapsedLines={processedLogLine}
          expandLines={expandLines}
          lineEnd={processedLogLine[processedLogLine.length - 1]}
          lineIndex={index}
          lineStart={processedLogLine[0]}
          rowType={RowType.SkippedLines}
        />
      );
    }

    return (
      <Row
        failingLine={failingLine}
        getLine={getLine}
        getResmokeLineColor={getResmokeLineColor}
        highlightRegex={highlightRegex}
        lineIndex={index}
        lineNumber={processedLogLine}
        lineStart={processedLogLine}
        prettyPrint={prettyPrint}
        range={range}
        rowType={RowType.LogLine}
        scrollToLine={scrollToLine}
        searchLine={searchLine}
        searchTerm={searchRegex}
        wordWrapFormat={wordWrapFormat}
        wrap={wrap}
      />
    );
  };

  result.displayName = `${logMetadata?.logType}RowRenderer`;
  return result;
};

export { ParsleyRow };
