import { AnsiUp } from "ansi_up";
import BaseRow from "components/LogRow/BaseRow";
import { LogLineRow } from "../types";

interface ResmokeRowProps extends LogLineRow {
  getResmokeLineColor: (lineNumber: number) => string | undefined;
}

const ResmokeRow: React.FC<ResmokeRowProps> = ({
  getLine,
  getResmokeLineColor,
  lineNumber,
  ...rest
}) => {
  const ansiUp = new AnsiUp();
  ansiUp.escape_html = false;

  const lineColor = getResmokeLineColor(lineNumber);
  let lineContent = getLine(lineNumber);

  if (lineContent === undefined) {
    return null;
  }

  lineContent = ansiUp.ansi_to_html(lineContent ?? "");

  return lineContent !== undefined ? (
    <BaseRow
      color={lineColor}
      data-cy="resmoke-row"
      lineNumber={lineNumber}
      {...rest}
    >
      {lineContent}
    </BaseRow>
  ) : null;
};

ResmokeRow.displayName = "ResmokeRow";

export default ResmokeRow;
