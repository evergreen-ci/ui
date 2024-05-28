import { useTransition } from "react";
import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import { Body, BodyProps } from "@leafygreen-ui/typography";
import { useLogWindowAnalytics } from "analytics";
import Icon from "components/Icon";
import { size } from "constants/tokens";
import { ExpandedLines, Range } from "types/logs";
import { RootRowProps } from "../types";

const SKIP_NUMBER = 5;

interface CollapsedRowProps extends RootRowProps {
  expandLines: (expandedLines: ExpandedLines) => void;
  range: Range;
}

const CollapsedRow: React.FC<CollapsedRowProps> = ({ expandLines, range }) => {
  const { sendEvent } = useLogWindowAnalytics();
  const [, startTransition] = useTransition();
  const { lineEnd, lineStart } = range;
  const numCollapsed = lineEnd - lineStart;
  const lineEndInclusive = lineEnd - 1;
  const canExpandFive = SKIP_NUMBER * 2 < numCollapsed;
  const lineText =
    numCollapsed !== 1 ? `${numCollapsed} Lines Skipped` : "1 Line Skipped";

  const expandFive = () => {
    if (canExpandFive) {
      startTransition(() =>
        expandLines([
          [lineStart, lineStart + (SKIP_NUMBER - 1)],
          [lineEndInclusive - (SKIP_NUMBER - 1), lineEndInclusive],
        ]),
      );
    } else {
      startTransition(() => expandLines([[lineStart, lineEndInclusive]]));
    }
    sendEvent({
      lineCount: canExpandFive ? SKIP_NUMBER * 2 : numCollapsed,
      name: "Expanded Lines",
      option: "Five",
    });
  };

  const expandAll = () => {
    startTransition(() => expandLines([[lineStart, lineEndInclusive]]));
    sendEvent({
      lineCount: numCollapsed,
      name: "Expanded Lines",
      option: "All",
    });
  };

  return (
    <CollapsedLineWrapper
      data-cy={`collapsed-row-${lineStart}-${lineEndInclusive}`}
    >
      <StyledBody>{lineText}</StyledBody>
      <ButtonContainer>
        <Button
          leftGlyph={<Icon glyph="UpDownCarets" />}
          onClick={expandAll}
          size="xsmall"
        >
          All
        </Button>
        <Button
          leftGlyph={<Icon glyph="UpDownCarets" />}
          onClick={expandFive}
          size="xsmall"
        >
          {SKIP_NUMBER} Above & Below
        </Button>
      </ButtonContainer>
    </CollapsedLineWrapper>
  );
};

CollapsedRow.displayName = "CollapsedRow";

const CollapsedLineWrapper = styled.div`
  display: flex;
  align-items: center;
  background-color: #f4f5f5; // Custom gray background color.
  padding: 2px 0;
  padding-left: ${size.l};
`;

const StyledBody = styled(Body)<BodyProps>`
  width: 150px;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: ${size.xs};
`;

export default CollapsedRow;
