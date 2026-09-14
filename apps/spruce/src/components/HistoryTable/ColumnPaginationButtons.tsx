import { Button } from "@via-ds/components/button";
import { Disclaimer } from "@via-ds/components/typography";
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
        aria-label="Previous page"
        className={styles.button}
        data-testid="prev-page-button"
        isDisabled={!hasPreviousPage}
        onPress={handleOnClickPrev}
      >
        <Icon glyph="ChevronLeft" />
      </Button>
      <Disclaimer>
        {currentPage + 1} / {pageCount}
      </Disclaimer>
      <Button
        aria-label="Next page"
        className={styles.button}
        data-testid="next-page-button"
        isDisabled={!hasNextPage}
        onPress={handleOnClickNext}
      >
        <Icon glyph="ChevronRight" />
      </Button>
    </div>
  );
};

export default ColumnPaginationButtons;
