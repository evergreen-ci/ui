import { useEffect, useRef, useState } from "react";
import { Button } from "@leafygreen-ui/button";
import { palette } from "@leafygreen-ui/palette";
import { fontFamilies } from "@leafygreen-ui/tokens";
import { Tooltip } from "@leafygreen-ui/tooltip";
import { css } from "@linaria/core";
import { styled } from "@linaria/react";
import Icon from "@evg-ui/lib/components/Icon";
import Popconfirm from "@evg-ui/lib/components/Popconfirm";
import { size } from "@evg-ui/lib/constants/tokens";
import { useQueryParam } from "@evg-ui/lib/hooks";
import { useLogWindowAnalytics } from "analytics";
import { QueryParams, urlParseOptions } from "constants/queryParams";

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
        data-testid="clear-bookmarks-popconfirm"
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
            data-testid="clear-bookmarks"
            onClick={() => setClearButtonConfirmationOpen(true)}
            size="xsmall"
          >
            Clear
          </StyledButton>
        }
      >
        Clear all bookmarks
      </Tooltip>
      <LogLineContainer data-testid="bookmark-list">
        {lineNumbers.map((l) => (
          <LogLineNumber
            key={`bookmark-${l}`}
            data-failed={l === failingLine}
            data-testid={`bookmark-${l}`}
            onClick={() => {
              sendEvent({ name: "Used bookmark to navigate to a line" });
              scrollToLine(l);
            }}
          >
            <span data-bookmark={l}>{l}</span>
            {l === shareLine && (
              <Icon
                className={iconStyle}
                data-testid="link-icon"
                glyph="Link"
                size="small"
              />
            )}
          </LogLineNumber>
        ))}
      </LogLineContainer>
    </Container>
  );
};

const StyledButton = styled(
  Button as React.FC<React.ComponentProps<typeof Button>>,
)`
  width: 52px;
`;

const LogLineContainer = styled.div`
  margin-left: ${size.xs};
  margin-top: ${size.xxs};
  align-self: start;
  cursor: pointer;
  overflow-y: scroll;
`;

const LogLineNumber = styled.div`
  display: flex;
  align-items: center;
  font-size: 13px;
  line-height: 1.5em;
  font-family: ${fontFamilies.code};
  &[data-failed="true"] {
    color: ${palette.red.base};
  }
  :hover {
    color: ${palette.green.dark1};
  }
`;

const iconStyle = css`
  vertical-align: text-bottom;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  min-width: ${size.xl};
  width: fit-content;
  background-color: ${palette.gray.light3};
  box-shadow: 0 ${size.xxs} ${size.xxs} rgba(0, 0, 0, 0.25);
  padding-top: ${size.s};
`;

export default BookmarksBar;
