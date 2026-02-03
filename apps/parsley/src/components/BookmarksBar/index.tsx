import { useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import { Button } from "@leafygreen-ui/button";
import { palette } from "@leafygreen-ui/palette";
import { Tooltip } from "@leafygreen-ui/tooltip";
import { Icon, Popconfirm } from "@evg-ui/lib/components";
import { size } from "@evg-ui/lib/constants";
import { useQueryParam } from "@evg-ui/lib/hooks";
import { useLogWindowAnalytics } from "analytics";
import { QueryParams, urlParseOptions } from "constants/queryParams";

const { gray, green, red } = palette;

interface BookmarksBarProps {
  failingLine?: number;
  lineCount: number;
  scrollToLine: (lineNumber: number) => void;
}

const BookmarksBar: React.FC<BookmarksBarProps> = ({
  failingLine,
  lineCount,
  scrollToLine,
}) => {
  const { sendEvent } = useLogWindowAnalytics();

  const clearButtonRef = useRef(null);
  const [clearButtonConfirmationOpen, setClearButtonConfirmationOpen] =
    useState(false);
  const [shareLine] = useQueryParam<number | undefined>(
    QueryParams.ShareLine,
    undefined,
    urlParseOptions,
  );
  const [bookmarks, setBookmarks] = useQueryParam<number[]>(
    QueryParams.Bookmarks,
    [],
    urlParseOptions,
  );

  // Set the initial bookmarks on load.
  useEffect(() => {
    if (bookmarks.length === 0 && lineCount !== 0) {
      if (lineCount === 1) {
        setBookmarks([0]);
      } else {
        setBookmarks([0, lineCount - 1]);
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const lineNumbers = Array.from(
    new Set([
      ...bookmarks,
      ...(shareLine ? [shareLine] : []),
      ...(failingLine ? [failingLine] : []),
    ]),
  ).sort((a, b) => a - b);

  return (
    <Container>
      <Popconfirm
        data-cy="clear-bookmarks-popconfirm"
        onConfirm={() => {
          setBookmarks([]);
          sendEvent({ name: "Deleted all bookmarks" });
        }}
        open={clearButtonConfirmationOpen}
        refEl={clearButtonRef}
        setOpen={setClearButtonConfirmationOpen}
      >
        <div>Are you sure you want to clear all bookmarks?</div>
      </Popconfirm>
      <Tooltip
        trigger={
          <StyledButton
            ref={clearButtonRef}
            data-cy="clear-bookmarks"
            onClick={() => setClearButtonConfirmationOpen(true)}
            size="xsmall"
          >
            Clear
          </StyledButton>
        }
      >
        Clear all bookmarks
      </Tooltip>
      <LogLineContainer data-cy="bookmark-list">
        {lineNumbers.map((l) => (
          <LogLineNumber
            key={`bookmark-${l}`}
            data-cy={`bookmark-${l}`}
            failed={l === failingLine}
            onClick={() => {
              sendEvent({ name: "Used bookmark to navigate to a line" });
              scrollToLine(l);
            }}
          >
            <span data-bookmark={l}>{l}</span>
            {l === shareLine && (
              <StyledIcon data-cy="link-icon" glyph="Link" size="small" />
            )}
          </LogLineNumber>
        ))}
      </LogLineContainer>
    </Container>
  );
};

const StyledButton = styled(Button)`
  width: 52px;
`;

const LogLineContainer = styled.div`
  margin-left: ${size.xs};
  margin-top: ${size.xxs};
  align-self: start;
  cursor: pointer;
  overflow-y: scroll;
`;

const LogLineNumber = styled.div<{ failed: boolean }>`
  display: flex;
  align-items: center;
  font-size: 13px;
  line-height: 1.5em;
  font-family: "Source Code Pro";
  :hover {
    color: ${green.dark1};
  }
  ${({ failed }) => failed && `color: ${red.base};`}
`;

const StyledIcon = styled(Icon)`
  vertical-align: text-bottom;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  min-width: ${size.xl};
  width: fit-content;
  background-color: ${gray.light3};
  box-shadow: 0 ${size.xxs} ${size.xxs} rgba(0, 0, 0, 0.25);
  padding-top: ${size.s};
`;

export default BookmarksBar;
