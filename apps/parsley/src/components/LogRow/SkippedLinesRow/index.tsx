import { useTransition } from "react";
import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import { Body, BodyProps } from "@leafygreen-ui/typography";
import { useLogWindowAnalytics } from "analytics";
import Icon from "components/Icon";
import { size } from "constants/tokens";
import { ExpandedLines, Range } from "types/logs";
import { Row } from "../types";

const SKIP_NUMBER = 5;

interface SkippedLinesRowProps extends Row {
  expandLines: (expandedLines: ExpandedLines) => void;
  range: Range;
}

const SkippedLinesRow: React.FC<SkippedLinesRowProps> = ({
  expandLines,
  range,
}) => {
  const { sendEvent } = useLogWindowAnalytics();
  const [, startTransition] = useTransition();
  const { end, start } = range;
  const numSkipped = end - start;
  const lineEndInclusive = end - 1;
  const canExpandFive = SKIP_NUMBER * 2 < numSkipped;
  const lineText =
    numSkipped !== 1 ? `${numSkipped} Lines Skipped` : "1 Line Skipped";

  const expandFive = () => {
    if (canExpandFive) {
      startTransition(() =>
        expandLines([
          [start, start + (SKIP_NUMBER - 1)],
          [lineEndInclusive - (SKIP_NUMBER - 1), lineEndInclusive],
        ]),
      );
    } else {
      startTransition(() => expandLines([[start, lineEndInclusive]]));
    }
    sendEvent({
      "line.count": canExpandFive ? SKIP_NUMBER * 2 : numSkipped,
      name: "Toggled expanded lines",
      open: true,
      option: "Five",
    });
  };

  const expandAll = () => {
    startTransition(() => expandLines([[start, lineEndInclusive]]));
    sendEvent({
      "line.count": numSkipped,
      name: "Toggled expanded lines",
      open: true,
      option: "All",
    });
  };

  return (
    <LineWrapper data-cy={`skipped-lines-row-${start}-${lineEndInclusive}`}>
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
    </LineWrapper>
  );
};

SkippedLinesRow.displayName = "SkippedLinesRow";

const LineWrapper = styled.div`
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

export default SkippedLinesRow;
