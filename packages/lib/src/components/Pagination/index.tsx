import { Button, Size as ButtonSize } from "@leafygreen-ui/button";
import { Disclaimer } from "@leafygreen-ui/typography";
import usePagination from "../../hooks/usePagination";
import Icon from "../Icon";
import styles from "./index.module.css";

interface Props {
  countLimit?: number;
  currentPage: number;
  onChange?: (i: number) => void;
  totalResults: number;
  pageSize: number;
}

/**
 * Pagination component for navigating between pages of data
 * By default it will update the page query param in the URL
 * @param props - React props passed to the component
 * @param props.countLimit - optional count for the max value that was queried for. Used to display "many" instead of an exact number
 * @param props.currentPage - the current page
 * @param props.onChange - optional callback for when the page changes (Will override the default behavior of updating the URL query param)
 * @param props.totalResults - total number of results
 * @param props.pageSize - maximum number of results per page
 * @returns The Pagination component
 */
const Pagination: React.FC<Props> = ({
  countLimit,
  currentPage,
  onChange,
  pageSize,
  totalResults,
}) => {
  const { setPage } = usePagination();
  const handleChange = onChange || setPage;
  const numPages = Math.ceil(totalResults / pageSize);

  const handlePrevClick = () => {
    handleChange(currentPage - 1);
  };
  const handleNextClick = () => {
    handleChange(currentPage + 1);
  };

  const denominator =
    countLimit && totalResults >= countLimit ? "many" : numPages;

  return (
    <div className={styles.container} data-testid="pagination">
      <Button
        className={styles.button}
        data-testid="prev-page-button"
        disabled={currentPage === 0}
        leftGlyph={<Icon glyph="ChevronLeft" size="small" />}
        onClick={handlePrevClick}
        size={ButtonSize.Small}
      />
      <div className={styles.pageLabel}>
        <Disclaimer>
          {numPages > 0 ? currentPage + 1 : 0} / {denominator}
        </Disclaimer>
      </div>
      <Button
        className={styles.button}
        data-testid="next-page-button"
        disabled={numPages === 0 || currentPage === numPages - 1}
        leftGlyph={<Icon glyph="ChevronRight" size="small" />}
        onClick={handleNextClick}
        size={ButtonSize.Small}
      />
    </div>
  );
};

export default Pagination;
