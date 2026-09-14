import { Button } from "@leafygreen-ui/button";
import { Disclaimer } from "@leafygreen-ui/typography";
import Icon from "@evg-ui/lib/components/Icon";
import styles from "./ColumnPaginationButtons.module.css";
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
    <div className={styles.container}>
      <Button
        className={styles.button}
        data-testid="prev-page-button"
        disabled={!hasPreviousPage}
        leftGlyph={<Icon glyph="ChevronLeft" />}
        onClick={handleOnClickPrev}
      />
      <Disclaimer>
        {currentPage + 1} / {pageCount}
      </Disclaimer>
      <Button
        className={styles.button}
        data-testid="next-page-button"
        disabled={!hasNextPage}
        leftGlyph={<Icon glyph="ChevronRight" />}
        onClick={handleOnClickNext}
      />
    </div>
  );
};

export default ColumnPaginationButtons;
