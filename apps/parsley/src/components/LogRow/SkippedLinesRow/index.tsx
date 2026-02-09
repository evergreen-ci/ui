import { useTransition } from "react";
import styled from "@emotion/styled";
import { Button } from "@leafygreen-ui/button";
import { Body } from "@leafygreen-ui/typography";
import { Icon } from "@evg-ui/lib/components";
import { size } from "@evg-ui/lib/constants";
import { useLogWindowAnalytics } from "analytics";
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
  const lineText =
    numSkipped !== 1 ? `${numSkipped} Lines Skipped` : "1 Line Skipped";

  const expand = (direction: "above" | "below") => {
    startTransition(() =>
      expandLines([
        direction === "above"
          ? [start, start + (SKIP_NUMBER - 1)]
          : [lineEndInclusive - (SKIP_NUMBER - 1), lineEndInclusive],
      ]),
    );
    sendEvent({
      "line.count": SKIP_NUMBER < numSkipped ? SKIP_NUMBER : numSkipped,
      name: "Toggled expanded lines",
      open: true,
      option: `${SKIP_NUMBER} ${direction}`,
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
          leftGlyph={<Icon glyph="CaretUp" />}
          onClick={() => expand("above")}
          size="xsmall"
        >
          {SKIP_NUMBER} Above
        </Button>
        <Button
          leftGlyph={<Icon glyph="CaretDown" />}
          onClick={() => expand("below")}
          size="xsmall"
        >
          {SKIP_NUMBER} Below
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

const StyledBody = styled(Body)`
  width: 150px;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: ${size.xs};
`;

export default SkippedLinesRow;
