import { useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import { palette } from "@leafygreen-ui/palette";
import Tooltip from "@leafygreen-ui/tooltip";
import { useLogWindowAnalytics } from "analytics";
import Icon from "components/Icon";
import Popconfirm from "components/Popconfirm";
import { QueryParams } from "constants/queryParams";
import { size, zIndex } from "constants/tokens";
import { useQueryParam } from "hooks/useQueryParam";
import { findLineIndex } from "utils/findLineIndex";

const { gray, green, red } = palette;

interface BookmarksBarProps {
  failingLine?: number;
  lineCount: number;
  processedLogLines: (number | number[])[];
  scrollToLine: (scrollIndex: number) => void;
}

const BookmarksBar: React.FC<BookmarksBarProps> = ({
  failingLine,
  lineCount,
  processedLogLines,
  scrollToLine,
}) => {
  const { sendEvent } = useLogWindowAnalytics();

  const clearButtonRef = useRef(null);
  const [clearButtonConfirmationOpen, setClearButtonConfirmationOpen] =
    useState(false);
  const [shareLine] = useQueryParam<number | undefined>(
    QueryParams.ShareLine,
    undefined,
  );
  const [bookmarks, setBookmarks] = useQueryParam<number[]>(
    QueryParams.Bookmarks,
    [],
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
    new Set([...bookmarks, shareLine ?? 0, failingLine ?? 0]),
  ).sort((a, b) => a - b);

  // Finds the corresponding index of a line number and scrolls to it.
  const scrollToIndex = (lineNumber: number): void => {
    const lineIndex = findLineIndex(processedLogLines, lineNumber);
    if (lineIndex !== -1) {
      scrollToLine(lineIndex);
    }
  };

  return (
    <Container>
      <Popconfirm
        data-cy="clear-bookmarks-popconfirm"
        onConfirm={() => {
          setBookmarks([]);
          sendEvent({ name: "Cleared All Bookmarks" });
        }}
        open={clearButtonConfirmationOpen}
        refEl={clearButtonRef}
        setOpen={setClearButtonConfirmationOpen}
      >
        <div>Are you sure you want to clear all bookmarks?</div>
      </Popconfirm>
      <Tooltip
        popoverZIndex={zIndex.tooltip}
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
              sendEvent({ name: "Navigated With Bookmark" });
              scrollToIndex(l);
            }}
          >
            <span>{l}</span>
            {l === shareLine && <StyledIcon glyph="Link" size="small" />}
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
