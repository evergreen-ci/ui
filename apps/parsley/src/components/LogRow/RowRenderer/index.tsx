import { LogRenderingTypes } from "constants/enums";
import { useLogContext } from "context/LogContext";
import { useHighlightParam } from "hooks/useHighlightParam";
import { ProcessedLogLines } from "types/logs";
import {
  isSectionHeaderRow,
  isSkippedLinesRow,
  isSubsectionHeaderRow,
} from "utils/logRowTypes";
import AnsiRow from "../AnsiRow";
import ResmokeRow from "../ResmokeRow";
import SectionHeader from "../SectionHeader";
import SkippedLinesRow from "../SkippedLinesRow";
import SubsectionHeader from "../SubsectionHeader";

type RowRendererFunction = (props: {
  processedLogLines: ProcessedLogLines;
}) => (index: number) => React.JSX.Element;

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
    if (isSkippedLinesRow(processedLogLine)) {
      return (
        <SkippedLinesRow
          expandLines={expandLines}
          lineIndex={index}
          range={processedLogLine.range}
        />
      );
    }

    if (isSectionHeaderRow(processedLogLine)) {
      return (
        <SectionHeader
          failingLine={failingLine}
          lineIndex={index}
          sectionHeaderLine={processedLogLine}
        />
      );
    }

    if (isSubsectionHeaderRow(processedLogLine)) {
      return (
        <SubsectionHeader
          failingLine={failingLine}
          lineIndex={index}
          subsectionHeaderLine={processedLogLine}
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
        prettyPrint={prettyPrint}
        range={range}
        scrollToLine={scrollToLine}
        searchLine={searchLine}
        searchTerm={searchRegex}
        wordWrapFormat={wordWrapFormat}
        wrap={wrap}
      />
    );
  };

  return result;
};

export { ParsleyRow };
