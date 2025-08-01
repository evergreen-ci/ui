import { useCallback } from "react";
import styled from "@emotion/styled";
import IconButton from "@leafygreen-ui/icon-button";
import { palette } from "@leafygreen-ui/palette";
import Icon from "@evg-ui/lib/components/Icon";
import { fontSize, size } from "@evg-ui/lib/constants/tokens";
import { useQueryParam } from "@evg-ui/lib/hooks";
import { useLogWindowAnalytics } from "analytics";
import { WordWrapFormat } from "constants/enums";
import { QueryParams, urlParseOptions } from "constants/queryParams";
import { useMultiLineSelectContext } from "context/MultiLineSelectContext";
import { LogLineRow } from "../types";
import { isLineInRange } from "../utils";
import Highlighter from "./Highlighter";
import LineNumber from "./LineNumber";
import SharingMenu from "./SharingMenu";

const { red, yellow } = palette;

interface BaseRowProps extends Omit<LogLineRow, "getLine"> {
  children: string;
  "data-cy"?: string;
  color?: string;
}

/**
 * `BaseRow` is meant to be used as a wrapper for all rows in the log view.
 * It is responsible for handling any highlights for the row, as well as rendering line counts and bookmarks.
 * @param BaseRowProps - props to be passed to the BaseRow component
 * @param BaseRowProps.children - the text to be rendered
 * @param BaseRowProps."data-cy" - data-cy attribute to be added to the row
 * @param BaseRowProps.lineIndex - the index of the line in the log
 * @param BaseRowProps.failingLine - the failing log line number
 * @param BaseRowProps.highlightRegex - the regex to be highlighted
 * @param BaseRowProps.lineNumber - the line number of the line in the log
 * @param BaseRowProps.searchLine - the line number of the line that was searched for
 * @param BaseRowProps.searchTerm - the term that was searched for
 * @param BaseRowProps.color - the color of the highlight
 * @param BaseRowProps.wordWrapFormat - the word wrap format to be used aggressive or standard
 * @param BaseRowProps.wrap - whether or not the text should wrap
 * @param BaseRowProps.scrollToLine - function to scroll to a line
 * @param BaseRowProps.range - the range of lines to be displayed
 * @returns the base row component
 */
