import { AnsiUp } from "ansi_up";
import { useQueryParam } from "@evg-ui/lib/hooks";
import BaseRow from "components/LogRow/BaseRow";
import { QueryParams, urlParseOptions } from "constants/queryParams";
import { formatPrettyPrint } from "utils/prettyPrint";
import { LogLineRow } from "../types";

interface ResmokeRowProps extends LogLineRow {
  prettyPrint: boolean;
  getResmokeLineColor: (lineNumber: number) => string | undefined;
}

const ResmokeRow: React.FC<ResmokeRowProps> = ({
  getLine,
  getResmokeLineColor,
  lineNumber,
  prettyPrint = false,
  ...rest
}) => {
  const ansiUp = new AnsiUp();
  ansiUp.escape_html = false;

  const lineColor = getResmokeLineColor(lineNumber);
  const [bookmarks] = useQueryParam<number[]>(
    QueryParams.Bookmarks,
    [],
    urlParseOptions,
  );
  const bookmarked = bookmarks.includes(lineNumber);
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
      {bookmarked && prettyPrint ? formatPrettyPrint(lineContent) : lineContent}
    </BaseRow>
  ) : null;
};

ResmokeRow.displayName = "ResmokeRow";

export default ResmokeRow;
