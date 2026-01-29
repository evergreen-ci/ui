import styled from "@emotion/styled";
import { Button } from "@leafygreen-ui/button";
import { Disclaimer } from "@leafygreen-ui/typography";
import Icon from "@evg-ui/lib/components/Icon";
import { size } from "@evg-ui/lib/constants/tokens";
import { useHistoryTable } from "./HistoryTableContext";

interface ColumnPaginationButtonProps {
  onClickNext?: () => void;
  onClickPrev?: () => void;
}

const ColumnPaginationButtons: React.FC<ColumnPaginationButtonProps> = ({
  onClickNext = () => {},
  onClickPrev = () => {},
}) => {
  const {
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    currentPage,
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    hasNextPage,
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    hasPreviousPage,
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    nextPage,
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    pageCount,
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    previousPage,
  } = useHistoryTable();
  const handleOnClickNext = () => {
    onClickNext();
    nextPage();
  };
  const handleOnClickPrev = () => {
    onClickPrev();
    previousPage();
  };
  return (
    <Container>
      <StyledButton
        data-cy="prev-page-button"
        disabled={!hasPreviousPage}
        leftGlyph={<Icon glyph="ChevronLeft" />}
        onClick={handleOnClickPrev}
      />
      <Disclaimer>
        {currentPage + 1} / {pageCount}
      </Disclaimer>
      <StyledButton
        data-cy="next-page-button"
        disabled={!hasNextPage}
        leftGlyph={<Icon glyph="ChevronRight" />}
        onClick={handleOnClickNext}
      />
    </Container>
  );
};

const StyledButton = styled(Button)`
  margin-right: ${size.xxs};
  margin-left: ${size.xxs};
`;

const Container = styled.div`
  align-self: flex-start;
  align-items: center;
  display: flex;
  flex-shrink: 0;
`;

export default ColumnPaginationButtons;
