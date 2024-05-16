import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import { Disclaimer } from "@leafygreen-ui/typography";
import Icon from "components/Icon";
import { size } from "constants/tokens";
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
    // @ts-ignore: FIXME. This comment was added by an automated script.
    currentPage,
    // @ts-ignore: FIXME. This comment was added by an automated script.
    hasNextPage,
    // @ts-ignore: FIXME. This comment was added by an automated script.
    hasPreviousPage,
    // @ts-ignore: FIXME. This comment was added by an automated script.
    nextPage,
    // @ts-ignore: FIXME. This comment was added by an automated script.
    pageCount,
    // @ts-ignore: FIXME. This comment was added by an automated script.
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
        disabled={!hasPreviousPage}
        onClick={handleOnClickPrev}
        data-cy="prev-page-button"
        leftGlyph={<Icon glyph="ChevronLeft" />}
      />
      <Disclaimer>
        {currentPage + 1} / {pageCount}
      </Disclaimer>
      <StyledButton
        disabled={!hasNextPage}
        onClick={handleOnClickNext}
        data-cy="next-page-button"
        leftGlyph={<Icon glyph="ChevronRight" />}
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
