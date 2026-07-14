import styled from "@emotion/styled";
import { Pagination as LGPagination } from "@leafygreen-ui/pagination";
import { PAGE_SIZES } from "../../constants/pagination";
import { size } from "../../constants/tokens";
import usePagination from "../../hooks/usePagination";

interface Props {
  countLimit?: number;
  currentPage: number;
  onPageChange?: (i: number) => void;
  onPageSizeChange?: (i: number) => void;
  pageSize: number;
  totalResults: number;
}

/**
 * Pagination component for navigating between pages of data. By default, it will update the page query param in the URL.
 * @param props - React props passed to the component
 * @param props.countLimit - optional count for the max value that was queried for. Used to display "many" instead of an exact number
 * @param props.currentPage - the current page
 * @param props.onPageChange - callback function to be called when the page changes
 * @param props.onPageSizeChange - callback function to be called when the page size changes
 * @param props.pageSize - maximum number of results per page
 * @param props.totalResults - total number of results
 * @returns The Pagination component
 */
export const Pagination: React.FC<Props> = ({
  countLimit,
  currentPage,
  onPageChange,
  onPageSizeChange,
  pageSize,
  totalResults,
}) => {
  const { setLimit, setPage } = usePagination();

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    onPageChange?.(newPage);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setLimit(newPageSize);
    onPageSizeChange?.(newPageSize);
  };

  const handlePrevClick = () => {
    handlePageChange(currentPage - 1);
  };
  const handleNextClick = () => {
    handlePageChange(currentPage + 1);
  };

  const numTotalItems =
    countLimit && totalResults >= countLimit ? undefined : totalResults;

  return (
    <StyledPagination
      currentPage={currentPage + 1}
      data-cy="pagination"
      itemsPerPage={pageSize ?? PAGE_SIZES[0]}
      itemsPerPageOptions={PAGE_SIZES}
      numTotalItems={numTotalItems}
      onBackArrowClick={handlePrevClick}
      onCurrentPageOptionChange={(value: string) => {
        handlePageChange(parseInt(value, 10) - 1);
      }}
      onForwardArrowClick={handleNextClick}
      onItemsPerPageOptionChange={(value: string) => {
        handlePageSizeChange(parseInt(value, 10));
      }}
    />
  );
};

const StyledPagination = styled(LGPagination)`
  gap: ${size.m};
  width: fit-content;
  // Prevent the inner items from shrinking in a flexbox.
  * {
    min-width: fit-content;
  }
`;