const BaseRow: React.FC<BaseRowProps> = ({
  children,
  color,
  "data-cy": dataCyText,
  failingLine,
  highlightRegex,
  lineIndex,
  lineNumber,
  range,
  scrollToLine,
  searchLine,
  searchTerm,
  wordWrapFormat,
  wrap,
  ...rest
}) => {
  const { sendEvent } = useLogWindowAnalytics();
  const { menuPosition, selectedLines } = useMultiLineSelectContext();
  const [shareLine, setShareLine] = useQueryParam<number | undefined>(
    QueryParams.ShareLine,
    undefined,
    urlParseOptions,
  );

  const [bookmarks, setBookmarks] = useQueryParam<number[]>(
    QueryParams.Bookmarks,
    [],
    urlParseOptions,
  );
  const inRange = isLineInRange(range, lineNumber);

  const bookmarked = bookmarks.includes(lineNumber);
  const failed = failingLine === lineNumber;
  const highlighted = searchLine === lineNumber;
  const shared = shareLine === lineNumber;

  // Clicking link icon should set or unset the share line.
  const handleClick = useCallback(() => {
    if (shared) {
      setShareLine(undefined);
      sendEvent({ name: "Deleted share line" });
    } else {
      setShareLine(lineNumber);
      scrollToLine(lineIndex);
      sendEvent({ name: "Created new share line" });
    }
  }, [lineIndex, lineNumber, shared, scrollToLine, sendEvent, setShareLine]);

  // Double clicking a line should add or remove the line from bookmarks.
  const handleDoubleClick = useCallback(() => {
    if (bookmarks.includes(lineNumber)) {
      const newBookmarks = bookmarks.filter((b) => b !== lineNumber);
      setBookmarks(newBookmarks);
      sendEvent({ name: "Deleted bookmark" });
    } else {
      const newBookmarks = [...bookmarks, lineNumber].sort((a, b) => a - b);
      setBookmarks(newBookmarks);
      sendEvent({ name: "Created bookmark" });
    }
  }, [bookmarks, lineNumber, sendEvent, setBookmarks]);

  const isLineBetweenSelectedLines =
    (selectedLines.startingLine !== undefined &&
      selectedLines.endingLine !== undefined &&
      lineNumber >= selectedLines.startingLine &&
      lineNumber <= selectedLines.endingLine) ||
    selectedLines.startingLine === lineNumber;

  return (
    <RowContainer
      {...rest}
      bookmarked={bookmarked}
      data-bookmarked={bookmarked}
      data-cy={`log-row-${lineNumber}`}
      data-failed={failed}
      data-highlighted={highlighted}
      data-shared={shared}
      failed={failed}
      highlighted={highlighted || isLineBetweenSelectedLines}
      onDoubleClick={handleDoubleClick}
      shared={shared}
    >
      {menuPosition === lineNumber ? (
        <SharingMenu />
      ) : (
        // @ts-expect-error: Styled LeafyGreen component throws an error
        <MenuIcon aria-label="Share link" onClick={handleClick}>
          <ShareIcon
            data-cy={`log-link-${lineNumber}`}
            glyph={shared ? "ArrowWithCircle" : "Link"}
            onClick={handleClick}
            size="small"
          />
        </MenuIcon>
      )}
      <LineNumber lineNumber={lineNumber} />
      <StyledPre shouldWrap={wrap} wordWrapFormat={wordWrapFormat}>
        <Highlighter
          color={color}
          data-cy={dataCyText}
          highlights={highlightRegex}
          searchTerm={inRange ? searchTerm : undefined}
        >
          {children}
        </Highlighter>
      </StyledPre>
    </RowContainer>
  );
};

BaseRow.displayName = "BaseRow";

const RowContainer = styled.div<{
  bookmarked: boolean;
  failed: boolean;
  highlighted: boolean;
  shared: boolean;
}>`
  display: flex;
  align-items: flex-start;

  font-family: "Source Code Pro", monospace;
  line-height: 1.25;
  font-size: ${fontSize.m};
  padding-left: 1px;

  ${({ failed }) => failed && `background-color: ${yellow.light3};`}
  ${({ shared }) => shared && `background-color: ${yellow.light3};`}
  ${({ bookmarked }) => bookmarked && `background-color: ${yellow.light3};`}
  ${({ highlighted }) => highlighted && `background-color: ${red.light3};`}
  width: fit-content;
  // Hover should be an overlay shadow so that the user can see the color underneath.
  :hover {
    box-shadow: inset 0 0 0 999px rgba(0, 0, 0, 0.1);
  }
`;

const ShareIcon = styled(Icon)`
  cursor: pointer;
  user-select: none;
  flex-shrink: 0;
`;

const StyledPre = styled.pre<{
  shouldWrap: boolean;
  wordWrapFormat: WordWrapFormat;
}>`
  overflow-y: hidden;
  margin-top: 0;
  margin-bottom: 0;
  margin-right: ${size.xs};
  /* Remove overflow on pre */
  overflow: visible;
  font-family: inherit;
  line-height: inherit;
  font-size: inherit;
  ${({ shouldWrap, wordWrapFormat }) =>
    shouldWrap &&
    wordWrapFormat === WordWrapFormat.Aggressive &&
    ` /* wrap on any character */ overflow-wrap: anywhere;`}
  ${({ shouldWrap }) =>
    shouldWrap && ` /* wrap multiple lines */ white-space: break-spaces;`}
`;

const MenuIcon = styled(IconButton)`
  height: ${size.s};
  width: ${size.s};
  margin-left: ${size.xxs};
`;
export default BaseRow;
