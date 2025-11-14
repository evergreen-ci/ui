import { AnsiUp } from "ansi_up";
import linkifyHtml from "linkify-html";
import {
  getSeverityMapping,
  mapLogLevelToColor,
  trimSeverity,
} from "@evg-ui/lib/utils/string/logs";
import BaseRow from "components/LogRow/BaseRow";
import { LogLineRow } from "../types";

interface AnsiRowProps extends LogLineRow {}

const AnsiRow: React.FC<AnsiRowProps> = ({ getLine, lineNumber, ...rest }) => {
  const ansiUp = new AnsiUp();

  let lineContent = getLine(lineNumber);

  if (lineContent === undefined) {
    return null;
  }

  const severity = lineContent.startsWith("[P: ")
    ? getSeverityMapping(Number(lineContent.substring(3, 6)))
    : null;

  if (severity) {
    // Trim "[P: NN] " priority prefix
    lineContent = trimSeverity(lineContent);
  }

  const linkifiedLine = linkifyHtml(ansiUp.ansi_to_html(lineContent ?? ""), {
    validate: {
      url: (value: string) => /^(http)s?:\/\//.test(value),
    },
  });

  return (
    <BaseRow
      color={severity ? mapLogLevelToColor[severity] : undefined}
      data-cy="ansi-row"
      lineNumber={lineNumber}
      {...rest}
    >
      {linkifiedLine}
    </BaseRow>
  );
};

AnsiRow.displayName = "AnsiRow";

export default AnsiRow;
